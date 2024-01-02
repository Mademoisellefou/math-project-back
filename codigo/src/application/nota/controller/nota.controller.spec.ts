import { CanActivate } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'
import { AuthZManagementService } from 'nest-authz'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { TextService } from '../../../common/lib/text.service'
import { CrearNotaDto } from '../dto'
import { NotaController } from '../controller'
import { NotaService } from '../service'
import { Request } from 'express'

const resNota = {
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

const resListar = [1, resNota]

describe('NotaController', () => {
  let controller: NotaController
  beforeAll(async () => {
    const mock_ForceFailGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotaController],
      providers: [
        {
          provide: NotaService,
          useValue: {
            listar: jest.fn(() => resListar),
            listarPorGrupo: jest.fn(() => [resNota]),
            crear: jest.fn(() => resNota),
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

    controller = module.get<NotaController>(NotaController)
  })

  it('[listar] Debería listar notas', async () => {
    const pagination = new PaginacionQueryDto()
    const result = await controller.listar(pagination)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('total')
    expect(result.datos).toHaveProperty('filas')
  })

  it('[crear] Debería crear un nuevo nota', async () => {
    const nota = {
      codigo: 'TD-2',
      nombre: 'Pasaporte',
      grupo: 'TD',
      descripcion: 'Pasaporte',
    }
    const notaDto = plainToClass(CrearNotaDto, nota)
    const result = await controller.crear(mockRequest, notaDto)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('id')
  })
})
