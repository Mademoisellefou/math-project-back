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
import { Leccion } from 'src/application/leccion/entity'

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
    type: 'integer',
    default: 0,
    comment: 'número de intentos de lecciones',
  })
  intentos: number
  
  @Column({
    name: 'id_usuario',
    type: 'varchar',
    comment: 'Clave foránea del usuario',
  })
  idUsuario: string
  @ManyToOne(() => Usuario, (usuario) => usuario.notas, { nullable: false })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario

  @Column({
    name: 'id_leccion',
    type: 'varchar',
    comment: 'Clave foránea del leccion',
  })
  idLeccion: string
  @ManyToOne(() => Leccion, (leccion) => leccion.notas, { nullable: false })
  @JoinColumn({ name: 'id_leccion', referencedColumnName: 'id' })
  leccion: Leccion

  constructor(data?: Partial<Nota>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || NotaEstado.ACTIVO
  }
}
