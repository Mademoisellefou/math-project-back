import { Module } from '@nestjs/common'
import { MensajeController } from './controller'
import { MensajeService } from './service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MensajeRepository } from './repository'
import { Mensaje } from './entity'

@Module({
  controllers: [MensajeController],
  providers: [MensajeService, MensajeRepository],
  imports: [TypeOrmModule.forFeature([Mensaje])],
})
export class MensajeModule {}
