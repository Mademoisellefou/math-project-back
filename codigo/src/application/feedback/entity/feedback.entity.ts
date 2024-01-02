import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { FeedbackEstado } from '../constant'
import { Usuario } from 'src/core/usuario/entity/usuario.entity'
import { Pregunta } from 'src/application/pregunta/entity'

dotenv.config()

// @Check(UtilService.buildStatusCheck(FeedbackEstado))
@Entity({ name: 'feedbacks', schema: process.env.DB_SCHEMA_PARAMETRICAS })
export class Feedback extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Parámetro',
  })
  id: string

  @Column({
    name: 'id_pregunta',
    type: 'bigint',
    nullable: true,
    comment: 'Clave Foranea de Pregunta',
  })
  idPregunta: string
  @OneToOne(() => Pregunta, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_pregunta', referencedColumnName: 'id' })
  pregunta: Pregunta

  @Column({
    name: 'id_usuario',
    type: 'varchar',
    comment: 'Clave foránea de usuario',
  })
  idUsuario: string
  @ManyToOne(() => Usuario, (usuario) => usuario.feedbacks, { nullable: false })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario

  constructor(data?: Partial<Feedback>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || FeedbackEstado.ACTIVO
  }
}
