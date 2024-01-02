import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { BaseController } from '../../../common/base'
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard'
import { CrearUsuarioDto } from '../dto/crear-usuario.dto'
import { UsuarioService } from '../service/usuario.service'
import { Messages } from '../../../common/constants/response-messages'
import { ParamUuidDto } from '../../../common/dto/params-uuid.dto'
import { ActualizarContrasenaDto } from '../dto/actualizar-contrasena.dto'
import { ActualizarUsuarioRolDto } from '../dto/actualizar-usuario-rol.dto'
import { FiltrosUsuarioDto } from '../dto/filtros-usuario.dto'
import { CasbinGuard } from '../../authorization/guards/casbin.guard'
import {
  ActivarCuentaDto,
  NuevaContrasenaDto,
} from '../dto/recuperar-cuenta.dto'
import { ParamIdDto } from '../../../common/dto/params-id.dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

@Controller('usuarios')
@ApiTags('Usuarios')
export class UsuarioController extends BaseController {
  constructor(
    private usuarioService: UsuarioService,
    private configService: ConfigService
  ) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de usuarios' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get()
  async listar(@Query() paginacionQueryDto: FiltrosUsuarioDto) {
    const result = await this.usuarioService.listar(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({
    summary: 'API para obtener el listado de Leccion de estudiantes',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('leccion-estudiantes')
  async listarLecciones() {
    const result = await this.usuarioService.listarLecciones()
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para obtener el  menu' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('menu')
  async menu(@Req() req: Request) {
    const usuarioAuditoria = this.getUser(req)
    const usuarioRol = this.getRol(req)
    const result = await this.usuarioService.menu(usuarioAuditoria, usuarioRol)
    return this.successList(result)
  }

  @ApiOperation({ summary: 'API para obtener una leccion de un usuario' })
  @ApiBearerAuth()
  @ApiProperty({
    type: ParamIdDto,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('/:id/leccion')
  async obtenerLeccion(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idLeccion } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.usuarioService.obtenerLeccion(
      idLeccion,
      usuarioAuditoria
    )
    return this.successList(result)
  }

  @ApiOperation({ summary: 'Obtiene la información del perfil del usuario' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('/cuenta/perfil')
  async obtenerPerfil(@Req() req: Request) {
    const user = req.user
    if (!user) {
      throw new BadRequestException(
        `Es necesario que esté autenticado para consumir este recurso.`
      )
    }
    const result = await this.usuarioService.buscarUsuarioPerfil(
      user.id,
      user.idRol!
    )
    return this.success(result)
  }

  //create user
  @ApiOperation({ summary: 'API para crear un nuevo usuario' })
  @ApiBearerAuth()
  @ApiBody({
    type: CrearUsuarioDto,
    description: 'new Usuario',
    required: true,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Post()
  async crear(@Req() req: Request, @Body() usuarioDto: CrearUsuarioDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.usuarioService.crear(usuarioDto, usuarioAuditoria)
    return this.successCreate(result)
  }

  // activar usuario
  @ApiOperation({ summary: 'API para activar una Cuenta' })
  @ApiBody({
    type: ActivarCuentaDto,
    description: 'Cuenta',
    required: true,
  })
  @Patch('/cuenta/activacion')
  async activarCuenta(@Body() activarCuentaDto: ActivarCuentaDto) {
    const result = await this.usuarioService.activarCuenta(
      activarCuentaDto.codigo
    )
    return this.successUpdate(result, Messages.ACCOUNT_ACTIVED_SUCCESSFULLY)
  }

  // validate restore user account
  @ApiOperation({ summary: 'API para nueva Contraseña' })
  @ApiBody({
    type: NuevaContrasenaDto,
    description: 'Cuenta',
    required: true,
  })
  @Patch('/cuenta/nueva-contrasena')
  async nuevaContrasena(@Body() nuevaContrasenaDto: NuevaContrasenaDto) {
    const result =
      await this.usuarioService.nuevaContrasenaTransaccion(nuevaContrasenaDto)
    return this.success(result, Messages.SUCCESS_DEFAULT)
  }

  // activar usuario
  @ApiOperation({ summary: 'Activa un usuario' })
  @ApiBearerAuth()
  @ApiProperty({
    type: ParamIdDto,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idUsuario } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.usuarioService.activar(
      idUsuario,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  // activar usuario
  @ApiOperation({ summary: 'Busca perfil de  un usuario' })
  @ApiBearerAuth()
  @ApiProperty({
    type: ParamIdDto,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('/:id/perfil')
  async perfilUsuario(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idUsuario } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.usuarioService.perfilUsuario(
      idUsuario,
      usuarioAuditoria
    )
    return result
  }

  // inactivar usuario
  @ApiOperation({ summary: 'Inactiva un usuario' })
  @ApiBearerAuth()
  @ApiProperty({
    type: ParamIdDto,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idUsuario } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.usuarioService.inactivar(
      idUsuario,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({
    summary: 'Actualiza la contrasena de un usuario authenticado',
  })
  @ApiBearerAuth()
  @ApiBody({
    type: ActualizarContrasenaDto,
    description: 'new Rol',
    required: true,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/cuenta/contrasena')
  async actualizarContrasena(
    @Req() req: Request,
    @Body() body: ActualizarContrasenaDto
  ) {
    const idUsuario = this.getUser(req)
    const { contrasenaActual, contrasenaNueva } = body
    const result = await this.usuarioService.actualizarContrasena(
      idUsuario,
      contrasenaActual,
      contrasenaNueva
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para restaurar la contraseña de un usuario' })
  @ApiBearerAuth()
  @ApiProperty({
    type: ParamIdDto,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/restauracion')
  async restaurarContrasena(@Req() req: Request, @Param() params: ParamIdDto) {
    const usuarioAuditoria = this.getUser(req)
    const { id: idUsuario } = params
    const result = await this.usuarioService.restaurarContrasena(
      idUsuario,
      usuarioAuditoria
    )
    return this.successUpdate(result, Messages.SUCCESS_RESTART_PASSWORD)
  }

  @ApiOperation({ summary: 'API para reenviar Correo Activación' })
  @ApiBearerAuth()
  @ApiProperty({
    type: ParamIdDto,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch('/:id/reenviar')
  async reenviarCorreoActivacion(
    @Req() req: Request,
    @Param() params: ParamIdDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const { id: idUsuario } = params
    const result = await this.usuarioService.reenviarCorreoActivacion(
      idUsuario,
      usuarioAuditoria
    )
    return this.successUpdate(result, Messages.SUCCESS_RESEND_MAIL_ACTIVATION)
  }

  //update user
  @ApiOperation({ summary: 'Actualiza datos de un usuario' })
  @ApiBearerAuth()
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: ActualizarUsuarioRolDto,
    description: 'Usuario',
    required: true,
  })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch(':id')
  async actualizarDatos(
    @Req() req: Request,
    @Param() params: ParamIdDto,
    @Body() usuarioDto: ActualizarUsuarioRolDto
  ) {
    const { id: idUsuario } = params
    const usuarioAuditoria = this.getUser(req)
    const result = await this.usuarioService.actualizarDatos(
      idUsuario,
      usuarioDto,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @ApiOperation({
    summary: 'Desbloquea una cuenta bloqueada por muchos intentos fallidos',
  })
  @ApiQuery({
    name: 'id',
    type: ParamUuidDto,
  })
  @Get('cuenta/desbloqueo')
  async desbloquearCuenta(@Query() query: ParamUuidDto) {
    const { id: idDesbloqueo } = query
    const result = await this.usuarioService.desbloquearCuenta(idDesbloqueo)
    return this.successUpdate(result, Messages.SUCCESS_ACCOUNT_UNLOCK)
  }

  @Get('/test/codigo/:id')
  async obtenerCodigo(@Param() params: ParamIdDto) {
    if (this.configService.get('NODE_ENV') === 'production') {
      throw new NotFoundException(Messages.EXCEPTION_NOT_FOUND)
    }
    const { id: idUsuario } = params
    const result = await this.usuarioService.obtenerCodigoTest(idUsuario)
    return this.success(result, Messages.SUCCESS_DEFAULT)
  }
}
