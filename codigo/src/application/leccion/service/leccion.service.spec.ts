import { Test, TestingModule } from '@nestjs/testing'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { CrearLeccionDto } from '../dto'
import { LeccionRepository } from '../repository'
import { LeccionService } from './leccion.service'
import { TextService } from '../../../common/lib/text.service'

const resLeccion = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  codigo: 'COD-1',
  nombre: 'CODIGO 1',
  grupo: 'COD',
}

describe('LeccionService', () => {
  let service: LeccionService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeccionService,
        {
          provide: LeccionRepository,
          useValue: {
            listar: jest.fn(() => [[resLeccion], 1]),
            listarPorGrupo: jest.fn(() => [resLeccion]),
            crear: jest.fn(() => resLeccion),
            buscarCodigo: jest.fn(() => null),
          },
        },
      ],
    }).compile()

    service = module.get<LeccionService>(LeccionService)
  })

  it('[listar] Debería obtener la lista de leccions', async () => {
    const paginacion = new PaginacionQueryDto()
    const leccions = await service.listar(paginacion)

    expect(leccions).toBeInstanceOf(Array)
    expect(leccions.length).toEqual(2)
  })

  it('[crear] Debería crear un nuevo leccion', async () => {
    const leccion = new CrearLeccionDto()
    leccion.codigo = resLeccion.codigo
    leccion.descripcion = 'descripcion'

    const usuarioAuditoria = TextService.generateUuid()
    const result = await service.crear(leccion, usuarioAuditoria)
    expect(result).toBeDefined()
    expect(result.codigo).toEqual(leccion.codigo)
  })
})
