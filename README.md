# 🚀 PlannerOP - Sistema de Gestión de Operaciones

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="150" alt="Logo de PlannerOP" />
</p>

<p align="center">
  <b>Planificación inteligente de operaciones y gestión eficiente de personal</b>
</p>

<p align="center">
  <a href="#✨-características">Características</a> •
  <a href="#📋-descripción">Descripción</a> •
  <a href="#🛠️-instalación">Instalación</a> •
  <a href="#⚙️-configuración">Configuración</a> •
  <a href="#🔧-uso">Uso</a> •
  <a href="#📚-documentación">Documentación</a> •
  <a href="#💻-tecnologías">Tecnologías</a>
</p>

## 📋 Descripción

**PlannerOP** es un sistema de gestión diseñado específicamente para optimizar la planificación de operaciones y la asignación de trabajadores en entornos empresariales. 

Esta solución integral permite a las organizaciones:
- Organizar eficientemente sus operaciones diarias
- Asignar personal basado en disponibilidad y habilidades
- Monitorear en tiempo real el estado de cada operación
- Gestionar áreas de trabajo y equipos específicos

La aplicación está construida como una API robusta con NestJS que se integra fácilmente con diferentes interfaces de usuario y sistemas existentes.

## ✨ Características

<table>
  <tr>
    <td width="50%">
      <h3>🧑‍💼 Gestión de Trabajadores</h3>
      <ul>
        <li>Registro completo de personal</li>
        <li>Control de disponibilidad</li>
        <li>Asignación a departamentos</li>
        <li>Estados: Disponible, Asignado, Incapacitado</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📅 Planificación de Operaciones</h3>
      <ul>
        <li>Programación con fechas específicas</li>
        <li>Asignación de horarios de inicio y fin</li>
        <li>Definición de tareas y prioridades</li>
        <li>Estados: Pendiente, En Progreso, Completado</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📊 Seguimiento en Tiempo Real</h3>
      <ul>
        <li>Actualización automática de estados</li>
        <li>Notificaciones de cambios importantes</li>
        <li>Cronómetro de operaciones activas</li>
        <li>Historial de actividades</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🔒 Sistema de Seguridad</h3>
      <ul>
        <li>Autenticación mediante JWT</li>
        <li>Control de acceso por roles</li>
        <li>Protección de endpoints</li>
        <li>Invalidación de sesiones</li>
      </ul>
    </td>
  </tr>
</table>

## 🛠️ Instalación

```bash
# Clonar el repositorio
$ git clone https://github.com/KeniBeck/plannerOPBack.git

# Acceder al directorio del proyecto
$ cd plannerOPBack

# Instalar dependencias
$ npm install
```

## ⚙️ Configuración

### 1. Archivo de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/plannerop?schema=public"

# JWT
SECRET_JWT="tu_clave_secreta_aqui"
EXPIRES_IN="1d"

# Puerto de la aplicación
PORT=3000
```

### 2. Configuración de la base de datos

```bash
# Ejecutar migraciones de Prisma
$ npx prisma migrate dev

# Generar cliente Prisma
$ npx prisma generate
```

## 🔧 Uso

```bash
# Modo desarrollo
$ npm run start:dev

# Modo producción
$ npm run start:prod

# Compilar el proyecto
$ npm run build
```

## 📚 Documentación

### Documentación de la API

Una vez que el servidor esté en funcionamiento, puedes acceder a la documentación interactiva de la API en:

```
http://localhost:3000/api
```

### Generar documentación técnica

Para generar la documentación técnica del código:

```bash
# Generar documentación
$ npm run doc

# La documentación estará disponible en la carpeta /docs
```

## 📡 Endpoints principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/operations` | Obtener todas las operaciones |
| POST | `/api/operations` | Crear una nueva operación |
| GET | `/api/workers` | Obtener todos los trabajadores |
| POST | `/api/workers` | Registrar un nuevo trabajador |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/areas` | Obtener todas las áreas de trabajo |

## 💻 Tecnologías

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="50" alt="NestJS" title="NestJS" />
  <img src="https://cdn.worldvectorlogo.com/logos/prisma-2.svg" width="50" alt="Prisma" title="Prisma" />
  <img src="https://www.postgresql.org/media/img/about/press/elephant.png" width="50" alt="PostgreSQL" title="PostgreSQL" />
  <img src="https://jwt.io/img/pic_logo.svg" width="50" alt="JWT" title="JWT" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" width="50" alt="TypeScript" title="TypeScript" />
  <img src="https://static1.smartbear.co/swagger/media/assets/swagger_logo.svg" width="50" alt="Swagger" title="Swagger" />
</p>

- **NestJS**: Framework para construcción de aplicaciones eficientes y escalables
- **Prisma**: ORM moderno para interacción con bases de datos
- **PostgreSQL**: Sistema de gestión de base de datos relacional
- **JWT**: Sistema de autenticación basado en tokens
- **TypeScript**: Lenguaje de programación tipado
- **Swagger**: Documentación de API interactiva

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT.

## 📞 Contacto

Para preguntas o sugerencias, puedes contactar al equipo de desarrollo:

- Email: deyler456@gmail.com
- GitHub: [KeniBeck](https://github.com/KeniBeck/)

---

<p align="center">
  <b>Desarrollado con ❤️ por el Equipo PlannerOP</b>
</p>