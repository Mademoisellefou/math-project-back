import { Module } from '@nestjs/common'
import { NotaController } from './controller'
import { NotaService } from './service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotaRepository } from './repository'
import { Nota } from './entity'
import { LeccionRepository } from '../leccion/repository'

@Module({
  controllers: [NotaController],
  providers: [NotaService, NotaRepository, LeccionRepository],
  imports: [TypeOrmModule.forFeature([Nota])],
})
export class NotaModule { }
