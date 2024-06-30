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
      { usuario: 'profesoraEGP',primerApellido: 'Gutierrez', segundoApellido: 'Poma', nombres: 'Erlinda'},
      { usuario: 'estudiantedemo',primerApellido: 'estudiantedemo', segundoApellido: 'estudiantedemo', nombres: 'estudiantedemo'},

      { usuario: "reymormcc" ,primerApellido: 'Casas', segundoApellido: 'Castaneta', nombres: 'Reymor Mijael'},
      { usuario: "jhamilecs" ,primerApellido: 'Castañeta', segundoApellido: 'Songo', nombres: 'Jhamile'},
      { usuario: "adairdcn" ,primerApellido: 'Chana', segundoApellido: 'Mamani', nombres: 'Adair Danner'},
      { usuario: "evelyncc" ,primerApellido: 'Chavez', segundoApellido: 'Condori', nombres: 'Evelyn'},
      { usuario: "nardydcl" ,primerApellido: 'Chipana', segundoApellido: 'Laura', nombres: 'Nardy Daniela'},
      { usuario: "johnbcm" ,primerApellido: 'Coyo', segundoApellido: 'Mamani', nombres: 'Jhon'},
      { usuario: "belindahm" ,primerApellido: 'Huallpa', segundoApellido: 'Mamani', nombres: 'Belinda'},
      { usuario: "josuerht" ,primerApellido: 'Huanca', segundoApellido: 'Ticona', nombres: 'Josue Rodrigo'},
      { usuario: "cristhianhl" ,primerApellido: 'Huarachi', segundoApellido: 'Landaeta', nombres: 'Cristhian'},
      { usuario: "yairjlc" ,primerApellido: 'Laura', segundoApellido: 'Canavini', nombres: 'Yair Jhon'},
      { usuario: "jhamiletalq" ,primerApellido: 'Luna', segundoApellido: 'Quispe', nombres: 'Jhamilet Aracely'},
      { usuario: "jhoselinmg" ,primerApellido: 'Mamani', segundoApellido: 'Gutierrez', nombres: 'Jhoselin'},
      { usuario: "danielami" ,primerApellido: 'Mamani', segundoApellido: 'Iquisi', nombres: 'Daniela'},
      { usuario: "marvingmk" ,primerApellido: 'Mamani', segundoApellido: 'Quino', nombres: 'Marvin Gabriel'},
      { usuario: "aracelyml" ,primerApellido: 'Mayta', segundoApellido: 'Leon', nombres: 'Aracely'},
      { usuario: "ademarmp" ,primerApellido: 'Mendoza', segundoApellido: 'Pajsi', nombres: 'Ademar'},
      { usuario: "vanessaqh" ,primerApellido: 'Quellca', segundoApellido: 'Huanca', nombres: 'Vanessa'},
      { usuario: "judtihqc" ,primerApellido: 'Quino', segundoApellido: 'Conodri', nombres: 'Judtih'},
      { usuario: "franzaqv" ,primerApellido: 'Quisbert', segundoApellido: 'Vega', nombres: 'Franz Albert'},
      { usuario: "anabelqq" ,primerApellido: 'Quispe', segundoApellido: 'Quispe', nombres: 'Anabel'},
      { usuario: "luismra" ,primerApellido: 'Rojas', segundoApellido: 'Apaza', nombres: 'Luis Miguel'},
      { usuario: "vaniaasn" ,primerApellido: 'Sangaili', segundoApellido: 'Nina', nombres: 'Vania Arely'},
      { usuario: "daysitm" ,primerApellido: 'Ticona', segundoApellido: 'Mamani', nombres: 'Daysi'},
      { usuario: "anaetq" ,primerApellido: 'Ticona', segundoApellido: 'Quispe', nombres: 'Ana Esmeralda'},
      { usuario: "cristhianam" ,primerApellido: 'Apaza', segundoApellido: 'Maldonado', nombres: 'Cristhian'},
      { usuario: "yolisacm" ,primerApellido: 'Callisaya', segundoApellido: 'Limachi', nombres: 'Yolisa'},
      { usuario: "eddydcm" ,primerApellido: 'Carani', segundoApellido: 'Mamani', nombres: 'Eddy Danilo'},
      { usuario: "sarahícq" ,primerApellido: 'Choque', segundoApellido: 'Quispe', nombres: 'Sarahi'},
      { usuario: "marcosccc" ,primerApellido: 'Condori', segundoApellido: 'Casas', nombres: 'Marcos Cesar'},
      { usuario: "robinhocc" ,primerApellido: 'Condori', segundoApellido: 'Castañeta', nombres: 'Robinho'},
      { usuario: "ronnyrmb" ,primerApellido: 'Mamani', segundoApellido: 'Bautista', nombres: 'Ronny Rey'},
      { usuario: "yoselinmv" ,primerApellido: 'Mamani', segundoApellido: 'Villca', nombres: 'Yoselin'},
      { usuario: "yhorginaqu" ,primerApellido: 'Quenta', segundoApellido: 'Uri', nombres: 'Yhorgina'},
      { usuario: "jhonnyqm" ,primerApellido: 'Quispe', segundoApellido: 'Maceda', nombres: 'Jhonny'},
      { usuario: "edzoneqm" ,primerApellido: 'Quispe', segundoApellido: 'Mamani', nombres: 'Edzon Eddy'},
      { usuario: "warahqc" ,primerApellido: 'Quito', segundoApellido: 'Coarite', nombres: 'Wara Helen'},
      { usuario: "wendysc" ,primerApellido: 'Silvestre', segundoApellido: 'Choque', nombres: 'Wendy'},
      { usuario: "marylvq" ,primerApellido: 'Velasques', segundoApellido: 'Quispe', nombres: 'Mary Luz'},
      { usuario: "alexandralzc" ,primerApellido: 'Zuñagua', segundoApellido: 'Casas', nombres: 'Alexandra Lyly'}
    ]

    for (const item of items) {
      const usuario = new Usuario({
        contrasena: pass,
        idLeccion: '1',
        usuario: item.usuario,
        primerApellido: item.primerApellido,
        segundoApellido: item.segundoApellido,
        nombres: item.nombres,
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
