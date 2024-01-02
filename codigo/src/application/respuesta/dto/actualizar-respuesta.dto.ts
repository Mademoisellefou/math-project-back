import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../common/validation'

export class ActualizarRespuestaDto {
  @ApiProperty({ example: 'TD-CI' })
  @IsNotEmpty()
  @ApiProperty({ example: 'TD-2' })
  codigo: string

  @ApiProperty({ example: 'LA respuesta es 2' })
  @IsNotEmpty()
  texto: string

  @ApiProperty({ example: 'falso' })
  @IsNotEmpty()
  es_correcta: boolean

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
