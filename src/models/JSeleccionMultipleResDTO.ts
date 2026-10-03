import { ActividadResDTO } from "./ActividadResDTO"

export type JSeleccionMultipleResDTO = ActividadResDTO&{
  parametros: {
    opcion1:string
    opcion2:string
    opcion3:string
    respuesta:string
  };
}