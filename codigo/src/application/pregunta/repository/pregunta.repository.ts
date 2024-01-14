import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarPreguntaDto, CrearPreguntaDto } from '../dto'
import { Pregunta } from '../entity'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { Status } from 'src/common/constants'

@Injectable()
export class PreguntaRepository {
  constructor(private dataSource: DataSource) { }

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

  async preguntaRepaso(idsPreguntas: string[]) {
    const query = this.dataSource
      .getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .leftJoinAndSelect('pregunta.respuestas', 'respuesta')
      .select([
        'pregunta.id',
        'pregunta.texto',
        'pregunta.idLeccion',
        'respuesta.id',
        'respuesta.texto',
      ])
      .where("pregunta.id IN (:...ids)", { ids: idsPreguntas })
      .andWhere('respuesta.esCorrecta = :esCorrecta', { esCorrecta: true })
    return await query.getMany()
  }

  async preguntasLeccion(idLeccion: string) {
    const query = this.dataSource
      .getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .leftJoinAndSelect('pregunta.respuestas', 'respuesta')
      .select([
        'pregunta.id',
        'pregunta.texto',
        'pregunta.idLeccion',
        'pregunta.estado',
        'respuesta.id',
        'respuesta.texto',
      ])
      .where('pregunta.idLeccion = :idLeccion', { idLeccion: idLeccion })
    return await query.getManyAndCount()
  }
  getRndInteger = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  async listar(idLeccion: string, limite: number = 5) {
    const saltar = this.getRndInteger(1, 14);
    const query = this.dataSource
      .getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .leftJoinAndSelect('pregunta.respuestas', 'respuesta')
      .select([
        'pregunta.id',
        'pregunta.texto',
        'pregunta.esImagen',
        'pregunta.idLeccion',
        'pregunta.estado',
        'respuesta.id',
        'respuesta.texto',
        'respuesta.esCorrecta',
      ])
      .where({ idLeccion: idLeccion })
      .andWhere({ estado: Status.ACTIVE })
      .take(limite)
      .skip(saltar)
    return await query.getMany()
  }

  async crear(preguntaDto: CrearPreguntaDto, usuarioAuditoria: string) {
    const pregunta = new Pregunta()
    pregunta.texto = preguntaDto.texto
    pregunta.idLeccion = preguntaDto.idLeccion
    pregunta.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Pregunta).save(pregunta)
  }
}
