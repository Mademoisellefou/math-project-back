export enum NivelEnum {
    BAJO = 'BAJO',
    MEDIO = 'MEDIO',
    ALTO = 'ALTO'
}

export const conseguirNivel = (num: string) => {
    //
    let nuevoNumero: number = +num;
    if (nuevoNumero < 10) {
        return NivelEnum.BAJO
    }
    else {
        if (nuevoNumero => 10 && nuevoNumero <= 16) {
            return NivelEnum.MEDIO
        }
        return NivelEnum.ALTO
    }

}