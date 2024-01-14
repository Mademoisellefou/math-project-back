import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../common/validation'

export class Feeback {
  idPregunta: string
  texto: string
  respuesta: string
}
export class RepasoFeedbackDto {
  @ApiProperty({ example: 'repaso: [{idPregunta:"",texto:"",respuesta:""}]' })
  repaso: Feeback[]
}
