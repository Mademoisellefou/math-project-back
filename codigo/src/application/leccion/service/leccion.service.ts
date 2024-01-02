import { BaseService } from '../../../common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { LeccionRepository } from '../repository'
import { CrearLeccionDto } from '../dto'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { Messages } from '../../../common/constants/response-messages'
import { ActualizarLeccionDto } from '../dto'
import { LeccionEstado } from '../constant'

@Injectable()
export class LeccionService extends BaseService {
  constructor(
    @Inject(LeccionRepository)
    private leccionRepositorio: LeccionRepository
  ) {
    super()
  }

  async crear(leccionDto: CrearLeccionDto, usuarioAuditoria: string) {
    const leccionRepetido = await this.leccionRepositorio.buscarCodigo(
      leccionDto.codigo
    )

    if (leccionRepetido) {
      throw new ConflictException(Messages.REPEATED_PARAMETER)
    }

    return await this.leccionRepositorio.crear(leccionDto, usuarioAuditoria)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.leccionRepositorio.listar(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    leccionDto: ActualizarLeccionDto,
    usuarioAuditoria: string
  ) {
    const leccion = await this.leccionRepositorio.buscarPorId(id)
    if (!leccion) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.leccionRepositorio.actualizar(id, leccionDto, usuarioAuditoria)
    return { id }
  }

  async activar(idLeccion: string, usuarioAuditoria: string) {
    const leccion = await this.leccionRepositorio.buscarPorId(idLeccion)
    if (!leccion) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const leccionDto = new ActualizarLeccionDto()
    leccionDto.estado = LeccionEstado.ACTIVO
    await this.leccionRepositorio.actualizar(
      idLeccion,
      leccionDto,
      usuarioAuditoria
    )
    return {
      id: idLeccion,
      estado: leccionDto.estado,
    }
  }

  async inactivar(idLeccion: string, usuarioAuditoria: string) {
    const leccion = await this.leccionRepositorio.buscarPorId(idLeccion)
    if (!leccion) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const leccionDto = new ActualizarLeccionDto()
    leccionDto.estado = LeccionEstado.INACTIVO
    await this.leccionRepositorio.actualizar(
      idLeccion,
      leccionDto,
      usuarioAuditoria
    )
    return {
      id: idLeccion,
      estado: leccionDto.estado,
    }
  }
}
