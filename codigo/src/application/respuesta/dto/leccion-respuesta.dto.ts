import { IsNotEmpty, IsOptional } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class ObtenerLeccionDto {
  @ApiProperty({ example: '5' })
  @IsNotEmpty()
  preguntasCorrectas: string
  // @ApiProperty({ example: '{ nota: \'34\', tiempoLeccion: \'34\'}' })
  // @IsNotEmpty()
  @ApiProperty({ example: '60' })
  @IsNotEmpty()
  tiempoLeccion: string
  // respuestas: RespuestasDto[]
}

export class RespuestasDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  idPregunta: string

  @ApiProperty({ example: 'falso' })
  @IsNotEmpty()
  esCorrecta?: boolean
}

export class RespuestaCrearRespuestaDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
