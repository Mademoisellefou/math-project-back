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

  async mensajeAleatorio( ) {
    const query = this.dataSource
      .getRepository(Mensaje)
      .createQueryBuilder('mensaje')
      .select([
        'mensaje.id',
        'mensaje.texto',
      ])
    return await query.getManyAndCount()
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Mensaje)
      .createQueryBuilder('mensaje')
      .select([
        'mensaje.id',
        'mensaje.texto',
      ])
      .take(limite)
      .skip(saltar)
    query.orderBy('mensaje.id', 'ASC')
    return await query.getManyAndCount()
  }

  async crear(mensajeDto: CrearMensajeDto, usuarioAuditoria: string) {
    const { texto  } = mensajeDto
    const mensaje = new Mensaje()
    mensaje.texto = texto
    mensaje.usuarioCreacion = usuarioAuditoria
    return await this.dataSource.getRepository(Mensaje).save(mensaje)
  }
}
