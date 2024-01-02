import { Module } from '@nestjs/common'
import { ParametroModule } from './parametro/parametro.module'
import { NotaModule } from './nota/nota.module'
import { LeccionModule } from './leccion/leccion.module'
import { PreguntaModule } from './pregunta/pregunta.module'
import { RespuestaModule } from './respuesta/respuesta.module'
import { FeedbackModule } from './feedback/feedback.module'

@Module({
  imports: [
    ParametroModule,
    NotaModule,
    LeccionModule,
    PreguntaModule,
    RespuestaModule,
    FeedbackModule,
  ],
})
export class ApplicationModule {}
