// Parámetros de configuración
export const Configurations = {
  SCORE_PASSWORD: 3, // NIVEL MÍNIMO DE CALIFICACIÓN PASSWORD
  SALT_ROUNDS: 10, // NUMERO DE SALTOS PARA GENERACIÓN DE HASH
  WRONG_LOGIN_LIMIT: 3, // NUMERO MÁXIMO DE INTENTOS DE INICIO DE SESIÓN ERRÓNEOS
  MINUTES_LOGIN_LOCK: 15, // TIEMPO EN MINUTOS DE BLOQUEO DE CUENTA
  // LISTA DE DOMINIOS DE EMAIL NO PERMITIDOS
  BLACK_LIST_EMAILS: [
    '10minutemail.com',
    'mailnesia',
  ],
}
