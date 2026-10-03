export interface ActividadResDTO {
  id: number;
  idTipo: number;
  idTema: number;
  idSubtema: number;
  enunciado: string;
//metricas de evaluacion
  intentos: number;
  puntaje: number;
  rachaDiaria:number;
  rachaActividad:number
  resultado: boolean
  /** Duración acumulada de la actividad en milisegundos. */
  tiempo: number;
  

}
