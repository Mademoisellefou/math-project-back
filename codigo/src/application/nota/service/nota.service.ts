import { BaseService } from '../../../common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { NotaRepository } from '../repository'
import { CrearNotaDto } from '../dto'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { Messages } from '../../../common/constants/response-messages'
import { ActualizarNotaDto } from '../dto'
import { NotaEstado } from '../constant'

@Injectable()
export class NotaService extends BaseService {
  constructor(
    @Inject(NotaRepository)
    private notaRepositorio: NotaRepository
  ) {
    super()
  }

  async crear(notaDto: CrearNotaDto, usuarioAuditoria: string) {
    return await this.notaRepositorio.crear(notaDto, usuarioAuditoria)
  }
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.notaRepositorio.listar(paginacionQueryDto)
  }
  async actualizarDatos(
    id: string,
    notaDto: ActualizarNotaDto,
    usuarioAuditoria: string
  ) {
    const nota = await this.notaRepositorio.buscarPorId(id)
    if (!nota) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.notaRepositorio.actualizar(id, notaDto, usuarioAuditoria)
    return { id }
  }

  async buscarNotaUsuario(
    idLeccion: string,
    usuarioAuditoria: string
  ) {
    const nota = await this.notaRepositorio.buscarPorUsuarioLeccion(usuarioAuditoria, idLeccion)
    if (!nota) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    return nota
  }

  async activar(idNota: string, usuarioAuditoria: string) {
    const nota = await this.notaRepositorio.buscarPorId(idNota)
    if (!nota) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const notaDto = new ActualizarNotaDto()
    notaDto.estado = NotaEstado.ACTIVO
    await this.notaRepositorio.actualizar(idNota, notaDto, usuarioAuditoria)
    return {
      id: idNota,
      estado: notaDto.estado,
    }
  }

  async inactivar(idNota: string, usuarioAuditoria: string) {
    const nota = await this.notaRepositorio.buscarPorId(idNota)
    if (!nota) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const notaDto = new ActualizarNotaDto()
    notaDto.estado = NotaEstado.INACTIVO
    await this.notaRepositorio.actualizar(idNota, notaDto, usuarioAuditoria)
    return {
      id: idNota,
      estado: notaDto.estado,
    }
  }
}
