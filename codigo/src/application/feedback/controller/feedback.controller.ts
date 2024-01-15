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
import { FeedbackService } from '../service'
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { BaseController } from '../../../common/base'
import { ParamIdDto } from '../../../common/dto/params-id.dto'
import { Request } from 'express'
import { ActualizarFeedbackDto, CrearFeedbackDto, ParamGrupoDto } from '../dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import { EliminarFeedbackDto } from '../dto/eliminar-feedback.dto'

@ApiTags('Feedbacks')
@ApiBearerAuth()
@Controller('feedbacks')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class FeedbackController extends BaseController {
  constructor(private feedbackServicio: FeedbackService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de feedbacks' })
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.feedbackServicio.listar(paginacionQueryDto)
    return this.successListRows(result)
  }
  // feedback-estudiantes
  @ApiOperation({ summary: 'API para obtener el listado de feedbacks' })
  @Get('feedback-estudiantes')
  async listarFeedback() {
    const result = await this.feedbackServicio.listarFeedback()
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para obtener un repaso' })
  @Get(':id/repaso')
  async repaso(@Param() params: ParamIdDto) {
    const result = await this.feedbackServicio.repaso(params)
    return this.successList(result)
  }
  @ApiOperation({ summary: 'API para obtener total repaso' })
  @Get('menu')
  async menu(@Req() req: Request) {
    const idUsuario = this.getUser(req);
    const usuarioRol = this.getRol(req);
    const result = await this.feedbackServicio.menu(idUsuario, usuarioRol)
    return this.successList(result)
  }

  @ApiOperation({
    summary: 'API para obtener el listado de feedbacks por grupo',
  })
  @ApiProperty({
    type: ParamGrupoDto,
  })
  @ApiOperation({ summary: 'API para crear un nuevo feedback' })
  @ApiBody({
    type: CrearFeedbackDto,
    description: 'new Feedback',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() feedbackDto: CrearFeedbackDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.feedbackServicio.crear(
      feedbackDto,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar un feedback' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarFeedbackDto,
    description: 'new Rol',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() feedbackDto: ActualizarFeedbackDto
  ) {
    const { id: idFeedback } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.feedbackServicio.actualizarDatos(
      idFeedback,
      feedbackDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar un feedback' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idFeedback } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.feedbackServicio.activar(
      idFeedback,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para inactivar un feedback' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Post('/inactivacion')
  async inactivar(
    @Req() req: Request,
    @Body() feedbackDto: EliminarFeedbackDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.feedbackServicio.inactivar(
      usuarioAuditoria,
      feedbackDto
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar un feedback' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Get('/:id/repaso-preguntas')
  async repasoPreguntas(@Req() req: Request, @Param() params: ParamIdDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.feedbackServicio.repasoPreguntas(usuarioAuditoria)
    return this.successUpdate(result)
  }
}
