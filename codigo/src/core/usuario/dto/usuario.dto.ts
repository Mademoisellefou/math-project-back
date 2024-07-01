import { CorreoLista, IsEmail, IsNotEmpty } from '../../../common/validation'

export class UsuarioDto {
  usuario?: string
  estado?: string
  contrasena?: string
  usuarioCreacion?: string
  primerApellido: string
  segundoApellido?: string
  nombres: string
}
