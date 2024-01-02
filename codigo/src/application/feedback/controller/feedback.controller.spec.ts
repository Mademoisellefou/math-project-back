import { CanActivate } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'
import { AuthZManagementService } from 'nest-authz'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { TextService } from '../../../common/lib/text.service'
import { CrearFeedbackDto } from '../dto'
import { FeedbackController } from '../controller'
import { FeedbackService } from '../service'
import { Request } from 'express'

const resFeedback = {
  id: TextService.generateUuid(),
  codigo: 'TD-CI',
  nombre: 'Cedula de identidad',
  grupo: 'TD',
}

const mockRequest = {
  user: {
    id: TextService.generateUuid(),
  },
} as Request

const resListar = [1, resFeedback]

describe('FeedbackController', () => {
  let controller: FeedbackController
  beforeAll(async () => {
    const mock_ForceFailGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          provide: FeedbackService,
          useValue: {
            listar: jest.fn(() => resListar),
            listarPorGrupo: jest.fn(() => [resFeedback]),
            crear: jest.fn(() => resFeedback),
          },
        },
        {
          provide: AuthZManagementService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(CasbinGuard)
      .useValue(mock_ForceFailGuard)
      .compile()

    controller = module.get<FeedbackController>(FeedbackController)
  })

  it('[listar] Debería listar parámetros', async () => {
    const pagination = new PaginacionQueryDto()
    const result = await controller.listar(pagination)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('total')
    expect(result.datos).toHaveProperty('filas')
  })

  it('[listarPorGrupo] Debería listar parámetros por grupo', async () => {
    const mockRequest = {
      grupo: 'TD',
    }
    const result = await controller.listarPorGrupo(mockRequest)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toBeInstanceOf(Array)
  })

  it('[crear] Debería crear un nuevo parámetro', async () => {
    const feedback = {
      codigo: 'TD-2',
      nombre: 'Pasaporte',
      grupo: 'TD',
      descripcion: 'Pasaporte',
    }
    const feedbackDto = plainToClass(CrearFeedbackDto, feedback)
    const result = await controller.crear(mockRequest, feedbackDto)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('id')
  })
})
