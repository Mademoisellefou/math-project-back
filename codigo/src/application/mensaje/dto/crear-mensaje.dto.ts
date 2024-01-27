import { IsNotEmpty, IsOptional } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearMensajeDto {
  @ApiProperty({ example: 'esta bien esta el ejercicio??' })
  @IsNotEmpty()
  texto: string

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  estado?: string
}

export class RespuestaCrearMensajeDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
