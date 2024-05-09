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
import Excel from 'exceljs';
import * as Minio from 'minio';
import { NotaService } from '../service'
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { BaseController } from '../../../common/base'
import { ParamIdDto } from '../../../common/dto/params-id.dto'
import { Request } from 'express'
import { ActualizarNotaDto, CrearNotaDto, ParamGrupoDto } from '../dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import { establecerMinio, getDateFielName } from '../constant';

@ApiTags('Notas')
@ApiBearerAuth()
@Controller('notas')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class NotaController extends BaseController {
  constructor(private notaServicio: NotaService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de notas' })
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.notaServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }
  @ApiOperation({ summary: 'API para obtener el reporte de intentos por leccion' })
  @Get('reportesIntentos')
  async reportesIntentos(@Req() req: Request) {
    const minioClient = establecerMinio(Minio);
    const file = getDateFielName('reporte_intentos_estudiantes')
    const fileName = `${process.env.MINIO_PATH}/${file}`;
    await this.notaServicio.reportesEstudiantesIntentos(file, fileName, Excel, minioClient);
    return this.successCreate({ reporte: file })
  }
  @ApiOperation({ summary: 'API para obtener el reporte de tiempos por leccion' })
  @Get('reportesTiempo')
  async reportesTiempo(@Req() req: Request) {
    const minioClient = establecerMinio(Minio)
    const file = getDateFielName('reporte_tiempo_leccion')
    const fileName = `${process.env.MINIO_PATH}/${file}`;
    await this.notaServicio.reportesTiempo(Excel,minioClient,file,fileName);
    return this.successCreate({ reporte: file })
  }

  @ApiOperation({
    summary: 'API para obtener el listado de notas por grupo',
  })
  @ApiProperty({
    type: ParamGrupoDto,
  })
  @ApiOperation({ summary: 'API para crear un nuevo nota' })
  @ApiBody({
    type: CrearNotaDto,
    description: 'new Nota',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() notaDto: CrearNotaDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.notaServicio.crear(notaDto, usuarioAuditoria)
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar un nota' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarNotaDto,
    description: 'new Rol',
    required: true,
  })

  @ApiOperation({ summary: 'API para actualizar un nota' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarNotaDto,
    description: 'new Rol',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() notaDto: ActualizarNotaDto
  ) {
    const { id: idNota } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.notaServicio.actualizarDatos(
      idNota,
      notaDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar un nota' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idNota } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.notaServicio.activar(idNota, usuarioAuditoria)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para inactivar un nota' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idNota } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.notaServicio.inactivar(idNota, usuarioAuditoria)
    return this.successUpdate(result)
  }
}
