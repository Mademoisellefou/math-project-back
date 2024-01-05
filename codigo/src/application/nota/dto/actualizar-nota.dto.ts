import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../common/validation'

export class ActualizarNotaDto {


  @ApiProperty({ example: '10' })
  intentos: number

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
