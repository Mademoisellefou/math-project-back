import { Module } from '@nestjs/common'
import { FeedbackController } from './controller'
import { FeedbackService } from './service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FeedbackRepository } from './repository'
import { Feedback } from './entity'
import { UsuarioRepository } from 'src/core/usuario/repository/usuario.repository'
import { PreguntaRepository } from '../pregunta/repository'

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository, UsuarioRepository, PreguntaRepository],
  imports: [TypeOrmModule.forFeature([Feedback])],
})
export class FeedbackModule { }
