import { Test, TestingModule } from '@nestjs/testing'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { CrearRespuestaDto } from '../dto'
import { RespuestaRepository } from '../repository'
import { RespuestaService } from './respuesta.service'
import { TextService } from '../../../common/lib/text.service'

const resRespuesta = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  codigo: 'COD-1',
  nombre: 'CODIGO 1',
  grupo: 'COD',
}

describe('RespuestaService', () => {
  let service: RespuestaService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RespuestaService,
        {
          provide: RespuestaRepository,
          useValue: {
            listar: jest.fn(() => [[resRespuesta], 1]),
            listarPorGrupo: jest.fn(() => [resRespuesta]),
            crear: jest.fn(() => resRespuesta),
            buscarCodigo: jest.fn(() => null),
          },
        },
      ],
    }).compile()

    service = module.get<RespuestaService>(RespuestaService)
  })

  it('[listar] Debería obtener la lista de respuestas', async () => {
    const paginacion = new PaginacionQueryDto()
    const respuestas = await service.listar(paginacion)

    expect(respuestas).toBeInstanceOf(Array)
    expect(respuestas.length).toEqual(2)
  })

  it('[crear] Debería crear un nuevo respuesta', async () => {
    const respuesta = new CrearRespuestaDto()
    respuesta.codigo = resRespuesta.codigo

    const usuarioAuditoria = TextService.generateUuid()
    const result = await service.crear(respuesta, usuarioAuditoria)
    expect(result).toBeDefined()
    expect(result.codigo).toEqual(respuesta.codigo)
  })
})
