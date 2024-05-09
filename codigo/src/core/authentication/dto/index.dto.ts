import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from '../../../common/validation'

export class CambioRolDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  idRol: string
}

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  token: string
}

export class AuthDto {
  @ApiProperty({
    example: 'profesoraEMA',
    description: 'Usuario',
  })
  usuario: string

  @ApiProperty({
    example: 'bXNjdGkyM0',
    description: 'Contraseña',
  })
  contrasena: string
}
