import { IsNotEmpty, IsOptional } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class ObtenerLeccionDto {
  @ApiProperty({ example: '[{"idPregunta":"1","esCorrecta": true}]' })
  @IsNotEmpty()
  respuestas: RespuestasDto[]
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
