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
export const configurarMINIO = (Minio) => {
    return new Minio.Client({
        endPoint: process.env.MINIO_ENDPOINT?.toString() ?? '',
        port: Number(process.env.MINIO_PORT?.toString()) ?? 443,
        accessKey: process.env.MINIO_ACCESSKEY?.toString() ?? '',
        secretKey: process.env.MINIO_SECRETKEY?.toString() ?? '',
        useSSL: true,
        region: process.env.MINIO_REGION?.toString() ?? ''
    })
}
export const getDateFielName = (nombre: string) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    return `${nombre}_${formattedDate}.xlsx`;
}
export const establecerFecha=(name: string)=>{
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    const nombre = name + "-mate-estudiantes"
    return `${nombre}_${formattedDate}.xlsx`;;
}