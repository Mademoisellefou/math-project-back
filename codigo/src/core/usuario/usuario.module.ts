import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsuarioService } from './service/usuario.service'
import { UsuarioController } from './controller/usuario.controller'
import { ConfigModule } from '@nestjs/config'
import { AuthorizationModule } from '../authorization/authorization.module'
import { RolRepository } from '../authorization/repository/rol.repository'
import { UsuarioRepository } from './repository/usuario.repository'
import { PersonaRepository } from './repository/persona.repository'
import { UsuarioRolRepository } from '../authorization/repository/usuario-rol.repository'
import { Usuario } from './entity/usuario.entity'
import { Persona } from './entity/persona.entity'
import { UsuarioRol } from '../authorization/entity/usuario-rol.entity'
import { Rol } from '../authorization/entity/rol.entity'
import { FeedbackRepository } from 'src/application/feedback/repository'
import { NotaRepository } from 'src/application/nota/repository'
import { LeccionRepository } from 'src/application/leccion/repository'

@Module({
  providers: [
    UsuarioService,
    UsuarioRepository,
    PersonaRepository,
    UsuarioRolRepository,
    RolRepository,
    FeedbackRepository,
    LeccionRepository,
    NotaRepository
  ],
  exports: [UsuarioService],
  imports: [
    TypeOrmModule.forFeature([Usuario, Persona, UsuarioRol, Rol]),
    ConfigModule,
    AuthorizationModule,
  ],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
