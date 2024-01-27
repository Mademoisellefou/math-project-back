
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '../../src/common/constants'
import { Nota } from 'src/application/nota/entity'

export class nota1611498173795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        codigo: 'TD-CI',
        idUsuario: '1',
        idLeccion: '1'
      },
      {
        codigo: 'TD-CI',
        idUsuario: '3',
        idLeccion: '1'
      },
      {
        codigo: 'TD-CI',
        idUsuario: '3',
        idLeccion: '2'
      },
      {
        codigo: 'TD-CI',
        idUsuario: '3',
        idLeccion: '3'
      },
    ]
    const notas = items.map((item) => {
      return new Nota({
        intentos: 0,
        idUsuario: item.idUsuario,
        idLeccion: item.idLeccion,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    })
    await queryRunner.manager.save(notas)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
