import { Module } from '@nestjs/common'
import { PreguntaController } from './controller'
import { PreguntaService } from './service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PreguntaRepository } from './repository'
import { Pregunta } from './entity'
import { UsuarioRepository } from 'src/core/usuario/repository/usuario.repository'
import { RespuestaRepository } from '../respuesta/repository'

@Module({
  controllers: [PreguntaController],
  providers: [PreguntaService, PreguntaRepository, UsuarioRepository, RespuestaRepository],
  imports: [TypeOrmModule.forFeature([Pregunta])],
})
export class PreguntaModule {}
