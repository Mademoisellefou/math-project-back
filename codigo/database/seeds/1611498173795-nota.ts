
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '../../src/common/constants'
import { Nota } from 'src/application/nota/entity'

export class nota1611498173795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // let notas:any = []
    // for (let index = 1; index < 42; index++) {   
    //     notas.push(
    //       new Nota({
    //         intentos: 0,
    //         idUsuario: index.toString(),
    //         idLeccion: '1',
    //         estado: 'ACTIVO',
    //         transaccion: 'SEEDS',
    //         usuarioCreacion: USUARIO_SISTEMA,
    //       })
    //     )
    // }
    // await queryRunner.manager.save(notas)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
