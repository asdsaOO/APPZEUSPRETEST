import { api } from "@/config/api";
import { DatosGeneralesResDToO } from "@/models/DatosGeneralesResDTO";
import * as loginServioces from "@/Services/loginServices";


export async function obtenerDatosGenerales(): Promise<DatosGeneralesResDToO> {
  const payload = await loginServioces.obtenerPayload();

  if (!payload) {
    throw new Error('No hay una sesión iniciada');
  }

  const res = await api.get<DatosGeneralesResDToO>(
    '/resultados/obtenerPuntajeGeneral',
    {
      params: { idUsuario: payload.idUsuario },
    }
  );
  

  return res.data;
}