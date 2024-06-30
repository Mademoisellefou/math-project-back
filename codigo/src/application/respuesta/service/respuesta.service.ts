import { BaseService } from '../../../common/base/base-service'
import { EntityManager } from 'typeorm'
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
import { NotaRepository } from 'src/application/nota/repository'
import { CrearNotaDto } from 'src/application/nota/dto'
import { LECCION, RespuestasCorrectas, Status } from 'src/common/constants'
import { Leccion } from 'src/application/leccion/entity'

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
    private leccionRepositorio: LeccionRepository,
    @Inject(NotaRepository)
    private notaRepositorio: NotaRepository
  ) {
    super()
  }

  async actualizarNota(idUsuario: string, idLeccion: string, tiempoLeccion: string, puntaje: number, actualizarIntentos: boolean, transaction?: EntityManager) {
    const nota = await this.notaRepositorio.buscarPorUsuarioLeccion(idUsuario, idLeccion);
    if (!nota) {
      throw new NotFoundException('No existe nota')
    }
    if (actualizarIntentos) {
      console.log("actualizar");
    }else{
      console.log("aumento");
    }
    const intentos: number = actualizarIntentos ? nota.intentos + 1 : nota.intentos;
    await this.notaRepositorio.actualizar(nota.id, { intentos: intentos, tiempoLeccion: parseInt(tiempoLeccion, 10), puntaje }, idUsuario, transaction);
  }
  async siguienteNivel(leccion: Leccion, usuarioId: string, respuestaDto: ObtenerLeccionDto) {
    const op = async (transaction: EntityManager) => {
      if (leccion.siguiente != LECCION.FINAL) {
        await this.usuarioRepositorio.actualizar(
          usuarioId,
          {
            idLeccion: leccion?.siguiente,
          },
          usuarioId, transaction
        )
      } else {
        await this.usuarioRepositorio.actualizar(
          usuarioId,
          { estado: Status.COMPLETED },
          usuarioId, transaction
        )
      }
      let puntaje: number = 100 - (Math.round(parseInt(respuestaDto.tiempoLeccion, 10) / 10)) * 4;
      await this.actualizarNota(usuarioId, leccion.id, respuestaDto.tiempoLeccion, puntaje, false, transaction);
    }
    await this.usuarioRepositorio.runTransaction(op)
  }
  async aumentarIntentoLeccion(usuarioId: string, leccionId: string, tiempoLeccion: string) {
    await this.actualizarNota(usuarioId, leccionId, tiempoLeccion, 50, true)
  }
  async respuestasLeccion(
    respuestaDto: ObtenerLeccionDto,
    usuarioAuditoria: string
  ) {
    if (!usuarioAuditoria) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const usuario = await this.usuarioRepositorio.buscarPorId(usuarioAuditoria)
    if (!usuario)
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    if (usuario?.estado === Status.COMPLETED) {
      throw new NotFoundException('Ya terminaste el quiz')
    }
    const leccion = await this.leccionRepositorio.buscarPorId(
      usuario.idLeccion
    )
    if (!leccion)
      throw new NotFoundException("No exsite Leccion")
    const nota = await this.notaRepositorio.buscarPorUsuarioLeccion(usuario.id, leccion.id);
    if (nota === null) {
      const op = async (transaction: EntityManager) => {
        await this.notaRepositorio.crear({
          intentos: 0,
          idLeccion: leccion.id,
        }, usuario.id, transaction)
      }
      await this.usuarioRepositorio.runTransaction(op)
    }
    console.log(respuestaDto.preguntasCorrectas);
    console.log(respuestaDto.tiempoLeccion);
    console.log("0000000000000000000000000");
    
    if (parseInt(respuestaDto.preguntasCorrectas, 10) >= parseInt(RespuestasCorrectas.NROMIN, 10)) {
      console.log("Avanzo");
      await this.siguienteNivel(leccion, usuarioAuditoria, respuestaDto);
      const usuarioActualizado = await this.usuarioRepositorio.perfilUsuario(usuarioAuditoria);
      if (!usuarioActualizado) throw new NotFoundException(Messages.NO_LESSON_FOUND)
      const nombreLeccion = await this.leccionRepositorio.buscarPorId(usuarioActualizado?.idLeccion);
      return {
        avance: true, usuario: {
          estado: usuarioActualizado?.estado,
          idLeccion: usuarioActualizado?.idLeccion,
          leccion: nombreLeccion?.titulo
        }
      }
    } else {
      this.aumentarIntentoLeccion(usuarioAuditoria, leccion.id, respuestaDto.tiempoLeccion);
      return { avance: false }
    }
  }

  async crear(respuestaDto: CrearRespuestaDto, usuarioAuditoria: string) {
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
