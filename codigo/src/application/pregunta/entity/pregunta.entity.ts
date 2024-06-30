import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { PreguntaEstado } from '../constant'
import { Leccion } from 'src/application/leccion/entity'
import { Respuesta } from 'src/application/respuesta/entity'
import { Feedback } from 'src/application/feedback/entity'
import { NivelEnum } from 'src/core/usuario/constantes'

dotenv.config()

@Check(UtilService.buildStatusCheck(PreguntaEstado))
@Entity({ name: 'preguntas', schema: process.env.DB_SCHEMA_PARAMETRICAS })
export class Pregunta extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Parámetro',
  })
  id: string

  @Column({
    name: 'nivel',
    length: 30,
    type: 'varchar',
    nullable: false,
    default: NivelEnum.BAJO,
    comment: 'Nivel de dificultad',
  })
  nivel: string

  @Column({
    length: 1000,
    type: 'varchar',
    unique: false,
    comment: 'Texto de pregunta',
  })
  texto: string

  @Column({
    length: 1000,
    type: 'varchar',
    unique: false,
    default: '',
    comment: 'Link apoyo de pregunta',
  })
  apoyo: string

  @Column({
    name: 'id_leccion',
    type: 'varchar',
    comment: 'Clave foránea de leccion',
  })
  idLeccion: string

  @ManyToOne(() => Leccion, (leccion) => leccion.preguntas, { nullable: false })
  @JoinColumn({ name: 'id_leccion', referencedColumnName: 'id' })
  leccion: Leccion

  @OneToMany(() => Respuesta, (respuesta) => respuesta.pregunta)
  respuestas: Respuesta[]

  constructor(data?: Partial<Pregunta>) {
    super(data)
  }

  @Column({
    name: 'es_imagen',
    type: 'boolean',
    default: false,
    nullable: false,
    comment: 'Indica si la pregunta es imagen',
  })
  esImagen: boolean

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || PreguntaEstado.ACTIVO
  }
}
