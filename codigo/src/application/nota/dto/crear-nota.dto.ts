import { IsNotEmpty, IsOptional } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearNotaDto {

  @ApiProperty({ example: '10' })
  intentos: number

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  estado?: string

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  idLeccion: string

}

export class RespuestaCrearNotaDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
