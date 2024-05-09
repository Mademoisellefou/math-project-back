import { BaseService } from '../../../common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PreguntaRepository } from '../repository'
import { CrearPreguntaDto } from '../dto'
import { Messages } from '../../../common/constants/response-messages'
import { ActualizarPreguntaDto } from '../dto'
import { PreguntaEstado } from '../constant'
import { UsuarioRepository } from 'src/core/usuario/repository/usuario.repository'

@Injectable()
export class PreguntaService extends BaseService {
  constructor(
    @Inject(PreguntaRepository)
    private preguntaRepositorio: PreguntaRepository,
    @Inject(UsuarioRepository)
    private usuarioRepositorio: UsuarioRepository,
  ) {
    super()
  }

  async crear(preguntaDto: CrearPreguntaDto, usuarioAuditoria: string) {
    return await this.preguntaRepositorio.crear(preguntaDto, usuarioAuditoria)
  }

  async listar(usuarioAuditora: string, idLeccion: string) {
    const usuario = await this.usuarioRepositorio.buscarPorId(usuarioAuditora);
    if (!usuario) throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    return await this.preguntaRepositorio.listar(idLeccion)
  }

  async actualizarDatos(
    id: string,
    preguntaDto: ActualizarPreguntaDto,
    usuarioAuditoria: string
  ) {
    const pregunta = await this.preguntaRepositorio.buscarPorId(id)
    if (!pregunta) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.preguntaRepositorio.actualizar(id, preguntaDto, usuarioAuditoria)
    return { id }
  }
  async preguntasLeccion(idLeccion: string, usuarioAuditoria: string) {
    if (!usuarioAuditoria) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.preguntaRepositorio.preguntasLeccion(idLeccion)
    return { idLeccion: idLeccion }
  }
  async activar(idPregunta: string, usuarioAuditoria: string) {
    const pregunta = await this.preguntaRepositorio.buscarPorId(idPregunta)
    if (!pregunta) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const preguntaDto = new ActualizarPreguntaDto()
    preguntaDto.estado = PreguntaEstado.ACTIVO
    await this.preguntaRepositorio.actualizar(
      idPregunta,
      preguntaDto,
      usuarioAuditoria
    )
    return {
      id: idPregunta,
      estado: preguntaDto.estado,
    }
  }

  async inactivar(idPregunta: string, usuarioAuditoria: string) {
    const pregunta = await this.preguntaRepositorio.buscarPorId(idPregunta)
    if (!pregunta) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const preguntaDto = new ActualizarPreguntaDto()
    preguntaDto.estado = PreguntaEstado.INACTIVO
    await this.preguntaRepositorio.actualizar(
      idPregunta,
      preguntaDto,
      usuarioAuditoria
    )
    return {
      id: idPregunta,
      estado: preguntaDto.estado,
    }
  }
}
