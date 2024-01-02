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
import { LeccionService } from '../service'
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { BaseController } from '../../../common/base'
import { ParamIdDto } from '../../../common/dto/params-id.dto'
import { Request } from 'express'
import { ActualizarLeccionDto, CrearLeccionDto, ParamGrupoDto } from '../dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Lecciones')
@ApiBearerAuth()
@Controller('lecciones')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class LeccionController extends BaseController {
  constructor(private leccionServicio: LeccionService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de lecciones' })
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.leccionServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({
    summary: 'API para obtener el listado de lecciones por grupo',
  })
  @ApiProperty({
    type: ParamGrupoDto,
  })
  @ApiOperation({ summary: 'API para crear un nuevo leccion' })
  @ApiBody({
    type: CrearLeccionDto,
    description: 'new Leccion',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() leccionDto: CrearLeccionDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.leccionServicio.crear(
      leccionDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar un leccion' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarLeccionDto,
    description: 'new Rol',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() leccionDto: ActualizarLeccionDto
  ) {
    const { id: idLeccion } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.leccionServicio.actualizarDatos(
      idLeccion,
      leccionDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar un leccion' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idLeccion } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.leccionServicio.activar(
      idLeccion,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para inactivar un leccion' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idLeccion } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.leccionServicio.inactivar(
      idLeccion,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }
}
