import { Module } from '@nestjs/common'
import { PreguntaController } from './controller'
import { PreguntaService } from './service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PreguntaRepository } from './repository'
import { Pregunta } from './entity'
import { UsuarioRepository } from 'src/core/usuario/repository/usuario.repository'

@Module({
  controllers: [PreguntaController],
  providers: [PreguntaService, PreguntaRepository, UsuarioRepository],
  imports: [TypeOrmModule.forFeature([Pregunta])],
})
export class PreguntaModule {}
