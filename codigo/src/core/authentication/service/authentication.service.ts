import { BaseService } from '../../../common/base'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { UsuarioService } from '../../usuario/service/usuario.service'
import { JwtService } from '@nestjs/jwt'
import { TextService } from '../../../common/lib/text.service'
import { RefreshTokensService } from './refreshTokens.service'
import {
  Status,
  USUARIO_NORMAL,
  USUARIO_SISTEMA,
} from '../../../common/constants'
import { Messages } from '../../../common/constants/response-messages'
import dayjs from 'dayjs'
import { PersonaDto } from '../../usuario/dto/persona.dto'
import { ConfigService } from '@nestjs/config'
import { PersonaService } from '../../usuario/service/persona.service'
import { TemplateEmailService } from '../../../common/templates/templates-email.service'
import { Usuario } from '../../usuario/entity/usuario.entity'
import { CambioRolDto } from '../dto/index.dto'

@Injectable()
export class AuthenticationService extends BaseService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly personaService: PersonaService,
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly refreshTokensService: RefreshTokensService,
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {
    super()
  }

  // private async verificarBloqueo(usuario: Usuario) {
  //   if (usuario.intentos < Configurations.WRONG_LOGIN_LIMIT) {
  //     return false
  //   }

  //   if (usuario.fechaBloqueo) {
  //     return !(usuario.fechaBloqueo && dayjs().isAfter(usuario.fechaBloqueo))
  //   }

  //   // generar código y fecha de desbloqueo
  //   const codigo = TextService.generateUuid()
  //   const fechaBloqueo = dayjs().add(
  //     Configurations.MINUTES_LOGIN_LOCK,
  //     'minute'
  //   )
  //   await this.usuarioService.actualizarDatosBloqueo(
  //     usuario.id,
  //     codigo,
  //     fechaBloqueo.toDate()
  //   )
  //   // enviar código por email
  //   const urlDesbloqueo = `${this.configService.get(
  //     'URL_FRONTEND'
  //   )}/desbloqueo?q=${codigo}`

  //   const template =
  //     TemplateEmailService.armarPlantillaBloqueoCuenta(urlDesbloqueo)

  //   await this.mensajeriaService.sendEmail(
  //     usuario.correoElectronico ?? '',
  //     Messages.SUBJECT_EMAIL_ACCOUNT_LOCKED,
  //     template
  //   )
  //   return true
  // }

  // async generarIntentoBloqueo(usuario: Usuario) {
  //   if (dayjs().isAfter(usuario.fechaBloqueo)) {
  //     // restaurar datos bloqueo
  //     await this.usuarioService.actualizarDatosBloqueo(usuario.id, null, null)
  //     await this.usuarioService.actualizarContadorBloqueos(usuario.id, 1)
  //     return
  //   }
  //   const intento = usuario.intentos + 1
  //   await this.usuarioService.actualizarContadorBloqueos(usuario.id, intento)
  // }

  async validarUsuario(usuario: string, contrasena: string) {
    const respuesta = await this.usuarioService.buscarUsuario(usuario)

    if (!respuesta) {
      return null
    }

    if (respuesta?.usuarioRol.length === 0) {
      throw new UnauthorizedException(Messages.NO_PERMISSION_USER)
    }

    if (respuesta?.estado === Status.PENDING) {
      throw new UnauthorizedException(Messages.PENDING_USER)
    }

    if (respuesta?.estado === Status.INACTIVE) {
      throw new UnauthorizedException(Messages.INACTIVE_USER)
    }

    // // verificar si la cuenta esta bloqueada
    // const verificacionBloqueo = await this.verificarBloqueo(respuesta)

    // if (verificacionBloqueo) {
    //   throw new UnauthorizedException(Messages.USER_BLOCKED)
    // }

    const pass = TextService.decodeBase64(contrasena)

    if (!(await TextService.compare(pass, respuesta.contrasena))) {
      throw new UnauthorizedException(Messages.INVALID_USER_CREDENTIALS)
    }
    // si se logra autenticar con éxito => reiniciar contador de intentos a 0
    // if (respuesta.intentos > 0) {
    //   await this.usuarioService.actualizarContadorBloqueos(respuesta.id, 0)
    // }

    return {
      id: respuesta.id,
      roles: respuesta.usuarioRol
        .filter((usuarioRol) => usuarioRol.estado === Status.ACTIVE)
        .map((usuarioRol) => usuarioRol.rol.rol),
    }
  }

  async autenticar(user: PassportUser) {
    const usuario = await this.usuarioService.buscarUsuarioId(user.id)

    const rol = this.usuarioService.obtenerRolActual(usuario.roles, user.idRol)

    const payload: PayloadType = {
      id: user.id,
      roles: user.roles,
      idRol: rol.idRol,
      rol: rol.rol,
    }
    // crear refresh_token
    const refreshToken = await this.refreshTokensService.create(user.id)
    // construir respuesta
    const data = {
      access_token: this.jwtService.sign(payload),
      ...usuario,
      idRol: rol.idRol,
      rol: rol.rol,
    }
    return {
      refresh_token: { id: refreshToken.id },
      data,
    }
  }

  async cambiarRol(user: PassportUser, data: CambioRolDto) {
    const usuarioRol = {
      ...user,
      idRol: data.idRol,
    }

    return await this.autenticar(usuarioRol)
  }
}
