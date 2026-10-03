
import type { ActividadResDTO } from './ActividadResDTO';

export type JCompletaFraseResDTO = ActividadResDTO & {
  parametros: {
    respuesta:string
  };
}
