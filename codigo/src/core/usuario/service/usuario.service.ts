import { BaseService } from '../../../common/base'
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { UsuarioRepository } from '../repository/usuario.repository'
import {
  LECCION,
  Modo,
  Status,
  USUARIO_NORMAL,
} from '../../../common/constants'
import { CrearUsuarioDto } from '../dto/crear-usuario.dto'
import { TextService } from '../../../common/lib/text.service'
import { Messages } from '../../../common/constants/response-messages'
import { AuthorizationService } from '../../authorization/controller/authorization.service'
import { PersonaDto } from '../dto/persona.dto'
import { UsuarioRolRepository } from '../../authorization/repository/usuario-rol.repository'
import { ActualizarUsuarioRolDto } from '../dto/actualizar-usuario-rol.dto'
import { ConfigService } from '@nestjs/config'
import { TemplateEmailService } from '../../../common/templates/templates-email.service'
import { FiltrosUsuarioDto } from '../dto/filtros-usuario.dto'
import { RolRepository } from '../../authorization/repository/rol.repository'
import { EntityManager } from 'typeorm'
import {
  NuevaContrasenaDto,
} from '../dto/recuperar-cuenta.dto'
import { PersonaRepository } from '../repository/persona.repository'
import { FeedbackRepository } from 'src/application/feedback/repository'
import { RolEnum } from 'src/core/authorization/rol.enum'
import { NotaRepository } from 'src/application/nota/repository'
import { LeccionRepository } from 'src/application/leccion/repository'
import { UsuarioNotaDto } from '../dto/usuario-nota.dto'
import { conseguirNivel } from '../constantes'

@Injectable()
export class UsuarioService extends BaseService {
  constructor(
    @Inject(UsuarioRepository)
    private usuarioRepositorio: UsuarioRepository,
    @Inject(UsuarioRolRepository)
    private usuarioRolRepositorio: UsuarioRolRepository,
    @Inject(RolRepository)
    private rolRepositorio: RolRepository,
    @Inject(FeedbackRepository)
    private feedbackRepositorio: FeedbackRepository,
    @Inject(NotaRepository)
    private notaRepositorio: NotaRepository,
    @Inject(LeccionRepository)
    private leccionRepositorio: LeccionRepository,
    @Inject(PersonaRepository)
    private personaRepositorio: PersonaRepository,
    private readonly authorizationService: AuthorizationService,
    private configService: ConfigService
  ) {
    super()
  }
  async recordEstudiante(idUsuario: string) {
    return await this.usuarioRepositorio.recordEstudiante(idUsuario)
  }
  async record(usuarioAuditoria: string, usuarioRol: string) {
    if (!usuarioAuditoria || !usuarioRol)
      throw new PreconditionFailedException(Messages.EXISTING_USER)
    const listaNotas = await this.usuarioRepositorio.record();    
    const listaFinal: UsuarioNotaDto[] = []
    for (let index = 0; index < listaNotas[0].length; index++) {
      const itemx = listaNotas[0][index];
      const el = new UsuarioNotaDto()
      el.usuario = itemx.usuario
      el.nombres = itemx.nombres
      el.primerApellido = itemx.primerApellido
      el.segundoApellido = itemx.segundoApellido
      el.lecciones = []
      for (let index1 = 0; index1 < itemx.notas.length; index1++) {
        const item = itemx.notas[index1];
        el.lecciones.push({ puntaje: item.puntaje, nombre: item.leccion.titulo.replaceAll(" ", "_") })
      }
      listaFinal.push(el)
    }


    return listaFinal
  }

  async listar(@Query() paginacionQueryDto: FiltrosUsuarioDto) {
    return await this.usuarioRepositorio.listarLecciones()
  }

  async listaLecciones() {
    return await this.leccionRepositorio.listaLecciones()
  }

  async menu(idUsuario: string, rol: string) {
    if (!idUsuario)
      throw new PreconditionFailedException(Messages.INACTIVE_USER)
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)
    if (!usuario) throw new PreconditionFailedException(Messages.INACTIVE_USER)
    if (RolEnum.ESTUDIANTE === rol) {
      if (usuario.estado === Status.COMPLETED)
        return await this.usuarioRepositorio.menuCompletado();
      else { return await this.usuarioRepositorio.menuEstudiante() }
    }
    if (RolEnum.ADMINISTRADOR === rol) {
      return await this.usuarioRepositorio.menuAdministrador()
    }
  }

  async buscarUsuario(usuario: string) {
    return await this.usuarioRepositorio.buscarUsuario(usuario)
  }
  async crearReporte(usuario: string) {

  }
  async crear(usuarioDto: CrearUsuarioDto, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.buscarUsuario(
      usuarioDto.usuario
    )

    if (usuario) {
      throw new PreconditionFailedException(Messages.EXISTING_USER)
    }

    const { roles } = usuarioDto

    const contrasena = usuarioDto.contrasena


    const op = async (transaction: EntityManager) => {
      usuarioDto.contrasena = await TextService.encrypt(contrasena)
      usuarioDto.estado = Status.ACTIVE
      const usuario = await this.usuarioRepositorio.crear(
        {
          ...usuarioDto,
          usuario: usuarioDto.usuario ?? 'none',
        },
        usuarioAuditoria,
        usuarioDto.idLeccion,
        transaction
      )

      await this.usuarioRolRepositorio.crear(
        usuario.id,
        roles,
        usuarioAuditoria,
        transaction
      )

      // const lecciones = await this.leccionRepositorio.listaLecciones()
      // for (let index = 0; index < lecciones.length; index++) {
      //   await this.notaRepositorio.crearUsuario({
      //     intentos: 0,
      //     idLeccion: lecciones[index].id,
      //   }, usuario.id, transaction)
      // }
      // await this.notaRepositorio.crearUsuario({
      //   intentos: 0,
      //   idLeccion: LECCION.INICIAL,
      // }, usuario.id, transaction)
      return {
        finalizado: true,
        mensaje: 'Registro creado con éxito.',
        datos: {
          usuario: usuario.usuario,
          estado: usuario.estado,
          idLeccion: usuario.idLeccion,
          usuarioCreacion: usuario.usuarioCreacion,
          transaccion: usuario.transaccion,
          id: usuario.id,
        },
      }
    }

    const crearResult = await this.usuarioRepositorio.runTransaction(op)
    return crearResult
  }


  async nuevaContrasenaTransaccion(nuevaContrasenaDto: NuevaContrasenaDto) {
    const usuario = await this.usuarioRepositorio.buscarPorCodigoTransaccion(
      nuevaContrasenaDto.codigo
    )

    if (!usuario) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    if (
      !TextService.validateLevelPassword(nuevaContrasenaDto.contrasenaNueva)
    ) {
      throw new PreconditionFailedException(Messages.INVALID_PASSWORD_SCORE)
    }

    await this.usuarioRepositorio.actualizar(
      usuario.id,
      {
        // intentos: 0,
        codigoDesbloqueo: null,
        contrasena: await TextService.encrypt(
          TextService.decodeBase64(nuevaContrasenaDto.contrasenaNueva)
        ),
        estado: Status.ACTIVE,
      },
      usuario.id
    )

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    return { id: usuarioActualizado.id }
  }

  async perfilUsuario(idUsuario: string, usuarioAuditoria: string) {
    if (!usuarioAuditoria) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const preguntasRepaso =
      await this.feedbackRepositorio.repasoUsuario(usuarioAuditoria)
    if (preguntasRepaso.length > 0) {
      return {
        modo: Modo.REPASO,
      }
    } else {
      return {
        modo: Modo.LECCION,
      }
    }
  }
  async activar(idUsuario: string, usuarioAuditoria: string) {
    this.verificarPermisos(idUsuario, usuarioAuditoria)
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)
    const statusValid = [Status.CREATE, Status.INACTIVE, Status.PENDING]

    if (!(usuario && statusValid.includes(usuario.estado as Status))) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    // cambiar estado al usuario y generar una nueva contrasena
    const contrasena = TextService.generateShortRandomText()

    await this.usuarioRepositorio.actualizar(
      idUsuario,
      {
        contrasena: await TextService.encrypt(contrasena),
        estado: Status.ACTIVE,
      },
      usuarioAuditoria
    )

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    return { id: usuarioActualizado.id, estado: usuarioActualizado.estado }
  }

  async inactivar(idUsuario: string, usuarioAuditoria: string) {
    this.verificarPermisos(idUsuario, usuarioAuditoria)
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)

    if (!usuario) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    await this.usuarioRepositorio.actualizar(
      idUsuario,
      {
        estado: Status.INACTIVE,
      },

      usuarioAuditoria
    )

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    return {
      id: usuarioActualizado.id,
      estado: usuarioActualizado.estado,
    }
  }

  async enviarCorreoContrasenia(
    datosCorreo: { correo: string; asunto: Messages },
    usuario: string,
    contrasena: string
  ) {
    const url = this.configService.get('URL_FRONTEND')
    const template = TemplateEmailService.armarPlantillaActivacionCuenta(
      url,
      usuario,
      contrasena
    )
    return []
  }

  verificarPermisos(usuarioAuditoria: string, id: string) {
    if (usuarioAuditoria === id) {
      throw new ForbiddenException(Messages.EXCEPTION_OWN_ACCOUNT_ACTION)
    }
  }
  async actualizarContrasena(
    idUsuario: string,
    contrasenaActual: string,
    contrasenaNueva: string
  ) {
    const hash = TextService.decodeBase64(contrasenaActual)
    const usuario =
      await this.usuarioRepositorio.buscarUsuarioRolPorId(idUsuario)

    if (!(usuario && (await TextService.compare(hash, usuario.contrasena)))) {
      throw new PreconditionFailedException(Messages.INVALID_CREDENTIALS)
    }
    // validar que la contraseña nueva cumpla nivel de seguridad
    const contrasena = TextService.decodeBase64(contrasenaNueva)

    if (!TextService.validateLevelPassword(contrasena)) {
      throw new PreconditionFailedException(Messages.INVALID_PASSWORD_SCORE)
    }

    // guardar en bd
    await this.usuarioRepositorio.actualizar(
      idUsuario,
      {
        contrasena: await TextService.encrypt(contrasena),
        estado: Status.ACTIVE,
      },
      idUsuario
    )

    const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
      usuario.id
    )

    if (!usuarioActualizado) {
      throw new PreconditionFailedException(Messages.INVALID_USER)
    }

    return {
      id: usuarioActualizado.id,
      estado: usuarioActualizado.estado,
    }
  }

  async restaurarContrasena(idUsuario: string, usuarioAuditoria: string) {
    this.verificarPermisos(idUsuario, usuarioAuditoria)
    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario)
    const statusValid = [Status.ACTIVE, Status.PENDING]

    if (!(usuario && statusValid.includes(usuario.estado as Status))) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    const op = async (transaccion: EntityManager) => {
      const contrasena = TextService.generateShortRandomText()
      await this.usuarioRepositorio.actualizar(
        idUsuario,
        {
          contrasena: await TextService.encrypt(contrasena),
        },
        usuarioAuditoria,
        transaccion
      )

      const usuarioActualizado = await this.usuarioRepositorio.buscarPorId(
        idUsuario,
        transaccion
      )

      if (!usuarioActualizado) {
        throw new NotFoundException(Messages.INVALID_USER)
      }

      return usuarioActualizado
    }

    const usuarioResult = await this.usuarioRepositorio.runTransaction(op)

    return { id: usuarioResult.id, estado: usuarioResult.estado }
  }

  async actualizarDatos(
    id: string,
    usuarioDto: ActualizarUsuarioRolDto,
    usuarioAuditoria: string
  ) {

    // this.verificarPermisos(id, usuarioAuditoria)
    // 1. verificar que exista el usuario
    // const op = async (transaction: EntityManager) => {
    //   const usuario = await this.usuarioRepositorio.buscarPorId(id, transaction)

    //   if (!usuario) {
    //     throw new NotFoundException(Messages.INVALID_USER)
    //   }

    // const { persona } = usuarioDto

    // if (persona) {
    // const personaResult = await this.personaRepositorio.buscarPersonaId(
    //   usuario.idPersona,
    //   transaction
    // )
    // if (!personaResult) {
    //   throw new PreconditionFailedException(Messages.INVALID_USER)
    // }

    // await this.usuarioRepositorio.ActualizarDatosPersonaId(
    //   personaResult.id,
    //   persona,
    //   transaction
    // )
    // }

    // const { roles } = usuarioDto

    // if (roles.length > 0) {
    //   // realizar reglas de roles
    //   await this.actualizarRoles(id, roles, usuarioAuditoria, transaction)
    // }

    // return { id: usuario.id }

    
    const usuario = await this.usuarioRepositorio.buscarPorId(id)

    if (!usuario) {
      throw new NotFoundException(Messages.INVALID_USER)
    }

    let nuevoEstadoTest = usuarioDto?.estadoTest ?? usuario?.estadoTest;
    if(usuarioDto?.total){
      nuevoEstadoTest = conseguirNivel(usuarioDto.total)
    }
    let nuevaPruebaRealizar= false;
    if(usuarioDto?.pruebaRealizada!==undefined){
      nuevaPruebaRealizar=usuarioDto?.pruebaRealizada; 
    }else{
      nuevaPruebaRealizar=usuario?.pruebaRealizada;
    }
    
    await this.usuarioRepositorio.actualizar(
      id,
      {
          usuario: usuarioDto?.usuario ?? usuario?.usuario,
          pruebaRealizada: nuevaPruebaRealizar,
          estadoTest: nuevoEstadoTest,
      },
      usuarioAuditoria
    )

    //  }

    // const usuarioResult = await this.usuarioRepositorio.runTransaction(op)
    const usuarioResult = await this.usuarioRepositorio.buscarPorId(id)
    return {
      usuario: usuarioResult?.usuario,
      estado: usuarioResult?.estado,
      pruebaRealizada: usuarioResult?.pruebaRealizada,
      estadoTest: usuarioResult?.estadoTest
    }
  }

  async actualizarRoles(
    id: string,
    roles: Array<string>,
    usuarioAuditoria: string,
    transaccion?: EntityManager
  ) {
    const usuarioRoles =
      await this.usuarioRolRepositorio.obtenerRolesPorUsuario(id, transaccion)

    const { inactivos, activos, nuevos } = this.verificarUsuarioRoles(
      usuarioRoles,
      roles
    )

    // ACTIVAR roles inactivos
    if (inactivos.length > 0) {
      await this.usuarioRolRepositorio.activar(
        id,
        inactivos,
        usuarioAuditoria,
        transaccion
      )
    }
    // INACTIVAR roles activos
    if (activos.length > 0) {
      await this.usuarioRolRepositorio.inactivar(
        id,
        activos,
        usuarioAuditoria,
        transaccion
      )
    }
    // CREAR nuevos roles
    if (nuevos.length > 0) {
      await this.usuarioRolRepositorio.crear(
        id,
        nuevos,
        usuarioAuditoria,
        transaccion
      )
    }
  }

  verificarUsuarioRoles(
    usuarioRoles: Array<{
      rol: { id: string }
      estado: string
    }>,
    roles: Array<string>
  ) {
    const inactivos = roles.filter((rol) =>
      usuarioRoles.some(
        (usuarioRol) =>
          usuarioRol.rol.id === rol && usuarioRol.estado === Status.INACTIVE
      )
    )

    const activos = usuarioRoles
      .filter(
        (usuarioRol) =>
          !roles.includes(usuarioRol.rol.id) &&
          usuarioRol.estado === Status.ACTIVE
      )
      .map((usuarioRol) => usuarioRol.rol.id)

    const nuevos = roles.filter((rol) =>
      usuarioRoles.every((usuarioRol) => usuarioRol.rol.id !== rol)
    )

    return {
      activos,
      inactivos,
      nuevos,
    }
  }

  async buscarUsuarioPerfil(id: string, idRol: string) {
    const perfil = await this.buscarUsuarioId(id)
    return { ...perfil, idRol }
  }

  async buscarUsuarioId(id: string) {
    const usuario = await this.usuarioRepositorio.buscarUsuarioRolPorId(id)

    if (!usuario) {
      throw new NotFoundException(Messages.INVALID_USER)
    }
    return {
      id: usuario.id,
      pruebaRealizada: usuario.pruebaRealizada,
      usuario: usuario.usuario,
      idLeccion: usuario.idLeccion,
      leccion: usuario.leccion.titulo,
      estado: usuario.estado,
      roles: await Promise.all(
        usuario.usuarioRol
          .filter((value) => value.estado === Status.ACTIVE)
          .map(async (usuarioRol) => {
            const { id, rol, nombre } = usuarioRol.rol
            return {
              idRol: id,
              rol,
              nombre,
            }
          })
      ),
    }
  }

  async buscarUsuarioPorCI(persona: PersonaDto) {
    return await this.usuarioRepositorio.buscarUsuarioPorCI(persona)
  }

  // async actualizarContadorBloqueos(idUsuario: string, intento: number) {
  //   return await this.usuarioRepositorio.actualizarContadorBloqueos(
  //     idUsuario,
  //     intento
  //   )
  // }


  async actualizarDatosTransaccionRecuperacion(
    idUsuario: string,
    codigo: string
  ) {
    return await this.usuarioRepositorio.actualizarDatosTransaccion(
      idUsuario,
      codigo
    )
  }

  // async desbloquearCuenta(codigo: string) {
  //   const usuario =
  //     await this.usuarioRepositorio.buscarPorCodigoDesbloqueo(codigo)
  //   if (usuario?.fechaBloqueo) {
  //     await this.usuarioRepositorio.actualizar(
  //       usuario.id,
  //       {
  //         fechaBloqueo: null,
  //         intentos: 0,
  //         codigoDesbloqueo: null,
  //       },
  //       USUARIO_NORMAL
  //     )
  //   }
  //   return { codigo }
  // }

  async actualizarDatosPersona(datosPersona: PersonaDto) {
    return await this.usuarioRepositorio.actualizarDatosPersona(datosPersona)
  }

  obtenerRolActual(
    roles: Array<{ idRol: string; rol: string }>,
    idRol: string | null | undefined
  ) {
    if (roles.length < 1) {
      throw new UnauthorizedException(`El usuario no cuenta con roles.`)
    }

    // buscar el primer rol
    if (!idRol) {
      return roles[0]
    }

    // buscar el rol activo
    const rol = roles.find((item) => item.idRol === idRol)
    if (!rol) {
      throw new UnauthorizedException(`Rol no permitido.`)
    }
    return rol
  }

  async obtenerCodigoTest(idUser: string) {
    return await this.usuarioRepositorio.obtenerCodigoTest(idUser)
  }
}
