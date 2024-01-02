import { Test, TestingModule } from '@nestjs/testing'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { CrearPreguntaDto } from '../dto'
import { PreguntaRepository } from '../repository'
import { PreguntaService } from './pregunta.service'
import { TextService } from '../../../common/lib/text.service'

const resPregunta = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  codigo: 'COD-1',
  texto: 'texto',
  idLecccion: '1',
}

describe('PreguntaService', () => {
  let service: PreguntaService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreguntaService,
        {
          provide: PreguntaRepository,
          useValue: {
            listar: jest.fn(() => [[resPregunta], 1]),
            listarPorGrupo: jest.fn(() => [resPregunta]),
            crear: jest.fn(() => resPregunta),
            buscarCodigo: jest.fn(() => null),
          },
        },
      ],
    }).compile()

    service = module.get<PreguntaService>(PreguntaService)
  })

  it('[listar] Debería obtener la lista de preguntas', async () => {
    const paginacion = new PaginacionQueryDto()
    const preguntas = await service.listar(paginacion)

    expect(preguntas).toBeInstanceOf(Array)
    expect(preguntas.length).toEqual(2)
  })

  it('[crear] Debería crear un nuevo pregunta', async () => {
    const pregunta = new CrearPreguntaDto()
    pregunta.codigo = resPregunta.codigo
    pregunta.texto = resPregunta.texto
    pregunta.idLeccion = resPregunta.idLecccion
    const usuarioAuditoria = TextService.generateUuid()
    const result = await service.crear(pregunta, usuarioAuditoria)
    expect(result).toBeDefined()
    expect(result.codigo).toEqual(pregunta.codigo)
  })
})
