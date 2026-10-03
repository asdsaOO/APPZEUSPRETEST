import { api } from "@/config/api";
import { LeccionResDTO } from "@/models/LeccionResDTO";
import { ApiResponse } from "@/models/responses/ApiResponse";
import * as loginService from "@/Services/loginServices";
// La API usa guiones bajos; los componentes conservan camelCase.
type ActividadAPI<T> = T extends unknown
  ? Omit<T, 'idTipo' | 'idTema' | 'idSubtema'> & {
      id_tipo: number;
      id_tema: number;
      id_subtema: number;
    }
  : never;

type LeccionAPI = Omit<LeccionResDTO, 'actividades'> & {
  actividades: ActividadAPI<LeccionResDTO['actividades'][number]>[];
};



export async function obtenerLeccionesAleatorias():Promise<LeccionResDTO>{
  const session = await loginService.obtenerPayload()
  const res = await api.get<LeccionAPI>('/lessons/obtenerLeccionPrueba',{params:session})


  if (!res.data || !Array.isArray(res.data.actividades)) {
    throw new Error('La API no devolvió una lección con actividades');
  }
  //console.log(res.data);
  
  return {
    ...res.data,
    actividades: res.data.actividades.map(({ id_tipo, id_tema, id_subtema, ...actividad }) => ({
      ...actividad,
      idTipo: id_tipo,
      idTema: id_tema,
      idSubtema: id_subtema,
    })),
  }

}

export async function guardarLeccionRealizada(leccion:LeccionResDTO): Promise<ApiResponse[]>{
  const res = await api.post<ApiResponse[]>('/lessons/guardarLeccion', leccion)
  return res.data

}
