import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../common/validation'

export class ActualizarPreguntaDto {

  @ApiProperty({ example: 'Cuanto es 20x20?' })
  @IsNotEmpty()
  texto: string

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
