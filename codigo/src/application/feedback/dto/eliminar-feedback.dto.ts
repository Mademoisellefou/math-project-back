import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../common/validation'

export class EliminarFeedbackDto {
  @ApiProperty({ example: '[{ id: 1}, { id: 2}]' })
  @IsNotEmpty()
  feedbacks: FeedbacksDto[]
}
export class FeedbacksDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
