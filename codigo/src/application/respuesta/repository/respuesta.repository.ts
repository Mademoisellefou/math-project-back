import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarRespuestaDto, CrearRespuestaDto } from '../dto'
import { Respuesta } from '../entity'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { RespuestaEstado } from '../constant'
import { ObtenerLeccionDto } from '../dto/leccion-respuesta.dto'
import { Feedback } from 'src/application/feedback/entity'

@Injectable()
export class RespuestaRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Respuesta)
      .createQueryBuilder('respuesta')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    respuestaDto: ActualizarRespuestaDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar = new Respuesta({
      ...respuestaDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Respuesta)
      .update(id, datosActualizar)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Respuesta)
      .createQueryBuilder('respuesta')
      .select([
        'respuesta.id',
        'respuesta.texto',
        'respuesta.idPregunta',
        'respuesta.esCorrecta',
        'respuesta.estado',
      ])
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'estado':
        query.addOrderBy('respuesta.estado', sentido)
        break
      default:
        query.orderBy('respuesta.id', 'ASC')
    }
    return await query.getManyAndCount()
  }

  async respuestasLeccion(
    respuestaDto: ObtenerLeccionDto,
    usuarioAuditoria: string
  ) {
    const { respuestas } = respuestaDto
    const feedbacks: Feedback[] = []
    for (let i = 0; i < respuestas.length; i++) {
      if (respuestas[i].esCorrecta === false) {
        const nuevoFeedback = new Feedback()
        nuevoFeedback.idUsuario = usuarioAuditoria
        nuevoFeedback.idPregunta = respuestas[i].idPregunta
        nuevoFeedback.usuarioCreacion = usuarioAuditoria
        feedbacks.push(nuevoFeedback)
      }
    }
    return await this.dataSource.getRepository(Feedback).save(feedbacks)
  }
  async crear(respuestaDto: CrearRespuestaDto, usuarioAuditoria: string) {
    const respuesta = new Respuesta()
    respuesta.texto = respuestaDto.texto
    respuesta.esCorrecta = respuestaDto.esCorrecta
    respuesta.idPregunta = respuestaDto.idPregunta
    respuesta.usuarioCreacion = usuarioAuditoria
    return await this.dataSource.getRepository(Respuesta).save(respuesta)
  }
}
