
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '../../src/common/constants'
import { Mensaje } from 'src/application/mensaje/entity'


export class mensaje1611498173795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      { texto: "Ascesoria de manejo de Redes Sociales." },
      { texto: "Artículos decorativos utilizando materiales de bajo costo como cuentas, papel o materiales reciclados." },
      { texto: "Venta Cursos virtuales." },
      { texto: "Reventa de libros en plataformas de lectura." },
    ]
    const feedbacks = items.map((item) => {
      return new Mensaje({
        texto: item.texto,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    })
    await queryRunner.manager.save(feedbacks)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
