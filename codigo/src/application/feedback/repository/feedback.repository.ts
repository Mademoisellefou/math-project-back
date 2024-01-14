import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarFeedbackDto, CrearFeedbackDto } from '../dto'
import { Feedback } from '../entity'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { FeedbackEstado } from '../constant'
import { Status } from 'src/common/constants'
import { EliminarFeedbackDto } from '../dto/eliminar-feedback.dto'
import { RolEnum } from 'src/core/authorization/rol.enum'

@Injectable()
export class FeedbackRepository {
  constructor(private dataSource: DataSource) { }

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Feedback)
      .createQueryBuilder('feedback')
      .where({ id: id })
      .getOne()
  }

  async buscarPorIdPregunta(idPregunta: string) {
    return await this.dataSource
      .getRepository(Feedback)
      .createQueryBuilder('feedback')
      .where({ idPregunta: idPregunta })
      .getOne()
  }

  async repasoUsuario(id: string) {
    return await this.dataSource
      .getRepository(Feedback)
      .createQueryBuilder('feedback')
      .where({ idUsuario: id })
      .andWhere({ estado: Status.ACTIVE })
      .getMany()
  }
  async repasoPreguntasIds(id: string) {
    return await this.dataSource
      .getRepository(Feedback)
      .createQueryBuilder('feedback')
      .select(['feedback.id'])
      .where({ idUsuario: id })
      .andWhere({ estado: Status.ACTIVE })
      .getMany()
  }

  async repaso(idLeccion: string, idUsuario: string) {
    return await this.dataSource
      .getRepository(Feedback)
      .createQueryBuilder('feedback')
      .select([
        'feedback.idPregunta',
      ])
      .where({ idUsuario: idUsuario })
      .andWhere({ idLeccion: idLeccion })
      .getMany()
  }
  async listarFeedback() {
    const query = this.dataSource
      .getRepository(Feedback)
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.usuario', 'usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .select([
        'feedback.id',
        'usuario.id',
        'usuario.usuario',
        'usuarioRol.estado',
        'rol.nombre',
        'rol.rol',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
      ])
      .where('usuarioRol.estado = :estado', { estado: Status.ACTIVE })
      .andWhere('rol.id = 3', { nombreRol: RolEnum.ESTUDIANTE })
    return await query.getManyAndCount()
  }
  async eliminar(feedbacks: EliminarFeedbackDto) {
    const ids = feedbacks.feedbacks.map((e) => e.id)
    return await this.dataSource.getRepository(Feedback).delete(ids)
  }
  async actualizar(
    id: string,
    feedbackDto: ActualizarFeedbackDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar = new Feedback({
      ...feedbackDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Feedback)
      .update(id, datosActualizar)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Feedback)
      .createQueryBuilder('feedback')
      .select(['feedback.id', 'feedback.codigo', 'feedback.estado'])
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'codigo':
        query.addOrderBy('feedback.codigo', sentido)
        break
      case 'estado':
        query.addOrderBy('feedback.estado', sentido)
        break
      default:
        query.orderBy('feedback.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('feedback.codigo like :filtro', { filtro: `%${filtro}%` })
        })
      )
    }
    return await query.getManyAndCount()
  }

  async crear(feedbackDto: CrearFeedbackDto, usuarioAuditoria: string, leccion: string) {
    const { codigo } = feedbackDto

    const feedback = new Feedback()
    feedback.idUsuario = usuarioAuditoria
    feedback.idPregunta = feedbackDto.idPregunta
    feedback.usuarioCreacion = usuarioAuditoria
    feedback.idLeccion = leccion;
    return await this.dataSource.getRepository(Feedback).save(feedback)
  }
}
