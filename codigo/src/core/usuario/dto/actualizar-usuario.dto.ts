import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class ActualizarUsuarioDto {
  @ApiProperty()
  @IsOptional()
  estado?: string | null

  @ApiProperty()
  @IsOptional()
  usuario?: string

  @ApiProperty()
  @IsOptional()
  idLeccion?: string

  @ApiProperty()
  @IsOptional()
  contrasena?: string | null

  @ApiProperty()
  @IsOptional()
  intentos?: number | null


  @ApiProperty()
  @IsOptional()
  codigoDesbloqueo?: string | null

  @ApiProperty({ example: 'false' })
  pruebaRealizada?: boolean
  
  @ApiProperty({ example: 'BAJO' })
  estadoTest?: string | null

}
