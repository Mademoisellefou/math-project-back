
export interface NotaPuntajeDto {
    puntaje: number;
    nombre: string
}
export class UsuarioNotaDto {
    id: string;
    usuario: string;
    lecciones: NotaPuntajeDto[];

}