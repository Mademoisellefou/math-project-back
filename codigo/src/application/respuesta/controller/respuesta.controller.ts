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
import { RespuestaService } from '../service'
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { BaseController } from '../../../common/base'
import { ParamIdDto } from '../../../common/dto/params-id.dto'
import { Request } from 'express'
import {
  ActualizarRespuestaDto,
  CrearRespuestaDto,
} from '../dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import { ObtenerLeccionDto } from '../dto/leccion-respuesta.dto'

@ApiTags('Respuestas')
@ApiBearerAuth()
@Controller('respuestas')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class RespuestaController extends BaseController {
  constructor(private respuestaServicio: RespuestaService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de respuestas' })
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.respuestaServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para crear un nuevo respuesta' })
  @ApiBody({
    type: CrearRespuestaDto,
    description: 'new Respuesta',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() respuestaDto: CrearRespuestaDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.respuestaServicio.crear(
      respuestaDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }
  @ApiOperation({ summary: 'API para obtener respuestas de una leccion' })
  @ApiBody({
    type: ObtenerLeccionDto,
    description: 'new Respuesta',
    required: true,
  })
  @Post('respuestasLeccion')
  async respuestasLeccion(
    @Req() req: Request,
    @Body() respuestasLeccionDto: ObtenerLeccionDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.respuestaServicio.respuestasLeccion(
      respuestasLeccionDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar un respuesta' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarRespuestaDto,
    description: 'new Rol',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() respuestaDto: ActualizarRespuestaDto
  ) {
    const { id: idRespuesta } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.respuestaServicio.actualizarDatos(
      idRespuesta,
      respuestaDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar un respuesta' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idRespuesta } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.respuestaServicio.activar(
      idRespuesta,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para inactivar un respuesta' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/inactivacion')
  async inactivar(
    @Req() req: Request,
    @Param() params: ParamIdDto,
    @Body() respuestaDto: ActualizarRespuestaDto
  ) {
    const { id: idRespuesta } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.respuestaServicio.inactivar(
      idRespuesta,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
