import { IsArray } from 'class-validator'
import { IsNotEmpty, IsOptional } from '../../../common/validation'
import { ApiProperty } from '@nestjs/swagger'
import { CrearRespuestaDto } from 'src/application/respuesta/dto'


const respuestas  =[
  {
    texto: "120Bs",
    esCorrecta: true
  },
  {
    texto: "100Bs",
    esCorrecta: false
  }
]


export class CrearPreguntaDto {

  @ApiProperty({ example: 'Mi pregunta es' })
  texto: string

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  idLeccion: string
  
  @ApiProperty({ example: respuestas })
  @IsArray()
  respuestas: CrearRespuestaDto[]

  @ApiProperty({ example: 'BAJO' })
  nivel?: string

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string
}


export class RespuestaCrearPreguntaDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  id: string
}
