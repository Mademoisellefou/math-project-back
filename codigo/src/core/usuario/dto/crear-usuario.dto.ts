import { ApiProperty } from '@nestjs/swagger'
import {
  CorreoLista,
  IsEmail,
  IsNotEmpty,
  ValidateNested,
} from '../../../common/validation'
import { PersonaDto } from './persona.dto'
import { Type } from 'class-transformer'

export class CrearUsuarioDto {
  estado?: string
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  idLeccion: string
  @ApiProperty({ example: 'username' })
  @IsNotEmpty()
  usuario: string
  @ApiProperty({ example: '1234saad._' })
  @IsNotEmpty()
  contrasena: string
  @ApiProperty()
  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto

  @IsNotEmpty()
  @ApiProperty({ example: ['1'] })
  roles: Array<string>
  usuarioCreacion?: string
}
