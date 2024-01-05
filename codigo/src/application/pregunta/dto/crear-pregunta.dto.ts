import { IsNotEmpty, IsOptional } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearPreguntaDto {

  @ApiProperty({ example: 'Cuanto es 20x20?' })
  @IsNotEmpty()
  texto: string

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  idLeccion: string

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  estado?: string
}

export class RespuestaCrearPreguntaDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
