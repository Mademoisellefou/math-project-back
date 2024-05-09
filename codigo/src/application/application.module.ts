import { Module } from '@nestjs/common'
import { NotaModule } from './nota/nota.module'
import { LeccionModule } from './leccion/leccion.module'
import { PreguntaModule } from './pregunta/pregunta.module'
import { RespuestaModule } from './respuesta/respuesta.module'
import { FeedbackModule } from './feedback/feedback.module'
import { MensajeModule } from './mensaje/mensaje.module'

@Module({
  imports: [
    NotaModule,
    LeccionModule,
    PreguntaModule,
    RespuestaModule,
    FeedbackModule,
    MensajeModule
  ],
})
export class ApplicationModule { }
