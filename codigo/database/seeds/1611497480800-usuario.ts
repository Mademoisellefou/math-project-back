import { Usuario } from '../../src/core/usuario/entity/usuario.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { TextService } from '../../src/common/lib/text.service'
import {
  Genero,
  TipoDocumento,
  USUARIO_SISTEMA,
} from '../../src/common/constants'
import dayjs from 'dayjs'
import { Persona } from '../../src/core/usuario/entity/persona.entity'
import { Leccion } from 'src/application/leccion/entity'
import { Nota } from 'src/application/nota/entity'

export class usuario1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const DEFAULT_PASS = '123'
    const pass = await TextService.encrypt(DEFAULT_PASS)
    const itemsLecciones =
      [{
        codigo: 'TD-CI-1',
        idUsuario: '1',
        titulo: 'Algoritmos',
        descripcion: 'Algoritmos',
        siguiente: '2'
      },
      {
        codigo: 'TD-CI-2',
        idUsuario: '1',
        titulo: 'Algoritmos 2',
        descripcion: 'Algoritmos 2',
        siguiente: '3'
      },
      {
        codigo: 'TD-CI-3',
        idUsuario: '1',
        titulo: 'Algoritmos 3',
        descripcion: 'Algoritmos 3',
        siguiente: 'F'
      }
      ]

    const nuevaLecciones = itemsLecciones.map((item) => {
      return new Leccion({
        codigo: item.codigo,
        titulo: item.titulo,
        descripcion: item.descripcion,
        siguiente: item.siguiente,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    })

    //
    await queryRunner.manager.save(nuevaLecciones)
    const items = [
      {
        //id: 1,
        usuario: 'administrador',
        correoElectonico: 'eml@gmail.com',
        persona: {
          nombres: 'yasmin',
          primerApellido: 'rodrige<',
          segundoApellido: 'romero',
          tipoDocumento: TipoDocumento.CI,
          nroDocumento: '9270815',
          fechaNacimiento: '2001-12-16',
          genero: Genero.FEMENINO,
        },
      },
      {
        //id: 2,
        usuario: 'administrador-tecnico',
        correoElectonico: 'eml2@gmail.com',
        persona: {
          nombres: 'ALBANO',
          primerApellido: 'ROJAS',
          segundoApellido: 'AGUADA',
          tipoDocumento: TipoDocumento.CI,
          nroDocumento: '1765251',
          fechaNacimiento: '1967-05-28',
          genero: Genero.MASCULINO,
        },
      },
      {
        //id: 3,
        usuario: 'tecnico',
        correoElectonico: 'em3@gmail.com',
        persona: {
          nombres: 'jesus',
          primerApellido: 'rojas',
          segundoApellido: 'zabal',
          tipoDocumento: TipoDocumento.CI,
          nroDocumento: '6114767',
          fechaNacimiento: '2009-02-28',
          genero: Genero.MASCULINO,
        },
      },
    ]

    for (const item of items) {
      const persona = new Persona({
        fechaNacimiento: dayjs(
          item.persona.fechaNacimiento,
          'YYYY-MM-DD'
        ).toDate(),
        genero: item.persona.genero,
        nombres: item.persona.nombres,
        nroDocumento: item.persona.nroDocumento,
        primerApellido: item.persona.primerApellido,
        segundoApellido: item.persona.segundoApellido,
        tipoDocumento: item.persona.tipoDocumento,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
      const personaResult = await queryRunner.manager.save(persona)
      const usuario = new Usuario({
        contrasena: pass,
        intentos: 0,
        idLeccion: '1',
        usuario: item.usuario,
        idPersona: personaResult.id,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
      const usuarioResult = await queryRunner.manager.save(usuario)

      const nota = new Nota({
        intentos: 0,
        idUsuario: '1',
        idLeccion: '1',
      })

    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
