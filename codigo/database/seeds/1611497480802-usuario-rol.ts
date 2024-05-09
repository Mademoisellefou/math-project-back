import { UsuarioRol } from '../../src/core/authorization/entity/usuario-rol.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '../../src/common/constants'

export class usuarioRol1611516017924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      { id: '1', rol: '1', usuario: '1', },
      { id: '2', rol: '3', usuario: '2', },
      { id: '3', rol: '3', usuario: '3', },
      { id: '4', rol: '3', usuario: '4', },
      { id: '5', rol: '3', usuario: '5' },
      { id: '6', rol: '3', usuario: '6' },
      { id: '7', rol: '3', usuario: '7' },
      { id: '8', rol: '3', usuario: '8' },
      { id: '9', rol: '3', usuario: '9' },
      { id: '10', rol: '3', usuario: '10' },
      { id: '11', rol: '3', usuario: '11' },
      { id: '12', rol: '3', usuario: '12' },
      { id: '13', rol: '3', usuario: '13' },
      { id: '14', rol: '3', usuario: '14' },
      { id: '15', rol: '3', usuario: '15' },
      { id: '16', rol: '3', usuario: '16' },
      { id: '17', rol: '3', usuario: '17' },
      { id: '18', rol: '3', usuario: '18' },
      { id: '19', rol: '3', usuario: '19' },
      { id: '20', rol: '3', usuario: '20' },
      { id: '21', rol: '3', usuario: '21' },
      { id: '22', rol: '3', usuario: '22' },
      { id: '23', rol: '3', usuario: '23' },
      { id: '24', rol: '3', usuario: '24' },
      { id: '25', rol: '3', usuario: '25' },
      { id: '26', rol: '3', usuario: '26' },
      { id: '27', rol: '3', usuario: '27' },
      { id: '28', rol: '3', usuario: '28' },
      { id: '29', rol: '3', usuario: '29' },
      { id: '30', rol: '3', usuario: '30' },
      { id: '31', rol: '3', usuario: '31' },
      { id: '32', rol: '3', usuario: '32' },
      { id: '33', rol: '3', usuario: '33' },
      { id: '34', rol: '3', usuario: '34' },
      { id: '35', rol: '3', usuario: '35' },
      { id: '36', rol: '3', usuario: '36' },
      { id: '37', rol: '3', usuario: '37' },
      { id: '38', rol: '3', usuario: '38' },
      { id: '39', rol: '3', usuario: '39' },
      { id: '40', rol: '3', usuario: '40' },
      { id: '41', rol: '3', usuario: '41' },
    ]
    const usuariosRoles = items.map((item) => {
      return new UsuarioRol({
        idRol: item.rol,
        idUsuario: item.usuario,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    })
    await queryRunner.manager.save(usuariosRoles)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
