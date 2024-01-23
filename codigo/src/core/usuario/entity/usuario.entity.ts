import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { UsuarioRol } from '../../authorization/entity/usuario-rol.entity'
import { Persona } from './persona.entity'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { Status } from '../../../common/constants'
import { Nota } from 'src/application/nota/entity'
import { Leccion } from 'src/application/leccion/entity'
import { Feedback } from 'src/application/feedback/entity'
import { Mensaje } from 'src/application/mensaje/entity'

dotenv.config()

export const UsuarioEstado = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
  CREATE: Status.CREATE,
  PENDING: Status.PENDING,
  COMPLETED: Status.COMPLETED,
}

@Check(UtilService.buildStatusCheck(UsuarioEstado))
@Entity({ name: 'usuarios', schema: process.env.DB_SCHEMA_USUARIOS })
export class Usuario extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Usuario',
  })
  id: string

  @Column({
    length: 50,
    type: 'varchar',
    unique: true,
    comment: 'nombre de usuario, usualmente carnet de identidad',
  })
  usuario: string

  @Column({
    length: 255,
    type: 'varchar',
    comment: 'contraseña del usuario',
  })
  contrasena: string

  @OneToMany(() => Nota, (nota) => nota.usuario)
  notas: Nota[]

  @OneToMany(() => Mensaje, (mensaje) => mensaje.usuario)
  mensajes: Mensaje[]

  @Column({
    name: 'id_leccion',
    type: 'varchar',
    comment: 'Clave foránea del leccion',
  })
  idLeccion: string
  @ManyToOne(() => Leccion, (leccion) => leccion.usuarios, { nullable: true })
  @JoinColumn({ name: 'id_leccion', referencedColumnName: 'id' })
  leccion: Leccion

  @OneToMany(() => Feedback, (feedback) => feedback.usuario)
  feedbacks: Feedback[]

  @Column({
    type: 'integer',
    default: 0,
    comment: 'número de intentos de lecciones',
  })
  intentos: number

  @Index()
  @Column({
    name: 'codigo_activacion',
    length: 100,
    nullable: true,
    type: 'varchar',
    comment: 'código de activación de la cuenta de usuario',
  })
  codigoActivacion?: string | null

  @Column({
    name: 'fecha_bloqueo',
    type: 'timestamp without time zone',
    nullable: true,
    comment: 'fecha de bloqueo de la cuenta de usuario',
  })
  fechaBloqueo?: Date | null

  @Column({
    name: 'id_persona',
    type: 'bigint',
    nullable: false,
    comment: 'clave foránea que referencia la tabla de Personas',
  })
  idPersona: string

  @ManyToOne(() => Persona, (persona) => persona.usuarios, {
    nullable: false,
  })
  @JoinColumn({
    name: 'id_persona',
    referencedColumnName: 'id',
  })
  persona: Persona

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario)
  usuarioRol: UsuarioRol[]

  constructor(data?: Partial<Usuario>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || UsuarioEstado.ACTIVE
  }
}
