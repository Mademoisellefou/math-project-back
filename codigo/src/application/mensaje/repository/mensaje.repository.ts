import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarMensajeDto, CrearMensajeDto } from '../dto'
import { Mensaje } from '../entity'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'

@Injectable()
export class MensajeRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Mensaje)
      .createQueryBuilder('mensaje')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    mensajeDto: ActualizarMensajeDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar = new Mensaje({
      ...mensajeDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Mensaje)
      .update(id, datosActualizar)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Mensaje)
      .createQueryBuilder('mensaje')
      .select([
        'mensaje.id',
        'mensaje.idUsuario',
        'mensaje.texto',
        'mensaje.estado',
      ])
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'texto':
        query.addOrderBy('mensaje.nombre', sentido)
        break
      case 'estado':
        query.addOrderBy('mensaje.estado', sentido)
        break
      default:
        query.orderBy('mensaje.id', 'ASC')
    }
    return await query.getManyAndCount()
  }

  async crear(mensajeDto: CrearMensajeDto, usuarioAuditoria: string) {
    const { codigo, nombre, grupo, descripcion } = mensajeDto

    const mensaje = new Mensaje()
    mensaje.idUsuario = codigo
    mensaje.texto = nombre
    mensaje.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Mensaje).save(mensaje)
  }
}
