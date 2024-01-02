import { Module } from '@nestjs/common'
import { RespuestaController } from './controller'
import { RespuestaService } from './service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RespuestaRepository } from './repository'
import { Respuesta } from './entity'
import { FeedbackRepository } from '../feedback/repository'
import { LeccionRepository } from '../leccion/repository'
import { UsuarioRepository } from 'src/core/usuario/repository/usuario.repository'

@Module({
  controllers: [RespuestaController],
  providers: [
    RespuestaService,
    RespuestaRepository,
    FeedbackRepository,
    LeccionRepository,
    UsuarioRepository,
  ],
  imports: [TypeOrmModule.forFeature([Respuesta])],
})
export class RespuestaModule {}
