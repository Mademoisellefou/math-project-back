import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../common/validation'

export class ActualizarNotaDto {
  @ApiProperty({ example: 'TD-CI' })
  @IsNotEmpty()
  @ApiProperty({ example: 'TD-2' })
  codigo: string

  @ApiProperty({ example: 'puntaje' })
  puntaje: string

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
