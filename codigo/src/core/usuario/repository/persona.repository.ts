import { DataSource, EntityManager } from 'typeorm'
import { Persona } from '../entity/persona.entity'
import { PersonaDto } from '../dto/persona.dto'
import { Injectable } from '@nestjs/common'
import { Status } from '../../../common/constants'

@Injectable()
export class PersonaRepository {
  constructor(private dataSource: DataSource) {}

  async crear(
    personaDto: PersonaDto,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(Persona) ??
      this.dataSource.getRepository(Persona)
    ).save(
      new Persona({
        nombres: personaDto?.nombres,
        primerApellido: personaDto?.primerApellido,
        segundoApellido: personaDto?.segundoApellido,
        nroDocumento: personaDto?.nroDocumento,
        tipoDocumento: personaDto.tipoDocumento,
        usuarioCreacion: usuarioAuditoria,
      })
    )
  }

  async buscarPersonaPorCI(persona: PersonaDto) {
    return await this.dataSource
      .getRepository(Persona)
      .createQueryBuilder('persona')
      .where('persona.nro_documento = :ci', { ci: persona.nroDocumento })
      .getOne()
  }

  async buscarPersonaPorDocumento(
    tipoDocumento: string,
    numeroDocumento: string
  ) {
    return await this.dataSource
      .getRepository(Persona)
      .createQueryBuilder('p')
      .where('p.nro_documento = :numeroDocumento', { numeroDocumento })
      .andWhere('p.tipo_documento = :tipoDocumento', { tipoDocumento })
      .andWhere('p.estado = :estado', { estado: Status.ACTIVE })
      .getOne()
  }

  async buscarPersonaId(id: string, transaction?: EntityManager) {
    return await (
      transaction?.getRepository(Persona) ??
      this.dataSource.getRepository(Persona)
    )
      .createQueryBuilder('persona')
      .where('persona.id = :id', { id: id })
      .getOne()
  }
}
