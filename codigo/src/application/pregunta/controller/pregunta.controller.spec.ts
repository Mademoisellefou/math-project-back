import { CanActivate } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'
import { AuthZManagementService } from 'nest-authz'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { TextService } from '../../../common/lib/text.service'
import { CrearPreguntaDto } from '../dto'
import { PreguntaController } from '../controller'
import { PreguntaService } from '../service'
import { Request } from 'express'

const resPregunta = {
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

const resListar = [1, resPregunta]

describe('PreguntaController', () => {
  let controller: PreguntaController
  beforeAll(async () => {
    const mock_ForceFailGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreguntaController],
      providers: [
        {
          provide: PreguntaService,
          useValue: {
            listar: jest.fn(() => resListar),
            listarPorGrupo: jest.fn(() => [resPregunta]),
            crear: jest.fn(() => resPregunta),
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

    controller = module.get<PreguntaController>(PreguntaController)
  })

  it('[listar] Debería listar preguntas', async () => {
    const pagination = new PaginacionQueryDto()
    const result = await controller.listar(pagination)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('total')
    expect(result.datos).toHaveProperty('filas')
  })

  it('[crear] Debería crear un nuevo pregunta', async () => {
    const pregunta = {
      codigo: 'TD-2',
      nombre: 'Pasaporte',
      grupo: 'TD',
      descripcion: 'Pasaporte',
    }
    const preguntaDto = plainToClass(CrearPreguntaDto, pregunta)
    const result = await controller.crear(mockRequest, preguntaDto)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('id')
  })
})
