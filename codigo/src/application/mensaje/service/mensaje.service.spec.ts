import { Test, TestingModule } from '@nestjs/testing'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { CrearMensajeDto } from '../dto'
import { MensajeRepository } from '../repository'
import { MensajeService } from './mensaje.service'
import { TextService } from '../../../common/lib/text.service'

const resMensaje = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  codigo: 'COD-1',
  nombre: 'CODIGO 1',
  grupo: 'COD',
}

describe('MensajeService', () => {
  let service: MensajeService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MensajeService,
        {
          provide: MensajeRepository,
          useValue: {
            listar: jest.fn(() => [[resMensaje], 1]),
            listarPorGrupo: jest.fn(() => [resMensaje]),
            crear: jest.fn(() => resMensaje),
            buscarCodigo: jest.fn(() => null),
          },
        },
      ],
    }).compile()

    service = module.get<MensajeService>(MensajeService)
  })

  it('[listar] Debería obtener la lista de mensajes', async () => {
    const paginacion = new PaginacionQueryDto()
    const mensajes = await service.listar(paginacion)

    expect(mensajes).toBeInstanceOf(Array)
    expect(mensajes.length).toEqual(2)
  })

  it('[listarPorGrupo] Debería obtener la lista de mensajes por grupo', async () => {
    const grupo = 'TD'
    const mensajes = await service.listarPorGrupo(grupo)
    expect(mensajes).toBeInstanceOf(Array)
  })

  it('[crear] Debería crear un nuevo parámetro', async () => {
    const mensaje = new CrearMensajeDto()
    mensaje.codigo = resMensaje.codigo
    mensaje.nombre = resMensaje.nombre
    mensaje.grupo = resMensaje.grupo
    mensaje.descripcion = 'descripcion'

    const usuarioAuditoria = TextService.generateUuid()
    const result = await service.crear(mensaje, usuarioAuditoria)
    expect(result).toBeDefined()
    expect(result.codigo).toEqual(mensaje.codigo)
  })
})
