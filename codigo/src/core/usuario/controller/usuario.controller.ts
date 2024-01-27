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
    summary: 'API para obtener el record de un estudiante',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('record')
  async recordEstudiante(@Req() req: Request) {
    const usuarioAuditoria = this.getUser(req)
    if (!usuarioAuditoria) {
      throw new BadRequestException(
        `Es necesario que esté autenticado para consumir este recurso.`
      )
    }
    const result = await this.usuarioService.recordEstudiante(usuarioAuditoria)
    return this.successList(result)
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

}
