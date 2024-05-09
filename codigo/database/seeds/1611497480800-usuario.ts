import { Usuario } from '../../src/core/usuario/entity/usuario.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { TextService } from '../../src/common/lib/text.service'
import {
  Genero,
  TipoDocumento,
  USUARIO_SISTEMA,
} from '../../src/common/constants'
import dayjs from 'dayjs'
import { Leccion } from 'src/application/leccion/entity'

export class usuario1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const DEFAULT_PASS = 'mscti2024'
    const pass = await TextService.encrypt(DEFAULT_PASS)
    const itemsLecciones =
      [
        {
          codigo: 'TD-CI-1',
          idUsuario: '1',
          titulo: "Porcentaje",
          descripcion: 'Porcentaje',
          siguiente: '2'
        },
        {
          codigo: 'TD-CI-2',
          idUsuario: '1',
          titulo: "Tipos de impuestos",
          descripcion: 'Tipos de impuestos',
          siguiente: '3'
        },
        {
          codigo: 'TD-CI-3',
          idUsuario: '1',
          titulo: "Tributaria concepto básicos",
          descripcion: 'Tributaria concepto básicos',
          siguiente: '4'
        },
        {
          codigo: 'TD-CI-4',
          idUsuario: '1',
          titulo: "Capital Final I",
          descripcion: 'El capital final en una operación de interés simple ',
          siguiente: '5'
        },
        {
          codigo: 'TD-CI-5',
          idUsuario: '1',
          titulo: "Capital Final II",
          descripcion: 'El interés que genera un préstamo o inversión tambien aprenderas de la conversion',
          siguiente: '6'
        },
        {
          codigo: 'TD-CI-6',
          idUsuario: '1',
          titulo: "Intereses Generados I",
          descripcion: 'Tiempo tiene que estar invertido un dinero',
          siguiente: '7'
        },
        {
          codigo: 'TD-CI-7',
          idUsuario: '1',
          titulo: "Intereses Generados II",
          descripcion: 'Tiempo tiene que estar invertido un dinero tambien aprenderas de la conversion',
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
      { usuario: 'profesoraEMA'},
      { usuario: 'estudiantedemo'},
      { usuario: "reymormcc" },
      { usuario: "jhamilecs" },
      { usuario: "adairdcn" },
      { usuario: "evelyncc" },
      { usuario: "nardydcl" },
      { usuario: "johnbcm" },
      { usuario: "belindahm" },
      { usuario: "josuerht" },

      { usuario: "cristhianhl" },
      { usuario: "yairjlc" },
      { usuario: "jhamiletalq" },
      { usuario: "jhoselinmg" },
      { usuario: "danielami" },
      { usuario: "marvingmk" },
      { usuario: "aracelyml" },
      { usuario: "ademarmp" },
      { usuario: "vanessaqh" },
      { usuario: "judtihqc" },

      { usuario: "franzaqv" },
      { usuario: "anabelqq" },
      { usuario: "luismra" },
      { usuario: "vaniaasn" },
      { usuario: "daysitm" },
      { usuario: "anaetq" },
      { usuario: "cristhianam" },
      { usuario: "yolisacm" },
      { usuario: "eddydcm" },
      { usuario: "sarahícq" },//30
      { usuario: "marcosccc" },
      { usuario: "robinhocc" },
      { usuario: "ronnyrmb" },
      { usuario: "yoselinmv" },
      { usuario: "yhorginaqu" },
      { usuario: "jhonnyqm" },
      { usuario: "edzoneqm" },
      { usuario: "warahqc" },
      { usuario: "wendysc" },
      { usuario: "marylvq" },
      { usuario: "alexandralzc" },
    ]

    for (const item of items) {
      const usuario = new Usuario({
        contrasena: pass,
        intentos: 0,
        idLeccion: '1',
        usuario: item.usuario,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
      await queryRunner.manager.save(usuario)
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
