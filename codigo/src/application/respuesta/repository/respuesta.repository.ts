import { Brackets, DataSource, EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarRespuestaDto, CrearRespuestaDto } from '../dto'
import { Respuesta } from '../entity'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { ObtenerLeccionDto } from '../dto/leccion-respuesta.dto'
import { Status } from 'src/common/constants'

@Injectable()
export class RespuestaRepository {
  constructor(private dataSource: DataSource) { }

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

  // async respuestasLeccion(
  //   respuestaDto: ObtenerLeccionDto,
  //   usuarioAuditoria: string,
  //   idLeccion: string
  // ) {
  //   const { respuestas } = respuestaDto
  //   const feedbacks: Feedback[] = []
  //   for (let i = 0; i < respuestas.length; i++) {
  //     if (respuestas[i].esCorrecta === false) {
  //       const nuevoFeedback = new Feedback()
  //       nuevoFeedback.idUsuario = usuarioAuditoria
  //       nuevoFeedback.idPregunta = respuestas[i].idPregunta
  //       nuevoFeedback.idLeccion = idLeccion
  //       nuevoFeedback.usuarioCreacion = usuarioAuditoria
  //       feedbacks.push(nuevoFeedback)
  //     }
  //   }
  //   return await this.dataSource.getRepository(Feedback).save(feedbacks)
  // }
  // async crear(respuestaDto: CrearRespuestaDto, usuarioAuditoria: string) {
  //   const respuesta = new Respuesta()
  //   respuesta.texto = respuestaDto.texto
  //   respuesta.esCorrecta = respuestaDto.esCorrecta
  //   respuesta.idPregunta = respuestaDto.idPregunta
  //   respuesta.explicacion = respuestaDto.explicacion??""
  //   respuesta.usuarioCreacion = usuarioAuditoria
  //   return await this.dataSource.getRepository(Respuesta).save(respuesta)
  // }
  async crear(respuestaDto: CrearRespuestaDto, usuarioAuditoria: string, transaction?: EntityManager) {
    if (transaction) {
      return await transaction.getRepository(Respuesta).save(
        new Respuesta({
          texto: respuestaDto.texto,
          esCorrecta: respuestaDto.esCorrecta,
          idPregunta: respuestaDto.idPregunta,
          explicacion: respuestaDto.explicacion ?? "",
          usuarioCreacion: usuarioAuditoria,
          estado: respuestaDto?.estado ?? Status.ACTIVE
        })
      )
    }
    else {
      const respuesta = new Respuesta()
      respuesta.texto = respuestaDto.texto
      respuesta.esCorrecta = respuestaDto.esCorrecta
      respuesta.idPregunta = respuestaDto.idPregunta
      respuesta.explicacion = respuestaDto.explicacion ?? ""
      respuesta.usuarioCreacion = usuarioAuditoria
      return await this.dataSource.getRepository(Respuesta).save(respuesta)
    }
  }

}
