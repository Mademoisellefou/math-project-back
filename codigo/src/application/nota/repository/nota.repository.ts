import { Brackets, DataSource, EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarNotaDto, CrearNotaDto } from '../dto'
import { Nota } from '../entity'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { NotaEstado } from '../constant'

@Injectable()
export class NotaRepository {
  constructor(private dataSource: DataSource) { }

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Nota)
      .createQueryBuilder('nota')
      .where({ id: id })
      .getOne()
  }

  async buscarPorUsuarioLeccion(idUsuario: string, idLeccion: string) {
    return await this.dataSource
      .getRepository(Nota)
      .createQueryBuilder('nota')
      .where({ idUsuario: idUsuario })
      .andWhere({ idLeccion: idLeccion })
      .getOne()
  }


  async actualizar(
    id: string,
    notaDto: ActualizarNotaDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar = new Nota({
      ...notaDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource.getRepository(Nota).update(id, datosActualizar)
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Nota)
      .createQueryBuilder('nota')
      .leftJoinAndSelect('nota.usuario', 'usuario')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('nota.leccion', 'leccion')
      .select([
        'nota.id',
        'nota.intentos',
        'nota.idUsuario',
        'nota.idLeccion',
        'nota.estado',
        'usuario.usuario',
        'leccion.titulo',
        'usuario.persona',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
      ])
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'estado':
        query.addOrderBy('nota.estado', sentido)
        break
      default:
        query.orderBy('nota.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('nota.intentos like :filtro', { filtro: `%${filtro}%` })
        })
      )
    }
    return await query.getManyAndCount()
  }

  async crear(notaDto: CrearNotaDto, usuarioAuditoria: string) {
    const nota = new Nota()
    nota.intentos = notaDto.intentos
    nota.idUsuario = usuarioAuditoria
    nota.usuarioCreacion = usuarioAuditoria
    nota.idLeccion = notaDto.idLeccion
    return await this.dataSource.getRepository(Nota).save(nota)
  }
  async crearUsuario(
    notaDto: CrearNotaDto, usuarioAuditoria: string, transaction?: EntityManager
  ) {
    const nota = new Nota()
    nota.intentos = notaDto.intentos
    nota.idUsuario = usuarioAuditoria
    nota.usuarioCreacion = usuarioAuditoria
    nota.idLeccion = notaDto.idLeccion
    return await (
      transaction?.getRepository(Nota) ??
      this.dataSource.getRepository(Nota)
    ).save(nota)
  }
}
