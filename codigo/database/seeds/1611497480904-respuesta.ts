
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '../../src/common/constants'
import { Respuesta } from 'src/application/respuesta/entity'

// export class respuesta1611498173795 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     const items = [
//       {
//         codigo: 'TD-CI-1',
//         idPregunta: '1',
//         esCorrecta: true,
//         texto: 'Un algoritmo es un conjunto de instrucciones que se ejecutan para resolver un problema.'
//       },
//       {
//         codigo: 'TD-CI-2',
//         idPregunta: '1',
//         esCorrecta: false,
//         texto: 'Un algoritmo es un conjunto de instrucciones que se ejecutan para resolver un ecuacion.'
//       },
//       {
//         codigo: 'TD-DI-1',
//         idPregunta: '2',
//         esCorrecta: true,
//         texto: 'Es un animal herviboro'
//       },
//       {
//         codigo: 'TD-DI-2',
//         idPregunta: '2',
//         esCorrecta: false,
//         texto: 'Es un animal carnivoro'
//       },
//     ]
//     const respuestas = items.map((item) => {
//       return new Respuesta({
//         codigo: item.codigo,
//         idPregunta: item.idPregunta,
//         texto: item.texto,
//         estado: 'ACTIVO',
//         transaccion: 'SEEDS',
//         esCorrecta: item.esCorrecta,
//         usuarioCreacion: USUARIO_SISTEMA,
//       })
//     })
//     await queryRunner.manager.save(respuestas)
//   }

//   /* eslint-disable */
//   public async down(queryRunner: QueryRunner): Promise<void> { }
// }
