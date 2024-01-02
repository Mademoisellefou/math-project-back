import { Test, TestingModule } from '@nestjs/testing'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { CrearFeedbackDto } from '../dto'
import { FeedbackRepository } from '../repository'
import { FeedbackService } from './feedback.service'
import { TextService } from '../../../common/lib/text.service'

const resFeedback = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  codigo: 'COD-1',
  nombre: 'CODIGO 1',
  grupo: 'COD',
}

describe('FeedbackService', () => {
  let service: FeedbackService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: FeedbackRepository,
          useValue: {
            listar: jest.fn(() => [[resFeedback], 1]),
            listarPorGrupo: jest.fn(() => [resFeedback]),
            crear: jest.fn(() => resFeedback),
            buscarCodigo: jest.fn(() => null),
          },
        },
      ],
    }).compile()

    service = module.get<FeedbackService>(FeedbackService)
  })

  it('[listar] Debería obtener la lista de feedbacks', async () => {
    const paginacion = new PaginacionQueryDto()
    const feedbacks = await service.listar(paginacion)

    expect(feedbacks).toBeInstanceOf(Array)
    expect(feedbacks.length).toEqual(2)
  })

  it('[crear] Debería crear un nuevo feedback', async () => {
    const feedback = new CrearFeedbackDto()
    feedback.codigo = resFeedback.codigo
    const usuarioAuditoria = TextService.generateUuid()
    const result = await service.crear(feedback, usuarioAuditoria)
    expect(result).toBeDefined()
    expect(result.codigo).toEqual(feedback.codigo)
  })
})
