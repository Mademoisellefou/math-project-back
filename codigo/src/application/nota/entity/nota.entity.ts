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
import { NotaEstado } from '../constant'
import { Usuario } from 'src/core/usuario/entity/usuario.entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(NotaEstado))
@Entity({ name: 'notas', schema: process.env.DB_SCHEMA_PARAMETRICAS })
export class Nota extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Parámetro',
  })
  id: string

  @Column({
    length: 15,
    type: 'varchar',
    unique: true,
    comment: 'Código de nota',
  })
  codigo: string

  @Column({
    length: 15,
    type: 'varchar',
    unique: true,
    comment: 'Puntaje de nota',
  })
  puntaje: string

  @Column({
    name: 'id_usuario',
    type: 'varchar',
    comment: 'Clave foránea del usuario',
  })
  idUsuario: string
  @ManyToOne(() => Usuario, (usuario) => usuario.notas, { nullable: false })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario

  constructor(data?: Partial<Nota>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || NotaEstado.ACTIVO
  }
}
