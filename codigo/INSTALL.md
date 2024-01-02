# Manual de instalación

## 1. Requerimientos

| Nombre       | Versión | Descripción                                            | Instalación                                      |
|--------------|---------|--------------------------------------------------------|--------------------------------------------------|
| `PostgreSQL` | ^16     | Gestor de base de datos.                               | https://www.postgresql.org/download/linux/debian |
| `NodeJS`     | ^20     | Entorno de programación de JavaScript.                 | `nvm install 20` https://github.com/nvm-sh/nvm   |
| `NPM`        | ^10     | Gestor de paquetes de NodeJS.                          | `npm install -g npm@10`                          |
| `PM2`        | ^5.3    | Gestor avanzado de procesos de producción para NodeJS. | `npm install -g pm2@5.3`                         |

## 2. Instalación

### Clonación del proyecto e instalación de dependencias

```bash
# Instalamos dependencias
npm install
```

### Archivos de configuración.

Copiar archivos `.sample` y modificar los valores que sean necesarios (para más detalles revisa la sección **Variables
de entorno**).

```bash
# Variables de entorno globales
cp .env.sample .env

# Otros parámetros requeridos
cp src/common/params/index.ts.sample src/common/params/index.ts

# [OPCIONAL] Para el modo producción
cp ecosystem.config.js.sample ecosystem.config.js
```

### Creación y configuración de la Base de Datos

Ver el archivo [database/scripts/README.md](./database/scripts/README.md)

Una vez se tenga creada la base de datos y sus respectivos esquemas ejecutar el siguiente comando para crear las tablas:

```bash
# Configura la base de datos.
npm run setup
```

### Despliegue de la aplicación

```bash
# Ejecución en modo desarrollo
npm run start

# Ejecución en modo desarrollo (live-reload)
npm run start:dev

# Ejecución en modo desarrollo (muestra logs de las consultas SQL)
npm run dev

# Ejecución en modo PRODUCCIÓN
npm run build
npm run start:prod

# Ejecución en modo PRODUCCIÓN (con proceso activo en segundo plano)
npm run build
pm2 start ecosystem.config.js
```

### Ejecución de pruebas unitarias y de integración

```bash
# Todas las pruebas
npm run test

# Pruebas e2e
npm run test:e2e

# Pruebas de cobertura
npm run test:cov
```

### Comandos útiles para el modo desarrollo

```bash
# Verifica la sintaxis
npm run lint

# Crea una nueva migración
npm run seeds:create database/seeds/addColumnCategoria

# Ejecuta las migraciones
npm run seeds:run
```

### Variables de entorno

**Configuración de la base de datos**

| Variable                 | Valor por defecto | Descripción                                                                             |
|--------------------------|-------------------|-----------------------------------------------------------------------------------------|
| `DB_HOST`                | `localhost`       | Host de la base de datos.                                                               |
| `DB_USERNAME`            | `postgres`        | nombre de usuario de la base de datos.                                                  |
| `DB_PASSWORD`            | `postgres`        | contraseña de la base de datos.                                                         |
| `DB_DATABASE`            | `database_db`     | nombre de la base de datos.                                                             |
| `DB_PORT`                | `5432`            | puerto de despliegue de la base de datos.                                               |
| `DB_SCHEMA`              | `proyecto`        | Para almacenar las tablas del proyecto, y todo lo relacionado con la lógica de negocio. |
| `DB_SCHEMA_USUARIOS`     | `usuarios`        | Para almacenar la tabla usuarios, roles y todo lo relacionado con la autenticación.     |
| `DB_SCHEMA_PARAMETRICAS` | `parametricas`    | Para almacenar tablas de tipo paramétricas.                                             |

