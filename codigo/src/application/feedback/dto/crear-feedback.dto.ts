import { IsNotEmpty, IsOptional } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearFeedbackDto {
  @ApiProperty({ example: 'TD-CI' })
  @IsNotEmpty()
  codigo: string

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  idPregunta: string

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  estado?: string
}

export class FeedbackCrearFeedbackDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
