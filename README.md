# PlannerOP - Sistema de Gestión de Operaciones

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="PlannerOP Logo" />
</p>

<p align="center">
  <a href="#características">Características</a> •
  <a href="#instalación">Instalación</a> •
  <a href="#configuración">Configuración</a> •
  <a href="#uso">Uso</a> •
  <a href="#documentación">Documentación</a> •
  <a href="#tecnologías">Tecnologías</a>
</p>

## Descripción

PlannerOP es un sistema de gestión para la planificación de operaciones y asignación de trabajadores. Diseñado específicamente para optimizar los flujos de trabajo en empresas con operaciones múltiples, permite la organización eficiente de tareas, la asignación inteligente de personal y el seguimiento en tiempo real de las actividades programadas.

La aplicación ofrece una API robusta construida con NestJS que facilita la integración con diferentes interfaces de usuario y sistemas externos.

## Características

- **Gestión de trabajadores**: Registro, actualización y seguimiento de la disponibilidad de personal.
- **Planificación de operaciones**: Creación y programación de operaciones con fechas y horas específicas.
- **Asignación inteligente**: Asignación de trabajadores a operaciones basada en disponibilidad y habilidades.
- **Seguimiento en tiempo real**: Actualización automática de estados (pendiente, en progreso, completado).
- **Panel de control**: Visualización del estado actual de todas las operaciones y trabajadores.
- **Gestión de áreas de trabajo**: Organización de operaciones por departamentos o áreas.
- **Sistema de autenticación**: Protección de endpoints mediante JWT.

## Instalación

```bash
# Clonar el repositorio
$ git clone https://github.com/KeniBeck/plannerOPBack.git

# Acceder al directorio del proyecto
$ cd plannerOPBack

# Instalar dependencias
$ npm install
```

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`:

```bash
# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/plannerop?schema=public"

# JWT
SECRET_JWT="tu_clave_secreta_aqui"
EXPIRES_IN="1d"

# Puerto de la aplicación
PORT=3000
```

2. Configura la base de datos:

```bash
# Ejecutar migraciones de Prisma
$ npx prisma migrate dev

# Generar cliente Prisma
$ npx prisma generate
```

## Uso

```bash
# Modo desarrollo
$ npm run start:dev

# Modo producción
$ npm run start:prod

# Compilar el proyecto
$ npm run build
```

## Endpoints principales

- `GET /api/operations`: Obtener todas las operaciones
- `POST /api/operations`: Crear una nueva operación
- `GET /api/workers`: Obtener todos los trabajadores
- `POST /api/workers`: Registrar un nuevo trabajador
- `POST /api/auth/login`: Iniciar sesión
- `GET /api/areas`: Obtener todas las áreas de trabajo

Para ver la documentación completa de los endpoints, visita `/api` cuando el servidor esté en ejecución.

## Documentación

La documentación completa de la API se puede encontrar en:

```bash
# Generar documentación
$ npm run doc

# La documentación estará disponible en la carpeta /docs
```

También puedes acceder a la documentación de Swagger en `/api` una vez que el servidor esté funcionando.

## Tecnologías

- **[NestJS](https://nestjs.com/)**: Framework para construcción de aplicaciones eficientes y escalables en servidor
- **[Prisma](https://prisma.io/)**: ORM para interacción con la base de datos
- **[PostgreSQL](https://www.postgresql.org/)**: Sistema de gestión de base de datos
- **[JWT](https://jwt.io/)**: Sistema de autenticación basado en tokens
- **[TypeScript](https://www.typescriptlang.org/)**: Lenguaje de programación tipado
- **[Swagger](https://swagger.io/)**: Documentación de API interactiva

## Contribución

Las contribuciones son bienvenidas. Por favor, lee las pautas de contribución antes de enviar pull requests.

## Licencia

Este proyecto está licenciado bajo MIT.

## Contacto

Para preguntas o sugerencias, puedes contactar al equipo de desarrollo:

- Email: deyler456@gmail.com
- GitHub: [KeniBeck](https://github.com/KeniBeck/)

---

<p align="center">
  Desarrollado con ❤️ por el Equipo PlannerOP
</p>

