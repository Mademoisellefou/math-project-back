import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../common/validation'

export class ActualizarRespuestaDto {


  @ApiProperty({ example: 'LA respuesta es 2' })
  @IsNotEmpty()
  texto: string

  @ApiProperty({ example: 'falso' })
  @IsNotEmpty()
  esCorrecta: boolean

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
