import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '../../../common/entity/auditoria.entity'
import { LeccionEstado } from '../constant'
import { Usuario } from 'src/core/usuario/entity/usuario.entity'
import { Pregunta } from 'src/application/pregunta/entity'
import { Nota } from 'src/application/nota/entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(LeccionEstado))
@Entity({ name: 'lecciones', schema: process.env.DB_SCHEMA_PARAMETRICAS })
export class Leccion extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Parámetro',
  })
  id: string

  @OneToMany(() => Nota, (nota) => nota.usuario)
  notas: Nota[]

  @Column({
    length: 15,
    type: 'varchar',
    unique: false,
    comment: 'Código de leccion',
    default: ''
  })
  codigo: string

  @Column({
    length: 15,
    type: 'varchar',
    unique: false,
    comment: 'Siguiente leccion',
  })
  siguiente: string

  @Column({
    length: 50,
    type: 'varchar',
    unique: true,
    comment: 'Titulo de Leccion',
  })
  titulo: string

  @Column({
    length: 400,
    type: 'varchar',
    unique: true,
    comment: 'Descripcion de Leccion',
  })
  descripcion: string

  @OneToMany(() => Usuario, (usuario) => usuario.leccion)
  usuarios: Usuario[]

  @OneToMany(() => Pregunta, (pregunta) => pregunta.leccion)
  preguntas: Pregunta[]

  constructor(data?: Partial<Leccion>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || LeccionEstado.ACTIVO
  }
}
