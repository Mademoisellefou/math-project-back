
export interface NotaPuntajeDto {
    puntaje: number;
    nombre: string
}
export class UsuarioNotaDto {
    usuario: string;
    lecciones: NotaPuntajeDto[];
    nombres: string;
    primerApellido: string;
    segundoApellido: string;
}