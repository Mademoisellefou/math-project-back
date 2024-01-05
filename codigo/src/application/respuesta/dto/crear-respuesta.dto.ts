import { IsNotEmpty, IsOptional } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearRespuestaDto {
  @ApiProperty({ example: 'LA respuesta es 2' })
  @IsNotEmpty()
  texto: string

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  idPregunta: string

  @ApiProperty({ example: 'falso' })
  @IsNotEmpty()
  esCorrecta: boolean

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  estado?: string
}

export class RespuestaCrearRespuestaDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
