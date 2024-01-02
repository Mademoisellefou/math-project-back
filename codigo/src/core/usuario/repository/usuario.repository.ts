import { TextService } from '../../../common/lib/text.service'
import { Persona } from '../entity/persona.entity'
import { Usuario } from '../entity/usuario.entity'
import { PersonaDto } from '../dto/persona.dto'
import { Status } from '../../../common/constants'
import { FiltrosUsuarioDto } from '../dto/filtros-usuario.dto'
import { Injectable } from '@nestjs/common'
import { Brackets, DataSource, EntityManager } from 'typeorm'
import { ActualizarUsuarioDto } from '../dto/actualizar-usuario.dto'
import { UsuarioDto } from '../dto/usuario.dto'
import { RolEnum } from 'src/core/authorization/rol.enum'

@Injectable()
export class UsuarioRepository {
  constructor(private dataSource: DataSource) { }

  async listar(paginacionQueryDto: FiltrosUsuarioDto) {
    const { limite, saltar, filtro, rol, orden, sentido } = paginacionQueryDto

    const query = this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.estado',
        'usuarioRol',
        'rol.id',
        'rol.rol',
        'persona.nroDocumento',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
      ])
      .where('usuarioRol.estado = :estado', { estado: Status.ACTIVE })
      .where('rol.id = :idRol', { idRol: '3' })
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'nroDocumento':
        query.addOrderBy('persona.nroDocumento', sentido)
        break
      case 'nombres':
        query.addOrderBy('persona.nombres', sentido)
        break
      case 'usuario':
        query.addOrderBy('usuario.usuario', sentido)
        break
      case 'rol':
        query.addOrderBy('rol.rol', sentido)
        break
      case 'estado':
        query.addOrderBy('usuario.estado', sentido)
        break
      default:
        query.addOrderBy('usuario.id', 'ASC')
    }

    if (rol) {
      query.andWhere('rol.id IN(:...roles)', {
        roles: rol,
      })
    }
    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('usuario.usuario ilike :filtro', { filtro: `%${filtro}%` })
          qb.orWhere('persona.nroDocumento ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('persona.nombres ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('persona.primerApellido ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('persona.segundoApellido ilike :filtro', {
            filtro: `%${filtro}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }
  async listarLecciones() {
    const query = this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.intentos',
        'usuario.estado',
        'usuarioRol.estado',
        'rol.nombre',
        'rol.rol',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
      ])
      .where('usuarioRol.estado = :estado', { estado: Status.ACTIVE })
      .where('rol.rol = :nombreRol', { nombreRol: RolEnum.ESTUDIANTE })
    return await query.getManyAndCount()
  }
  async recuperar() {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .getMany()
  }

  async buscarUsuario(usuario: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where({ usuario: usuario })
      .getOne()
  }
  async menuEstudiante() {
    return await [
      { nombre: 'Lecciones', ruta: '/leccion' },
      { nombre: 'Repaso', ruta: '/repaso' },
    ]
  }
  async menuAdministrador() {
    return await [
      { nombre: 'Reportes', ruta: '/record' },
      { nombre: 'Crear Cuenta', ruta: '/crear-cuenta' },
    ]
  }
  async buscarPorId(id: string, transaction?: EntityManager) {
    return await (
      transaction?.getRepository(Usuario) ??
      this.dataSource.getRepository(Usuario)
    )
      .createQueryBuilder('usuario')
      .where({ id: id })
      .getOne()
  }

  async buscarUsuarioRolPorId(id: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.contrasena',
        'usuario.estado',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.nroDocumento',
        'usuarioRol',
        'rol',
      ])
      .where({ id })
      .getOne()
  }

  async buscarUsuarioPorCI(persona: PersonaDto) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where('persona.nroDocumento = :ci', { ci: persona.nroDocumento })
      .getOne()
  }

  async verificarExisteUsuarioPorCI(ci: string, transaction: EntityManager) {
    const repo = transaction
      ? transaction.getRepository(Usuario)
      : this.dataSource.getRepository(Usuario)

    return await repo
      .createQueryBuilder('usuario')
      .leftJoin('usuario.persona', 'persona')
      .select('usuario.id')
      .where('persona.nroDocumento = :ci', { ci: ci })
      .getOne()
  }

  async obtenerLeccion(id: string) {
    const query = this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.usuario', 'usuario.estado'])
      .leftJoinAndSelect('usuario.leccion', 'leccion')
      .leftJoinAndSelect('leccion.preguntas', 'preguntas')
      .leftJoinAndSelect('preguntas.respuestas', 'respuestas')
      .where('usuario.id = :id', { id: id })
    return await query.getMany()
  }

  async buscarUsuarioPorCorreo(correo: string, transaction?: EntityManager) {
    return await (
      transaction?.getRepository(Usuario) ??
      this.dataSource.getRepository(Usuario)
    )
      .createQueryBuilder('usuario')
      .where('usuario.correoElectronico = :correo', { correo })
      .getOne()
  }

  async crear(
    idPersona: string,
    usuarioDto: UsuarioDto,
    usuarioAuditoria: string,
    idLeccion: string,
    transaction: EntityManager
  ) {
    return await transaction.getRepository(Usuario).save(
      new Usuario({
        idPersona: idPersona,
        usuario: usuarioDto.usuario,
        estado: usuarioDto?.estado ?? Status.CREATE,
        idLeccion: idLeccion,
        contrasena:
          usuarioDto?.contrasena ??
          (await TextService.encrypt(TextService.generateUuid())),
        usuarioCreacion: usuarioAuditoria,
      })
    )
  }
  async perfilUsuario(idUsuario: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.leccion', 'leccion')
      .select(['usuario.id', 'usuario.estado', 'leccion.titulo'])
      .where('usuario.id = :idUsuario', { idUsuario })
      .getOne()
  }
  async actualizar(
    idUsuario: string,
    usuarioDto: ActualizarUsuarioDto,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const repo = transaction
      ? transaction.getRepository(Usuario)
      : this.dataSource.getRepository(Usuario)

    const datosActualizar = new Usuario({
      idLeccion: usuarioDto.idLeccion || undefined,
      estado: usuarioDto.estado || undefined,
      contrasena: usuarioDto.contrasena || undefined,
      usuarioModificacion: usuarioAuditoria,
      intentos: usuarioDto.intentos || undefined
    })
    return await repo.update(idUsuario, datosActualizar)
  }

  async actualizarContadorBloqueos(idUsuario: string, intento: number) {
    return await this.dataSource
      .createQueryBuilder()
      .update(Usuario)
      .set({
        intentos: intento,
      })
      .where({ id: idUsuario })
      .execute()
  }

  async actualizarDatosActivacion(
    idUsuario: string,
    codigo: string,
    usuarioAuditoria: string,
    transaction: EntityManager
  ) {
    const datosActualizar = new Usuario({
      codigoActivacion: codigo,
      usuarioModificacion: usuarioAuditoria,
    })
    return await transaction
      .createQueryBuilder()
      .update(Usuario)
      .set(datosActualizar)
      .where({ id: idUsuario })
      .execute()
  }

  async actualizarDatosTransaccion(idUsuario: string, codigo: string) {
    return await this.dataSource
      .createQueryBuilder()
      .update(Usuario)
      .set({
        codigoTransaccion: codigo,
      })
      .where({ id: idUsuario })
      .execute()
  }

  async buscarPorCodigoDesbloqueo(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado',])
      .where('usuario.codigoDesbloqueo = :codigo', { codigo })
      .getOne()
  }

  async buscarPorCodigoRecuperacion(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado'])
      .where('usuario.codigoRecuperacion = :codigo', { codigo })
      .getOne()
  }

  async buscarPorCodigoTransaccion(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado'])
      .where('usuario.codigoTransaccion = :codigo', { codigo })
      .getOne()
  }

  async buscarPorCodigoActivacion(codigo: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado'])
      .where('usuario.codigoActivacion = :codigo', { codigo })
      .getOne()
  }

  async actualizarDatosPersona(persona: PersonaDto) {
    const datosActualizar = new Persona({
      ...persona,
    })
    return await this.dataSource
      .createQueryBuilder()
      .update(Persona)
      .set(datosActualizar)
      .where('nroDocumento = :nroDocumento', {
        nroDocumento: persona.nroDocumento,
      })
      .execute()
  }

  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op)
  }

  async ActualizarDatosPersonaId(
    idPersona: string,
    persona: PersonaDto,
    transaction?: EntityManager
  ) {
    const datosActualizar = new Persona({
      ...persona,
    })
    return await (
      transaction?.getRepository(Usuario) ??
      this.dataSource.getRepository(Usuario)
    )
      .createQueryBuilder()
      .update(Persona)
      .set(datosActualizar)
      .where('id = :id', {
        id: idPersona,
      })
      .execute()
  }

  async obtenerCodigoTest(idUsuario: string) {
    return await this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .select(['usuario.codigoActivacion', 'usuario.codigoDesbloqueo'])
      .where({ id: idUsuario })
      .getOne()
  }
}
