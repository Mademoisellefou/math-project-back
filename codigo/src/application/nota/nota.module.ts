import { Module } from '@nestjs/common'
import { NotaController } from './controller'
import { NotaService } from './service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotaRepository } from './repository'
import { Nota } from './entity'

@Module({
  controllers: [NotaController],
  providers: [NotaService, NotaRepository],
  imports: [TypeOrmModule.forFeature([Nota])],
})
export class NotaModule {}
