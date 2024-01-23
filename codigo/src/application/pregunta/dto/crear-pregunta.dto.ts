import { IsNotEmpty, IsOptional } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearPreguntaDto {

  @ApiProperty({ example: 'Mi pregunta es ' })
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
