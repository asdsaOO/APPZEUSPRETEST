import { JAhorcadoResDTO } from "./JAhorcadoResDTO"
import { JCompletaFraseResDTO } from "./JcompletaFraseResDTO"
import { jRelacionParesResDTO } from "./JRelacionParesResDTO"
import { JSeleccionMultipleResDTO } from "./JSeleccionMultipleResDTO"


export interface LeccionResDTO{

  id?:number
  idUsuario:number
  puntuacion:number
  rachaActividad:number
  actividades: (JAhorcadoResDTO|JCompletaFraseResDTO|jRelacionParesResDTO|JSeleccionMultipleResDTO)[]
  


}
