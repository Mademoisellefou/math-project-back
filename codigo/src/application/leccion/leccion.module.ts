import { Module } from '@nestjs/common'
import { LeccionController } from './controller'
import { LeccionService } from './service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LeccionRepository } from './repository'
import { Leccion } from './entity'

@Module({
  controllers: [LeccionController],
  providers: [LeccionService, LeccionRepository],
  imports: [TypeOrmModule.forFeature([Leccion])],
})
export class LeccionModule {}
