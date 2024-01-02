import { CanActivate } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'
import { AuthZManagementService } from 'nest-authz'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { TextService } from '../../../common/lib/text.service'
import { CrearLeccionDto } from '../dto'
import { LeccionController } from '../controller'
import { LeccionService } from '../service'
import { Request } from 'express'

const resLeccion = {
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

const resListar = [1, resLeccion]

describe('LeccionController', () => {
  let controller: LeccionController
  beforeAll(async () => {
    const mock_ForceFailGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeccionController],
      providers: [
        {
          provide: LeccionService,
          useValue: {
            listar: jest.fn(() => resListar),
            listarPorGrupo: jest.fn(() => [resLeccion]),
            crear: jest.fn(() => resLeccion),
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

    controller = module.get<LeccionController>(LeccionController)
  })

  it('[listar] Debería listar leccions', async () => {
    const pagination = new PaginacionQueryDto()
    const result = await controller.listar(pagination)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('total')
    expect(result.datos).toHaveProperty('filas')
  })

  it('[crear] Debería crear un nuevo leccion', async () => {
    const leccion = {
      codigo: 'TD-2',
      nombre: 'Pasaporte',
      grupo: 'TD',
      descripcion: 'Pasaporte',
    }
    const leccionDto = plainToClass(CrearLeccionDto, leccion)
    const result = await controller.crear(mockRequest, leccionDto)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('finalizado')
    expect(result).toHaveProperty('mensaje')
    expect(result).toHaveProperty('datos')
    expect(result.datos).toHaveProperty('id')
  })
})
