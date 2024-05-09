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
import { MensajeService } from '../service'
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { BaseController } from '../../../common/base'
import { ParamIdDto } from '../../../common/dto/params-id.dto'
import { Request } from 'express'
import {
  ActualizarMensajeDto,
  CrearMensajeDto,
  ParamGrupoDto,
} from '../dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Parámetros')
@ApiBearerAuth()
@Controller('mensajes')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class MensajeController extends BaseController {
  constructor(private mensajeServicio: MensajeService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de parámetros' })
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.mensajeServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }
  
  @ApiOperation({ summary: 'API para obtener un mensaje aleatorio' })
  @Get('mensajeAleatorio')
  async mensajeAleatorio() {
    const result = await this.mensajeServicio.mensajeAleatorio()
    return this.success(result)
  }
  @ApiOperation({
    summary: 'API para obtener el listado de parámetros por grupo',
  })
  @ApiProperty({
    type: ParamGrupoDto,
  })

  @ApiOperation({ summary: 'API para crear un nuevo parámetro' })
  @ApiBody({
    type: CrearMensajeDto,
    description: 'new Mensaje',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() mensajeDto: CrearMensajeDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.mensajeServicio.crear(
      mensajeDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar un parámetro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarMensajeDto,
    description: 'new Rol',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() mensajeDto: ActualizarMensajeDto
  ) {
    const { id: idMensaje } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.mensajeServicio.actualizarDatos(
      idMensaje,
      mensajeDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar un parámetro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idMensaje } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.mensajeServicio.activar(
      idMensaje,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para inactivar un parámetro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idMensaje } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.mensajeServicio.inactivar(
      idMensaje,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
