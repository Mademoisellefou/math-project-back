import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../common/validation'

export class ActualizarNotaDto {


  @ApiProperty({ example: '10' })
  intentos: number

  @ApiProperty({ example: '10' })
  puntaje: number

  @ApiProperty({ example: '10' })
  tiempoLeccion: number

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}


export class ColumnaReporteTiempo{
  Leccion: string
  PromedioTiempoResuelto: string
}
export class ColumnaReporteIntento{
  Leccion: string
  PromedioIntentos: string
}

export class EstadoReporte {
  mensaje: string 
  estado: boolean
  reporte: string
}