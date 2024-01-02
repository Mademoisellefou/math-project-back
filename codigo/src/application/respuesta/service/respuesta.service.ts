import { BaseService } from '../../../common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { RespuestaRepository } from '../repository'
import { CrearRespuestaDto } from '../dto'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { Messages } from '../../../common/constants/response-messages'
import { ActualizarRespuestaDto } from '../dto'
import { RespuestaEstado } from '../constant'
import { ObtenerLeccionDto, RespuestasDto } from '../dto/leccion-respuesta.dto'
import { FeedbackRepository } from 'src/application/feedback/repository'
import { LeccionRepository } from 'src/application/leccion/repository'
import { UsuarioRepository } from 'src/core/usuario/repository/usuario.repository'

@Injectable()
export class RespuestaService extends BaseService {
  constructor(
    @Inject(RespuestaRepository)
    private respuestaRepositorio: RespuestaRepository,
    @Inject(FeedbackRepository)
    private feedbackRepositorio: FeedbackRepository,
    @Inject(UsuarioRepository)
    private usuarioRepositorio: UsuarioRepository,
    @Inject(LeccionRepository)
    private leccionRepositorio: LeccionRepository
  ) {
    super()
  }
  async respuestasLeccion(
    respuestaDto: ObtenerLeccionDto,
    usuarioAuditoria: string
  ) {
    if (!usuarioAuditoria) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const respuestas: RespuestasDto[] = []
    for (let index = 0; index < respuestaDto.respuestas.length; index++) {
      const element = respuestaDto.respuestas[index]
      const item = await this.feedbackRepositorio.buscarPorIdPregunta(
        element.idPregunta
      )
      if (!item || item === null) {
        respuestas.push(element)
      }
    }
    const respuestaLeccion = new ObtenerLeccionDto()
    respuestaLeccion.respuestas = []
    if (respuestas.length > 0) {
      respuestaLeccion.respuestas = respuestas
    }
    const repaso = await this.respuestaRepositorio.respuestasLeccion(
      respuestaLeccion,
      usuarioAuditoria
    )
    if (repaso.length < 1) {
      const usuarioLeccionId =
        await this.usuarioRepositorio.buscarPorId(usuarioAuditoria)
      if (!usuarioLeccionId) {
        throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
      }
      const leccion = await this.leccionRepositorio.buscarPorId(
        usuarioLeccionId.idLeccion
      )
      if (!leccion) {
        throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
      }
      await this.usuarioRepositorio.actualizar(
        usuarioAuditoria,
        {
          idLeccion: leccion?.siguiente,
        },
        usuarioAuditoria
      )
    } else {
      const usuarioRespuestas = await this.usuarioRepositorio.buscarPorId(usuarioAuditoria)
      if (!usuarioRespuestas) {
        throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
      }
      await this.usuarioRepositorio.actualizar(
        usuarioAuditoria,
        {
          intentos: usuarioRespuestas.intentos + 1
        },
        usuarioAuditoria
      )
    }
    return repaso
  }

  async crear(respuestaDto: CrearRespuestaDto, usuarioAuditoria: string) {
    const respuestaRepetido = await this.respuestaRepositorio.buscarCodigo(
      respuestaDto.codigo
    )
    if (respuestaRepetido) {
      throw new ConflictException(Messages.REPEATED_PARAMETER)
    }
    return await this.respuestaRepositorio.crear(respuestaDto, usuarioAuditoria)
  }
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.respuestaRepositorio.listar(paginacionQueryDto)
  }

  async actualizarDatos(
    id: string,
    respuestaDto: ActualizarRespuestaDto,
    usuarioAuditoria: string
  ) {
    const respuesta = await this.respuestaRepositorio.buscarPorId(id)
    if (!respuesta) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.respuestaRepositorio.actualizar(
      id,
      respuestaDto,
      usuarioAuditoria
    )
    return { id }
  }

  async activar(idRespuesta: string, usuarioAuditoria: string) {
    const respuesta = await this.respuestaRepositorio.buscarPorId(idRespuesta)
    if (!respuesta) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const respuestaDto = new ActualizarRespuestaDto()
    respuestaDto.estado = RespuestaEstado.ACTIVO
    await this.respuestaRepositorio.actualizar(
      idRespuesta,
      respuestaDto,
      usuarioAuditoria
    )
    return {
      id: idRespuesta,
      estado: respuestaDto.estado,
    }
  }

  async inactivar(idRespuesta: string, usuarioAuditoria: string) {
    const respuesta = await this.respuestaRepositorio.buscarPorId(idRespuesta)
    if (!respuesta) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const respuestaDto = new ActualizarRespuestaDto()
    respuestaDto.estado = RespuestaEstado.INACTIVO
    await this.respuestaRepositorio.actualizar(
      idRespuesta,
      respuestaDto,
      usuarioAuditoria
    )
    return {
      id: idRespuesta,
      estado: respuestaDto.estado,
    }
  }
}
