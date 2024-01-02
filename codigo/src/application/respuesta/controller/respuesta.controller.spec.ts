import { CanActivate } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'
import { AuthZManagementService } from 'nest-authz'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { TextService } from '../../../common/lib/text.service'
import { CrearRespuestaDto } from '../dto'
import { RespuestaController } from '../controller'
import { RespuestaService } from '../service'
import { Request } from 'express'

const resRespuesta = {
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

const resListar = [1, resRespuesta]

describe('RespuestaController', () => {
  let controller: RespuestaController
  beforeAll(async () => {
    const mock_ForceFailGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RespuestaController],
      providers: [
        {
          provide: RespuestaService,
          useValue: {
            listar: jest.fn(() => resListar),
            listarPorGrupo: jest.fn(() => [resRespuesta]),
            crear: jest.fn(() => resRespuesta),
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

    controller = module.get<RespuestaController>(RespuestaController)
  })

  it('[listar] Debería listar respuestas', async () => {
    const pagination = new PaginacionQueryDto()
    const result = await controller.listar(pagination)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('total')
    expect(result.datos).toHaveProperty('filas')
  })

  it('[crear] Debería crear un nuevo respuesta', async () => {
    const respuesta = {
      codigo: 'TD-2',
      nombre: 'Pasaporte',
      grupo: 'TD',
      descripcion: 'Pasaporte',
    }
    const respuestaDto = plainToClass(CrearRespuestaDto, respuesta)
    const result = await controller.crear(mockRequest, respuestaDto)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('id')
  })
})
