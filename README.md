**Leer el archivo README.md**
================

¡Bienvenido a nuestra API REST construida con NestJS!

Esta API proporciona un conjunto de puntos finales para la gestión de usuarios, productos y pedidos. Está construida usando NestJS, un framework para construir aplicaciones Node.js eficientes y escalables del lado del servidor.

## Cómo empezar

Para empezar con la API, siga estos pasos:

1. Clona el repositorio: `git clone https://github.com/your-username/your-repo-name.git`
2. Instala las dependencias: `npm install`
3. Iniciar la API: `npm run start`.
4. Abre tu cliente de API favorito (por ejemplo, Postman, cURL) y empieza a hacer peticiones a `http://localhost:3000`.

## Puntos finales de la API

### Usuarios

* `GET /users`: Obtener una lista de todos los usuarios
* `GET /users/:id`: Recupera un único usuario por ID
* `POST /users`: Crear un nuevo usuario
* `PUT /users/:id`: Actualizar un usuario existente
* Eliminar /users/:id`: Borrar un usuario

### Productos

* `GET /products`: Obtener una lista de todos los productos
* `GET /products/:id`: Recuperar un solo producto por ID
* `POST /products`: Crear un nuevo producto
* `PUT /productos/:id`: Actualizar un producto existente
* Eliminar /productos/:id`: Borrar un producto

### Pedidos

* `GET /orders`: Obtener una lista de todos los pedidos
* `GET /orders/:id`: Recupera un único pedido por ID
* `POST /pedidos`: Crear un nuevo pedido
* `PUT /pedidos/:id`: Actualizar un pedido existente
* Eliminar /pedidos/:id`: Borrar un pedido

## Estructura

La API está estructurada de la siguiente manera:

* `src/`: El directorio raíz de la API
	+ `app/`: El módulo principal de la aplicación
		- `app.module.ts`: El módulo principal de la aplicación
		- `app.controller.ts`: El controlador principal de la aplicación
	+ `users/`: El módulo de usuarios
		- `users.module.ts`: El módulo de usuarios
		- `users.controller.ts`: El controlador de usuarios
		- `users.service.ts`: El servicio de usuarios
	+ `products/`: El módulo de productos
		- `products.module.ts`: El módulo de productos
		- `products.controller.ts`: El controlador de productos
		- `products.service.ts`: El servicio de productos
	+ `orders/`: El módulo de pedidos
		- `orders.module.ts`: El módulo de pedidos
		- `orders.controller.ts`: El controlador de pedidos
		- `orders.service.ts`: El servicio de pedidos
	+ `entities/`: El directorio de entidades
		- `user.entity.ts`: La entidad de usuario
		- `product.entity.ts`: La entidad producto
		- `order.entity.ts`: La entidad del pedido
	+ `dto/`: El directorio DTO
		- `user.dto.ts`: El usuario DTO
		- `product.dto.ts`: El DTO de producto
		- `order.dto.ts`: El DTO de pedido
