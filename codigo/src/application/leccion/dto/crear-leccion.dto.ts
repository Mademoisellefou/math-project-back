import { IsNotEmpty, IsOptional } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CrearLeccionDto {
  @ApiProperty({ example: 'TD-CI' })
  @IsNotEmpty()
  codigo: string

  @ApiProperty({ example: 'Porcentaje' })
  @IsNotEmpty()
  titulo: string

  @ApiProperty({ example: 'id de la siguiente leccion' })
  @IsNotEmpty()
  siguiente: string

  @ApiProperty({ example: 'Calculo de reparticion' })
  @IsNotEmpty()
  descripcion: string

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  estado?: string
}

export class RespuestaCrearLeccionDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
