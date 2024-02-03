import { BaseService } from '../../../common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { FeedbackRepository } from '../repository'
import { CrearFeedbackDto } from '../dto'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { Messages } from '../../../common/constants/response-messages'
import { ActualizarFeedbackDto } from '../dto'
import { FeedbackEstado } from '../constant'
import { ParamIdDto } from 'src/common/dto/params-id.dto'
import { EliminarFeedbackDto } from '../dto/eliminar-feedback.dto'
import { Status } from 'src/common/constants'
import { Feeback, RepasoFeedbackDto } from '../dto/repaso-feedback.dto'
import { UsuarioRepository } from 'src/core/usuario/repository/usuario.repository'
import { PreguntaRepository } from 'src/application/pregunta/repository'
import { RolEnum } from 'src/core/authorization/rol.enum'

@Injectable()
export class FeedbackService extends BaseService {
  constructor(
    @Inject(FeedbackRepository)
    private feedbackRepositorio: FeedbackRepository,
    private usuarioRepositorio: UsuarioRepository,
    private preguntaRepositorio: PreguntaRepository,
  ) {
    super()
  }

  async crear(feedbackDto: CrearFeedbackDto, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.buscarPorId(usuarioAuditoria);
    if (!usuario) throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    return await this.feedbackRepositorio.crear(feedbackDto, usuarioAuditoria, usuario?.idLeccion);
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.feedbackRepositorio.listar(paginacionQueryDto)
  }

  async listarFeedback() {
    return await this.feedbackRepositorio.listarFeedback()
  }

  async actualizarDatos(
    id: string,
    feedbackDto: ActualizarFeedbackDto,
    usuarioAuditoria: string
  ) {
    const feedback = await this.feedbackRepositorio.buscarPorId(id)
    if (!feedback) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.feedbackRepositorio.actualizar(id, feedbackDto, usuarioAuditoria)
    return { id }
  }
  async menu(idUsuario: string, rolUsuario: string) {
    if (!idUsuario) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    if (rolUsuario === RolEnum.ESTUDIANTE) {
      const res = await this.feedbackRepositorio.buscarPorUsuario(idUsuario);
      return res.length > 0 ? true : false;
    }
    return false
  }
  async repaso(params: ParamIdDto) {
    if (!params?.id) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const usuario = await this.usuarioRepositorio.buscarPorId(params.id);
    if (!usuario) throw new NotFoundException(Messages.EXCEPTION_DEFAULT)

    const feedbacks = await this.feedbackRepositorio.repaso(usuario.idLeccion, usuario.id)

    // const feedbacksRepaso: RepasoFeedbackDto = new RepasoFeedbackDto()
    const idsPreguntas = feedbacks.map(feedback => feedback.idPregunta);
    if (idsPreguntas.length <= 0) {
      return feedbacks;
    }
    const preguntas = await this.preguntaRepositorio.preguntaRepaso(idsPreguntas);
    const resultado = preguntas.map(item => {
      const respuesta = item.respuestas[0].texto;
      const texto = item.texto
      const idPregunta = item.id
      return {
        idPregunta,
        texto,
        respuesta
      }
    })
    return resultado
  }
  async activar(idFeedback: string, usuarioAuditoria: string) {
    const feedback = await this.feedbackRepositorio.buscarPorId(idFeedback)
    if (!feedback) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const feedbackDto = new ActualizarFeedbackDto()
    feedbackDto.estado = FeedbackEstado.ACTIVO
    await this.feedbackRepositorio.actualizar(
      idFeedback,
      feedbackDto,
      usuarioAuditoria
    )
    return {
      id: idFeedback,
      estado: feedbackDto.estado,
    }
  }
  async inactivar(usuarioAuditoria: string, feedbacks: EliminarFeedbackDto) {
    if (!usuarioAuditoria) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const feedbacksUsuario =
      await this.feedbackRepositorio.repasoUsuario(usuarioAuditoria)
    if (feedbacksUsuario.length !== feedbacks.feedbacks.length) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.feedbackRepositorio.eliminar(feedbacks)
    return {
      records: feedbacks.feedbacks,
      estado: Status.INACTIVE,
    }
  }
  async repasoPreguntas(usuarioAuditoria: string) {
    if (!usuarioAuditoria) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    return await this.feedbackRepositorio.repasoPreguntasIds(usuarioAuditoria)
  }
}
