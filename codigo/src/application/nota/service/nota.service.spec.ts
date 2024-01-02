import { Test, TestingModule } from '@nestjs/testing'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { CrearNotaDto } from '../dto'
import { NotaRepository } from '../repository'
import { NotaService } from './nota.service'
import { TextService } from '../../../common/lib/text.service'

const resNota = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  codigo: 'COD-1',
  puntaje: 'puntaje',
}

describe('NotaService', () => {
  let service: NotaService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotaService,
        {
          provide: NotaRepository,
          useValue: {
            listar: jest.fn(() => [[resNota], 1]),
            listarPorGrupo: jest.fn(() => [resNota]),
            crear: jest.fn(() => resNota),
            buscarCodigo: jest.fn(() => null),
          },
        },
      ],
    }).compile()

    service = module.get<NotaService>(NotaService)
  })

  it('[listar] Debería obtener la lista de notas', async () => {
    const paginacion = new PaginacionQueryDto()
    const notas = await service.listar(paginacion)

    expect(notas).toBeInstanceOf(Array)
    expect(notas.length).toEqual(2)
  })

  it('[crear] Debería crear un nuevo nota', async () => {
    const nota = new CrearNotaDto()
    nota.codigo = resNota.codigo
    nota.puntaje = resNota.puntaje
    const usuarioAuditoria = TextService.generateUuid()
    const result = await service.crear(nota, usuarioAuditoria)
    expect(result).toBeDefined()
    expect(result.codigo).toEqual(nota.codigo)
  })
})
