import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../common/validation'

export class Feeback {
  idPregunta: string
  texto: string
  respuesta: string
}
export class RepasoFeedbackDto {
  @ApiProperty({ example: '[{ id: 1}, { id: 2}]' })
  // @IsNotEmpty()
  repaso: Feeback[]
}
