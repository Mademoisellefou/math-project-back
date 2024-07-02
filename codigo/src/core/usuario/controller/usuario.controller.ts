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
import dotenv from 'dotenv'
import Excel from 'exceljs'
import * as Minio from 'minio'
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
import { configurarMINIO, establecerFecha } from '../constantes'

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
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('/:id/record')
  async recordEstudiante(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idUsuario } = params
    const usuarioAuditoria = this.getUser(req)
    if (!usuarioAuditoria) {
      throw new BadRequestException(
        `Es necesario que esté autenticado para consumir este recurso.`
      )
    }
    const result = await this.usuarioService.recordEstudiante(idUsuario)
    return this.successList(result)
  }
  // reporte
  @ApiOperation({ summary: 'API para crear un reporte de usuarios' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('reportes')
  async reporte(@Req() req: Request) {
    const usuarioAuditoria = this.getUser(req)
    const usuarioRol = this.getRol(req);
    const data = await this.usuarioService.record(usuarioAuditoria, usuarioRol);
    const minioClient = configurarMINIO(Minio)
    
    const file = establecerFecha('reporter decargado');//`${nombre}_${formattedDate}.xlsx`;
    const fileName = `${process.env.MINIO_PATH}/${file}`;

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('Reporte');
    const lecciones = await this.usuarioService.listaLecciones();
    const nombreLecciones = lecciones.map(ele => ele.titulo)
    const leccionesCol: any = []

    for (let index = 0; index < nombreLecciones.length; index++) {
      const leccion = nombreLecciones[index];
      leccionesCol.push({ header: leccion, key: leccion.replaceAll(' ', '_'), width: 32 })
    }
    ws.columns = [
      { header: 'Id', key: 'id', width: 8 },
      { header: 'Usuario', key: 'usuario', width: 32 },
      { header: 'Nombres', key: 'nombres', width: 32 },
      { header: 'Ap. Paterno', key: 'primerApellido', width: 32 },
      { header: 'Ap. Materno', key: 'segundoApellido', width: 32 },
      ...leccionesCol
    ];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const row = { id: index + 1, usuario: element.usuario, nombres: element.nombres, primerApellido: element.primerApellido, segundoApellido: element.segundoApellido }
      for (let index1 = 0; index1 < element.lecciones.length; index1++) {
        row[element.lecciones[index1].nombre] = element.lecciones[index1].puntaje
      }
      ws.addRow(row);
    }
    wb.xlsx
      .writeFile(fileName)
      .then(() => {
        var metaData = {
          'Content-Type': 'application/octet-stream',
          'X-Amz-Meta-Testing': 1234,
          example: 5678,
        }
        minioClient.fPutObject(`${process.env.MINIO_BUCKET_NAME}`, file, fileName, metaData, function (err, etag) {
          if (err) return console.log(err)
          console.log('File uploaded successfully.')
        })
      })
      .catch(err => {
        console.log(err.message);
      });    
    return this.successCreate({ reporte: file })
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
