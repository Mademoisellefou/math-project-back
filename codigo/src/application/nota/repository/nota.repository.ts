import { Brackets, DataSource, EntityManager } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ActualizarNotaDto, CrearNotaDto } from '../dto'
import { Nota } from '../entity'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { NotaEstado } from '../constant'
import { Usuario } from 'src/core/usuario/entity/usuario.entity'
import { Leccion } from 'src/application/leccion/entity'

@Injectable()
export class NotaRepository {
  constructor(private dataSource: DataSource) { }

  async reportesEstudiantesIntentos() {
    return await this.dataSource
      .createQueryBuilder()
      .select("leccion.titulo", "titulo")
      .addSelect("usuario.usuario", "usuario")
      .addSelect("nota.intentos", "intentos")
      .from(subQuery => {
        return subQuery
          .select("id_leccion")
          .addSelect("MAX(intentos)", "intento_maximo")
          .from(Nota, "nota")
          .where("intentos != :intentos", { intentos: 0 })
          .groupBy("id_leccion");
      }, "intentos_maximos")
      .innerJoin(Nota, "nota", "intentos_maximos.id_leccion = nota.id_leccion AND intentos_maximos.intento_maximo = nota.intentos")
      .innerJoin(Usuario, "usuario", "nota.id_usuario = usuario.id")
      .innerJoin(Leccion, "leccion", "nota.id_leccion = leccion.id")
      .orderBy("nota.id_leccion", "ASC")
      .addOrderBy("usuario.id", "ASC")
      .getRawMany();
  }

  async reportesIntentos() {
    return await this.dataSource
      .getRepository(Nota)
      .createQueryBuilder('nota')
      .select('AVG(nota.intentos)', 'intentosLeccion')
      .innerJoin('nota.leccion', 'leccion')
      .where('leccion.id = nota.idLeccion')
      .groupBy("nota.idLeccion")
      .orderBy('nota.idLeccion', 'ASC')
      .getRawMany();
  }

  async reportesTiempo() {
    return await this.dataSource
      .getRepository(Nota)
      .createQueryBuilder('nota')
      .select('AVG(nota.tiempoLeccion)', 'tiempoLeccion')
      .innerJoin('nota.leccion', 'leccion')
      .where('leccion.id = nota.idLeccion')
      .groupBy("nota.idLeccion")
      .orderBy('nota.idLeccion', 'ASC')
      .getRawMany();
  }

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


  // async actualizar(
  //   id: string,
  //   notaDto: ActualizarNotaDto,
  //   usuarioAuditoria: string
  // ) {
  //   const datosActualizar = new Nota({
  //     ...notaDto,
  //     usuarioModificacion: usuarioAuditoria,
  //   })
  //   return await this.dataSource.getRepository(Nota).update(id, datosActualizar)
  // }
  async actualizar(
    id: string,
    notaDto: ActualizarNotaDto,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const repo = transaction
      ? transaction.getRepository(Nota)
      : this.dataSource.getRepository(Nota)

    const datosActualizar = new Nota({
      ...notaDto,
      usuarioModificacion: usuarioAuditoria,
    })
    return await repo.update(id, datosActualizar)
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
        'nota.tiempoLeccion',
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

  // async crear(notaDto: CrearNotaDto, usuarioAuditoria: string) {
  //   const nota = new Nota()
  //   nota.tiempoLeccion = 0;
  //   nota.intentos = notaDto.intentos
  //   nota.idUsuario = usuarioAuditoria
  //   nota.usuarioCreacion = usuarioAuditoria
  //   nota.idLeccion = notaDto.idLeccion
  //   return await this.dataSource.getRepository(Nota).save(nota)
  // }
  async crear(
    notaDto: CrearNotaDto, usuarioAuditoria: string, transaction?: EntityManager
  ) {
    const nota = new Nota()
    nota.intentos = notaDto.intentos
    nota.idUsuario = usuarioAuditoria
    nota.usuarioCreacion = usuarioAuditoria
    nota.idLeccion = notaDto.idLeccion
    nota.puntaje = 0;
    return await (
      transaction?.getRepository(Nota) ??
      this.dataSource.getRepository(Nota)
    ).save(nota)
  }
}
