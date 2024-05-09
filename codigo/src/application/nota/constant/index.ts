export enum NotaEstado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}
export const roundNumber = (value: string) => {
  const floatValue = parseFloat(value);
  const roundedFloatValue = floatValue.toFixed(2);
  const resultString = roundedFloatValue.toString();
  return resultString
}

export const establecerMinio = (Minio) => {
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
export const getDateInFormat = () => {
  const currentDate = new Date();
  return currentDate.toISOString().slice(0, 10);
}