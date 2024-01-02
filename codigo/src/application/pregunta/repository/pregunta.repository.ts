import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarPreguntaDto, CrearPreguntaDto } from '../dto'
import { Pregunta } from '../entity'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'

@Injectable()
export class PreguntaRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .where({ id: id })
      .getOne()
  }

  async actualizar(
    id: string,
    preguntaDto: ActualizarPreguntaDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar = new Pregunta({
      ...preguntaDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Pregunta)
      .update(id, datosActualizar)
  }

  async preguntasLeccion(idLeccion: string) {
    const query = this.dataSource
      .getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .leftJoinAndSelect('pregunta.respuestas', 'respuesta')
      .select([
        'pregunta.id',
        'pregunta.codigo',
        'pregunta.texto',
        'pregunta.idLeccion',
        'pregunta.estado',
        'respuesta.id',
        'respuesta.texto',
      ])
      .where('pregunta.idLeccion = :idLeccion', { idLeccion: idLeccion })
    return await query.getManyAndCount()
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .leftJoinAndSelect('pregunta.respuestas', 'respuesta')
      .select([
        'pregunta.id',
        'pregunta.codigo',
        'pregunta.texto',
        'pregunta.idLeccion',
        'pregunta.estado',
        'respuesta.id',
        'respuesta.esCorrecta',
      ])
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'codigo':
        query.addOrderBy('pregunta.codigo', sentido)
        break
      case 'estado':
        query.addOrderBy('pregunta.estado', sentido)
        break
      default:
        query.orderBy('pregunta.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('pregunta.codigo like :filtro', { filtro: `%${filtro}%` })
        })
      )
    }
    return await query.getManyAndCount()
  }

  async buscarCodigo(codigo: string) {
    return this.dataSource
      .getRepository(Pregunta)
      .findOne({ where: { codigo: codigo } })
  }

  async crear(preguntaDto: CrearPreguntaDto, usuarioAuditoria: string) {
    const { codigo } = preguntaDto

    const pregunta = new Pregunta()
    pregunta.codigo = codigo
    pregunta.texto = preguntaDto.texto
    pregunta.idLeccion = preguntaDto.idLeccion
    pregunta.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Pregunta).save(pregunta)
  }
}
