import { CasbinRule } from '../../src/core/authorization/entity/casbin.entity'
import { RolEnum } from '../../src/core/authorization/rol.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class insertCasbinRules1617712857472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const backendRoutes: CasbinValue = {
      '/api/autorizacion/politicas': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST|DELETE|PATCH',
      },
      '/api/autorizacion/modulos': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST|DELETE|PATCH',
        [RolEnum.PROFESOR]: 'GET',
      },

      '/api/autorizacion/modulos/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },

      '/api/autorizacion/modulos/:id/activacion': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST|DELETE|PATCH',
      },

      '/api/autorizacion/modulos/:id/inactivacion': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST|DELETE|PATCH',
      },

      '/api/autorizacion/roles': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
        [RolEnum.PROFESOR]: 'GET',
      },

      '/api/autorizacion/roles/todos': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
      },
      '/api/autorizacion/roles/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },

      '/api/autorizacion/roles/:id/activacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },

      '/api/autorizacion/roles/:id/inactivacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },

      '/api/usuarios': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
        [RolEnum.PROFESOR]: 'GET',
      },
      '/api/usuarios/leccion-estudiantes': {
        [RolEnum.ADMINISTRADOR]: 'GET',
      },
      '/api/usuarios/menu': {
        [RolEnum.TODOS]: 'GET',
      },
      '/api/usuarios/record': {
        [RolEnum.TODOS]: 'GET',
      },
      '/api/usuarios/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/usuarios/:id/perfil': {
        [RolEnum.TODOS]: 'GET',
      },
      '/api/usuarios/:id/inactivacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/parametros': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
        [RolEnum.PROFESOR]: 'GET|POST',
      },
      '/api/parametros/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/parametros/:id/activacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },

      '/api/parametros/:id/inactivacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },

      '/api/parametros/:grupo/listado': {
        [RolEnum.TODOS]: 'GET',
      },

      '/api/autorizacion/permisos': {
        [RolEnum.TODOS]: 'GET',
      },

      '/api/usuarios/cuenta/perfil': {
        [RolEnum.TODOS]: 'GET',
      },

      //NUEVAS RUTAS
      '/api/respuestas': {
        [RolEnum.TODOS]: 'GET|POST',
      },
      '/api/respuestas/respuestasLeccion': {
        [RolEnum.TODOS]: 'POST',
      },
      '/api/respuestas/:id': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/respuestas/:id/activacion': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/respuestas/:id/inactivacion': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/preguntas': {
        [RolEnum.TODOS]: 'POST',
      },
      '/api/preguntas/:id': {
        [RolEnum.TODOS]: 'PATCH|GET',
      },
      '/api/preguntas/:id/activacion': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/preguntas/:id/preguntasLeccion': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/preguntas/:id/inactivacion': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/notas': {
        [RolEnum.TODOS]: 'GET|POST',
      },
      '/api/notas/:id': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/notas/:id/activacion': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/notas/:id/inactivacion': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/lecciones': {
        [RolEnum.TODOS]: 'GET|POST',
      },
      '/api/lecciones/:id': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/lecciones/:id/activacion': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/lecciones/:id/inactivacion': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/feedbacks': {
        [RolEnum.TODOS]: 'GET|POST',
      },
      '/api/feedbacks/menu': {
        [RolEnum.TODOS]: 'GET',
      },
      '/api/feedbacks/:id/repaso': {
        [RolEnum.TODOS]: 'GET',
      },
      '/api/feedbacks/:id': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/feedbacks/feedback-estudiantes': {
        [RolEnum.ADMINISTRADOR]: 'GET',
      },
      '/api/feedbacks/:id/activacion': {
        [RolEnum.TODOS]: 'PATCH',
      },
      '/api/feedbacks/inactivacion': {
        [RolEnum.TODOS]: 'POST',
      },
      '/api/feedbacks/:id/repaso-preguntas': {
        [RolEnum.TODOS]: 'GET',
      }
      //NUEVAS RUTAS
    }

    const registrarCasbin = async (
      valoresCasbin: CasbinValue,
      tipo: string
    ) => {
      for (const routePath of Object.keys(valoresCasbin)) {
        const rolNameList = Object.keys(valoresCasbin[routePath])
        for (const rolName of rolNameList) {
          const action = valoresCasbin[routePath][rolName]
          const datosRegistro = new CasbinRule({
            ptype: 'p',
            v0: rolName,
            v1: routePath,
            v2: action,
            v3: tipo,
          })
          await queryRunner.manager.save(datosRegistro)
        }
      }
    }
    await registrarCasbin(backendRoutes, 'backend')
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> { }
}

export type RouteItem = {
  [key: string]: string
}

export type CasbinValue = {
  [key: string]: RouteItem
}
