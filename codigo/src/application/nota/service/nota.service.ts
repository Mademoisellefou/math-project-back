import { BaseService } from '../../../common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { NotaRepository } from '../repository'
import { CrearNotaDto } from '../dto'
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto'
import { Messages } from '../../../common/constants/response-messages'
import { ActualizarNotaDto } from '../dto'
import { NotaEstado, getDateInFormat, roundNumber } from '../constant'
import { LeccionRepository } from 'src/application/leccion/repository'
import { ColumnaReporteIntento, ColumnaReporteTiempo } from '../dto/actualizar-nota.dto'

@Injectable()
export class NotaService extends BaseService {
  constructor(
    @Inject(NotaRepository)
    private notaRepositorio: NotaRepository,
    @Inject(LeccionRepository)
    private leccionRepositorio: LeccionRepository,
  ) {
    super()
  }

  async crear(notaDto: CrearNotaDto, usuarioAuditoria: string) {
    return await this.notaRepositorio.crear(notaDto, usuarioAuditoria)
  }

  async exportIntentosExcel(file, data, fileName, Excel, minioClient) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Hoja 1');

    worksheet.addRow([]);
    const rowFecha = worksheet.addRow(['fecha: ' + getDateInFormat()]);
    rowFecha.font = { bold: true };
    const boldStringRow = worksheet.addRow(['Intentos por Leccion']);
    boldStringRow.font = { bold: true };

    worksheet.addRow([]);

    Object.keys(data).forEach(sectionKey => {
      const headerRow = worksheet.addRow([sectionKey]);
      headerRow.font = { bold: true };

      const sectionData = data[sectionKey];

      const tableHeader = worksheet.addRow(Object.keys(sectionData[0]));
      tableHeader.eachCell((cell, colNumber) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
        cell.font = { bold: true };
        worksheet.getColumn(colNumber).width = 25;
      });

      sectionData.forEach(item => {
        const rowData = Object.values(item);
        const row = worksheet.addRow(rowData);
        row.eachCell((cell, colNumber) => {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          if (colNumber >= 2 && colNumber <= 4) {
            cell.alignment = { horizontal: 'center' };
          }
        });
      });

      worksheet.addRow([]);
    });

    workbook.xlsx
      .writeFile(fileName)
      .then(() => {
        var metaData = {
          'Content-Type': 'application/octet-stream',
          'X-Amz-Meta-Testing': 4356,
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
  }
  async reportesEstudiantesIntentos(file, fileName, Excel, minioClient) {
    const estudiantesIntentos = await this.notaRepositorio.reportesEstudiantesIntentos();
    if (estudiantesIntentos.length === 0 || !estudiantesIntentos) {
      throw new NotFoundException("No existe notas para Reporte Intentos Promedio")
    }
    const resultado = {}
    for (let index = 0; index < estudiantesIntentos.length; index++) {
      const element = estudiantesIntentos[index];
      if (!(element['titulo'] in resultado)) {
        resultado[element['titulo']] = []
      }
      resultado[element['titulo']].push({ intentos: element['intentos'], usuario: element['usuario'] });
    }
    if (!resultado || Object.keys(resultado).length === 0) {
      throw new NotFoundException("No existe notas para Reporte Intentos Promedio")
    }
    this.exportIntentosExcel(file, resultado, fileName, Excel, minioClient)
  }
  async reportesTiempoExcel(Excel, minioClient, file: string, fileName: string, data: ColumnaReporteTiempo[]) {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('Hoja1');
    const fecha = ws.addRow(['fecha: ' + getDateInFormat()])
    fecha.font = { bold: true };
    ws.addRow([])
    const header = ws.addRow([
      'Leccion',
      'Promedio Resolución (segundos)'
    ]);
    header.font = { bold: true }
    header.eachCell((cell, colNumber) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }
      ws.getColumn(colNumber).width = 35;
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    })
    data.forEach(item => {
      let tmpRow = ws.addRow([item['Leccion'], item['PromedioTiempoResuelto']])
      tmpRow.eachCell((cell,_)=>{
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      })
    }
    )
    wb.xlsx
      .writeFile(fileName)
      .then(() => {
        var metaData = {
          'Content-Type': 'application/octet-stream',
          'X-Amz-Meta-Testing': 4356,
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
  }
  async reportesIntentos() {
    const promediosIntentos = await this.notaRepositorio.reportesIntentos()
    if (promediosIntentos.length === 0 || !promediosIntentos) {
      throw new NotFoundException("No existe notas para Reporte Intentos Promedio")
    }
    const leccion = await this.leccionRepositorio.listaLecciones()
    const data: ColumnaReporteIntento[] = []
    for (let index = 0; index < promediosIntentos.length; index++) {
      const promedioIntento = roundNumber(promediosIntentos[index]['intentosLeccion']);
      const nombreLeccion = leccion[index].titulo;
      data.push({ Leccion: nombreLeccion, PromedioIntentos: promedioIntento })
    }
    if (data.length === 0) {
      throw new NotFoundException("No existe notas para Reporte Intentos Promedio")
    }
    return data;
  }

  async reportesTiempo(Excel, minioClient, file: string, fileName: string) {
    const promediosTiempos = await this.notaRepositorio.reportesTiempo()
    if (promediosTiempos.length === 0 || !promediosTiempos) {
      throw new NotFoundException("No existe notas para Reporte Tiempo Promedio")
    }
    const leccion = await this.leccionRepositorio.listaLecciones()
    const data: ColumnaReporteTiempo[] = []
    for (let index = 0; index < promediosTiempos.length; index++) {
      const promedioTiempo = roundNumber(promediosTiempos[index]['tiempoLeccion']);
      const nombreLeccion = leccion[index].titulo;
      data.push({ Leccion: nombreLeccion, PromedioTiempoResuelto: promedioTiempo })
    }
    if (data.length === 0) {
      throw new NotFoundException("No existe notas para Reporte Tiempo Promedio")
    }
    this.reportesTiempoExcel(Excel, minioClient, file, fileName, data)
    return data;
  }
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    return await this.notaRepositorio.listar(paginacionQueryDto)
  }
  async actualizarDatos(
    id: string,
    notaDto: ActualizarNotaDto,
    usuarioAuditoria: string
  ) {
    const nota = await this.notaRepositorio.buscarPorId(id)
    if (!nota) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.notaRepositorio.actualizar(id, notaDto, usuarioAuditoria)
    return { id }
  }

  async buscarNotaUsuario(
    idLeccion: string,
    usuarioAuditoria: string
  ) {
    const nota = await this.notaRepositorio.buscarPorUsuarioLeccion(usuarioAuditoria, idLeccion)
    if (!nota) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    return nota
  }

  async activar(idNota: string, usuarioAuditoria: string) {
    const nota = await this.notaRepositorio.buscarPorId(idNota)
    if (!nota) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const notaDto = new ActualizarNotaDto()
    notaDto.estado = NotaEstado.ACTIVO
    await this.notaRepositorio.actualizar(idNota, notaDto, usuarioAuditoria)
    return {
      id: idNota,
      estado: notaDto.estado,
    }
  }

  async inactivar(idNota: string, usuarioAuditoria: string) {
    const nota = await this.notaRepositorio.buscarPorId(idNota)
    if (!nota) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    const notaDto = new ActualizarNotaDto()
    notaDto.estado = NotaEstado.INACTIVO
    await this.notaRepositorio.actualizar(idNota, notaDto, usuarioAuditoria)
    return {
      id: idNota,
      estado: notaDto.estado,
    }
  }
}
