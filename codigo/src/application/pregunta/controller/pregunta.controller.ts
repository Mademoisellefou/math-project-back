import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { PreguntaService } from '../service'
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { BaseController } from '../../../common/base'
import { ParamIdDto } from '../../../common/dto/params-id.dto'
import { Request } from 'express'
import { ActualizarPreguntaDto, CrearPreguntaDto, ParamGrupoDto } from '../dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Preguntas')
@ApiBearerAuth()
@Controller('preguntas')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class PreguntaController extends BaseController {
  constructor(private preguntaServicio: PreguntaService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de preguntas' })
  @Get(':id')
  async listar(@Param() params: ParamIdDto) {
    const { id: idUsuario } = params
    const result = await this.preguntaServicio.listar(idUsuario)
    return this.successList(result)
  }

  @ApiOperation({ summary: 'API para crear un nueva pregunta' })
  @ApiBody({
    type: CrearPreguntaDto,
    description: 'new Pregunta',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() preguntaDto: CrearPreguntaDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.preguntaServicio.crear(
      preguntaDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar una pregunta' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarPreguntaDto,
    description: 'new Rol',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() preguntaDto: ActualizarPreguntaDto
  ) {
    const { id: idPregunta } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.preguntaServicio.actualizarDatos(
      idPregunta,
      preguntaDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar un pregunta' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idPregunta } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.preguntaServicio.activar(
      idPregunta,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para buscar  preguntas por id Leccion' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/preguntasLeccion')
  async preguntasLeccion(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idLeccion } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.preguntaServicio.preguntasLeccion(
      idLeccion,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para inactivar un pregunta' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idPregunta } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.preguntaServicio.inactivar(
      idPregunta,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
