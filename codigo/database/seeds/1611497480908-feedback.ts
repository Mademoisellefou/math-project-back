
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '../../src/common/constants'
import { Feedback } from 'src/application/feedback/entity'

// export class feedback1611498173795 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     const items = [
//       {
//         codigo: 'TD-CI',
//         idPregunta: '1',
//       },
//     ]
//     const feedbacks = items.map((item) => {
//       return new Feedback({
//         idPregunta: item.idPregunta,
//         idUsuario: '3',
//         estado: 'ACTIVO',
//         transaccion: 'SEEDS',
//         usuarioCreacion: USUARIO_SISTEMA,
//       })
//     })
//     await queryRunner.manager.save(feedbacks)
//   }

//   /* eslint-disable */
//   public async down(queryRunner: QueryRunner): Promise<void> { }
// }
