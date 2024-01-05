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
import { RespuestaEstado } from '../constant'
import { Usuario } from 'src/core/usuario/entity/usuario.entity'
import { Pregunta } from 'src/application/pregunta/entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(RespuestaEstado))
@Entity({ name: 'respuestas', schema: process.env.DB_SCHEMA_PARAMETRICAS })
export class Respuesta extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Parámetro',
  })
  id: string


  @Column({
    length: 500,
    type: 'varchar',
    unique: false,
    comment: 'Texto de respuesta',
  })
  texto: string

  @Column({
    name: 'es_correcta',
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Indica si la respuesta es correcta',
  })
  esCorrecta: boolean

  @Column({
    name: 'id_pregunta',
    type: 'varchar',
    comment: 'Clave foránea de pregunta',
  })
  idPregunta: string
  @ManyToOne(() => Pregunta, (pregunta) => pregunta.respuestas, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_pregunta', referencedColumnName: 'id' })
  pregunta: Pregunta

  constructor(data?: Partial<Respuesta>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || RespuestaEstado.ACTIVO
  }
}
