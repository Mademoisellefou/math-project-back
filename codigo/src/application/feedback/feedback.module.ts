import { Module } from '@nestjs/common'
import { FeedbackController } from './controller'
import { FeedbackService } from './service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FeedbackRepository } from './repository'
import { Feedback } from './entity'

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository],
  imports: [TypeOrmModule.forFeature([Feedback])],
})
export class FeedbackModule {}
