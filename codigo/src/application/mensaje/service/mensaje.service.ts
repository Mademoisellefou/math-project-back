import { BaseService } from '../../../common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { MensajeRepository } from '../repository'
import { CrearMensajeDto } from '../dto'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { Messages } from '../../../common/constants/response-messages'
import { ActualizarMensajeDto } from '../dto'
import { MensajeEstado } from '../constant'

@Injectable()
export class MensajeService extends BaseService {
  constructor(
    @Inject(MensajeRepository)
    private mensajeRepositorio: MensajeRepository
  ) {
    super()
  }

  async crear(mensajeDto: CrearMensajeDto, usuarioAuditoria: string) {
    return await this.mensajeRepositorio.crear(mensajeDto, usuarioAuditoria)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.mensajeRepositorio.listar(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    mensajeDto: ActualizarMensajeDto,
    usuarioAuditoria: string
  ) {
    const mensaje = await this.mensajeRepositorio.buscarPorId(id)
    if (!mensaje) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.mensajeRepositorio.actualizar(
      id,
      mensajeDto,
      usuarioAuditoria
    )
    return { id }
  }

  async activar(idMensaje: string, usuarioAuditoria: string) {
    const mensaje = await this.mensajeRepositorio.buscarPorId(idMensaje)
    if (!mensaje) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const mensajeDto = new ActualizarMensajeDto()
    mensajeDto.estado = MensajeEstado.ACTIVO
    await this.mensajeRepositorio.actualizar(
      idMensaje,
      mensajeDto,
      usuarioAuditoria
    )
    return {
      id: idMensaje,
      estado: mensajeDto.estado,
    }
  }

  async inactivar(idMensaje: string, usuarioAuditoria: string) {
    const mensaje = await this.mensajeRepositorio.buscarPorId(idMensaje)
    if (!mensaje) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const mensajeDto = new ActualizarMensajeDto()
    mensajeDto.estado = MensajeEstado.INACTIVO
    await this.mensajeRepositorio.actualizar(
      idMensaje,
      mensajeDto,
      usuarioAuditoria
    )
    return {
      id: idMensaje,
      estado: mensajeDto.estado,
    }
  }
}
