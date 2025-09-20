iExpress API

Descripción
La API iExpress es una plataforma de backend construido con Node.js, Express y PostgreSQL. Permite a los usuarios registrarse, iniciar sesión, seguir a otros usuarios, crear publicaciones y respuestas y buscar publicaciones. La autenticación se maneja mediante IDs de sesión, y la API está documentada con Swagger para facilitar la exploración y pruebas.

Características principales:
- Gestión de usuarios (registro, obtener información, eliminar usuario)
- Gestión de sesiones (inicio de sesión, cierre de sesión)
- Seguir/dejar de seguir usuarios
- Crear y obtener publicaciones y respuestas
- Buscar publicaciones por contenido
- Interfaz de Swagger para documentación interactiva de la API

Guía Rápida
Requerimientos
- Docker y Docker Compose instalados
- Node.js
- CMD o terminal para ejecutar comandos

Configuración
1. Clonar el repositorio:

   git clone https://github.com/OszyEng/iExpress-api
   cd iExpress-api

2. Instalar las dependencias:

   npm install

3. Crea un archivo `.env` en la carpeta del proyecto con lo siguiente:

   NODE_ENV=development
   PORT=3000
   DB_HOST=db
   DB_PORT=5432
   DB_NAME=iExpress-db
   DB_USER=usuario
   DB_PASSWORD=contraseña

4. Construye e inicia los contenedores de Docker:

   docker-compose up --build

   La API estará disponible en `http://localhost:3000`, y la interfaz de Swagger en `http://localhost:3000/api-docs`.

Detener la Aplicación
- Detener contenedores:

  docker-compose down

- Eliminar contenedores y volumen de base de datos (para reiniciar):

  docker-compose down -v

Uso
Acceso a la API
- URL Base: `http://localhost:3000`
- Interfaz de Swagger: `http://localhost:3000/api-docs`
- Autenticación: La mayoría de los endpoints requieren un encabezado `X-Session-ID` obtenido de `POST /session/login`.
