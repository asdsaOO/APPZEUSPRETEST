import { ActividadResDTO } from "./ActividadResDTO";

export type jRelacionParesResDTO = ActividadResDTO&{
  parametros: {
    pares : {izquierda:string, derecha:string}[]
  };
}