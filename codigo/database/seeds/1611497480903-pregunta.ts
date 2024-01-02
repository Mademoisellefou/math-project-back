
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '../../src/common/constants'
import { Pregunta } from 'src/application/pregunta/entity'

// export class pregunta1611498173795 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     const items = [
//       {
//         codigo: 'TD-P-1',
//         idLeccion: '1',
//         texto: '¿Qué es un algoritmo?'
//       },
//       {
//         codigo: 'TD-P-2',
//         idLeccion: '1',
//         texto: '¿Qué es una rana?'
//       },
//     ]
//     const preguntas = items.map((item) => {
//       return new Pregunta({
//         codigo: item.codigo,
//         idLeccion: item.idLeccion,
//         texto: item.texto,
//         estado: 'ACTIVO',
//         transaccion: 'SEEDS',
//         usuarioCreacion: USUARIO_SISTEMA,
//       })
//     })
//     await queryRunner.manager.save(preguntas)
//   }

//   /* eslint-disable */
//   public async down(queryRunner: QueryRunner): Promise<void> { }
// }
