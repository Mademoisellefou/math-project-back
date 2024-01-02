import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarNotaDto, CrearNotaDto } from '../dto'
import { Nota } from '../entity'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { NotaEstado } from '../constant'

@Injectable()
export class NotaRepository {
  constructor(private dataSource: DataSource) {}

  async buscarPorId(id: string) {
    return await this.dataSource
      .getRepository(Nota)
      .createQueryBuilder('nota')
      .where({ id: id })
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
      .select([
        'nota.id',
        'nota.codigo',
        'nota.puntaje',
        'nota.idUsuario',
        'nota.estado',
      ])
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'codigo':
        query.addOrderBy('nota.codigo', sentido)
        break
      case 'puntaje':
        query.addOrderBy('nota.puntaje', sentido)
        break
      case 'estado':
        query.addOrderBy('nota.estado', sentido)
        break
      default:
        query.orderBy('nota.id', 'ASC')
    }

    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('nota.codigo like :filtro', { filtro: `%${filtro}%` })
        })
      )
    }
    return await query.getManyAndCount()
  }

  async buscarCodigo(codigo: string) {
    return this.dataSource
      .getRepository(Nota)
      .findOne({ where: { codigo: codigo } })
  }

  async crear(notaDto: CrearNotaDto, usuarioAuditoria: string) {
    const { codigo } = notaDto

    const nota = new Nota()
    nota.codigo = codigo
    nota.puntaje = notaDto.puntaje
    nota.idUsuario = usuarioAuditoria
    nota.usuarioCreacion = usuarioAuditoria

    return await this.dataSource.getRepository(Nota).save(nota)
  }
}
