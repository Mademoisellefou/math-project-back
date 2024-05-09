import { ApiProperty } from '@nestjs/swagger'


export class ActualizarUsuarioRolDto {
  @ApiProperty({ example: 'testMAQ' })
  usuario?: string
  @ApiProperty({ example: 'false' })
  pruebaRealizada?: boolean
  @ApiProperty({ example: 'BAJO' })
  estadoTest?: string
  @ApiProperty({ example: '21' })
  total?: string
}
