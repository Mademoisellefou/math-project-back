import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarLeccionDto, CrearLeccionDto } from '../dto'
import { Leccion } from '../entity'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { LeccionEstado } from '../constant'
import { Status } from 'src/common/constants'

@Injectable()
export class LeccionRepository {
  constructor(private dataSource: DataSource) { }

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Leccion)
      .createQueryBuilder('leccion')
      .where({ id: id })
      .getOne()
  }

  async listaLecciones() {
    const data = await this.dataSource
      .getRepository(Leccion)
      .createQueryBuilder('leccion')
      .select([
        'leccion.id',
      ])
      .where({ estado: Status.ACTIVE })
      .getMany()
    return data
  }

  async actualizar(
    id: string,
    leccionDto: ActualizarLeccionDto,
    usuarioAuditoria: string
  ) {
    const datosActualizar = new Leccion({
      ...leccionDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await this.dataSource
      .getRepository(Leccion)
      .update(id, datosActualizar)
  }
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Leccion)
      .createQueryBuilder('leccion')
      .select([
        'leccion.id',
        'leccion.codigo',
        'leccion.titulo',
        'leccion.descripcion',
        'leccion.idUsuario',
        'leccion.estado',
      ])
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'codigo':
        query.addOrderBy('leccion.codigo', sentido)
        break
      case 'estado':
        query.addOrderBy('leccion.estado', sentido)
        break
      default:
        query.orderBy('leccion.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('leccion.codigo like :filtro', { filtro: `%${filtro}%` })
        })
      )
    }
    return await query.getManyAndCount()
  }

  async buscarCodigo(codigo: string) {
    return this.dataSource
      .getRepository(Leccion)
      .findOne({ where: { codigo: codigo } })
  }

  async crear(leccionDto: CrearLeccionDto, usuarioAuditoria: string) {
    const { codigo } = leccionDto

    const leccion = new Leccion()
    leccion.codigo = codigo
    leccion.titulo = leccionDto.titulo
    leccion.descripcion = leccionDto.descripcion
    leccion.usuarios = []
    leccion.siguiente = leccionDto.siguiente
    leccion.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Leccion).save(leccion)
  }
}
