import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../common/validation'

export class ActualizarLeccionDto {
  @ApiProperty({ example: 'TD-CI' })
  @IsNotEmpty()
  @ApiProperty({ example: 'TD-2' })
  codigo: string

  @ApiProperty({ example: 'Porcentaje' })
  @IsNotEmpty()
  titulo: string

  @ApiProperty({ example: 'Calculo de reparto' })
  descripcion: string

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}
