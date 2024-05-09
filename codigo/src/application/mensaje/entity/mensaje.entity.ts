import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { MensajeEstado } from '../constant'
import { Usuario } from 'src/core/usuario/entity/usuario.entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(MensajeEstado))
@Entity({ name: 'mensajes', schema: process.env.DB_SCHEMA_PARAMETRICAS })
export class Mensaje extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Parámetro',
  })
  id: string


  @Column({ length: 355, type: 'varchar', comment: 'Descripción del texto' })
  texto: string

  constructor(data?: Partial<Mensaje>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || MensajeEstado.ACTIVO
  }
}
