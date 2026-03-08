# Global Logistics Asset Tracker (GLAT)

Solución de la prueba técnica **Global Logistics Asset Tracker (GLAT) - L3 2026**.

## Descripción general

GLAT es una aplicación full stack para gestión y monitoreo de activos logísticos, desarrollada a partir de un enfoque **Spec-Driven Development**.

La solución permite:

- registrar activos logísticos
- consultar activos registrados
- registrar telemetría
- consultar el estado de salud de un activo
- autenticar usuarios con JWT
- consumir la API desde un frontend Angular
- calcular el `HealthScore` usando una librería nativa en ANSI C integrada con **P/Invoke**

---

## Stack utilizado

### Backend
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Swagger / OpenAPI
- JWT Authentication

### Frontend
- Angular
- Tailwind CSS

### Componente nativo
- ANSI C
- GCC
- P/Invoke

### Infraestructura
- Docker
- Docker Compose
- Linux containers

---

## Estructura del proyecto

```text
GLAT_PROJECT/
├── assets-api.yaml
├── docker-compose.yml
├── README.md
├── README.es.md
├── AI_STRATEGY.md
├── native/
│   ├── healthscore.c
│   ├── healthscore.h
│   └── libhealthscore.so
├── backend/
│   └── GLAT.Api/
│       ├── Controllers/
│       ├── Data/
│       ├── DTOs/
│       ├── Interop/
│       ├── Models/
│       ├── Migrations/
│       ├── Dockerfile
│       ├── Program.cs
│       ├── appsettings.json
│       └── GLAT.Api.csproj
└── frontend/
    └── glat-frontend/
```

---

## Contrato de la API

El contrato principal del sistema está definido en:

```text
assets-api.yaml
```

Este archivo define:

- autenticación
- endpoints de assets
- endpoints de telemetry
- endpoint de status
- esquemas de datos
- seguridad Bearer JWT

También fue utilizado para generar automáticamente el cliente Angular.

---

## Funcionalidades implementadas

### Backend
- `POST /auth/login`
- `GET /assets`
- `POST /assets`
- `GET /assets/{id}`
- `PUT /assets/{id}`
- `DELETE /assets/{id}`
- `GET /assets/{id}/status`
- `GET /telemetry`
- `POST /telemetry`
- `GET /telemetry/{assetId}`

### Frontend
- login con JWT
- guard de autenticación
- guard inverso para login
- listado de assets
- detalle de asset con `healthScore` y sensores
- creación de assets
- creación de telemetría

---

## Requisitos previos

Antes de ejecutar el proyecto, conviene tener instalado:

### Obligatorio
- Docker Desktop
- .NET 8 SDK
- Node.js
- npm
- Angular CLI

### Solo si quieres recompilar manualmente la librería nativa
- WSL o Linux
- GCC

---

## Credenciales de prueba

Para obtener JWT:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

---

## Cómo levantar el backend

## Paso 1: abrir una terminal en la raíz del proyecto

Debes pararte en la carpeta donde está `docker-compose.yml`.

Ejemplo:

```text
C:\Users\Esequiel\Desktop\GLAT_Project
```

## Paso 2: levantar contenedores

```bash
docker compose up --build
```

Esto levanta:

- SQL Server
- API ASP.NET Core

## URLs del backend

### Swagger
```text
http://localhost:8080/swagger
```

### API base
```text
http://localhost:8080
```

### SQL Server
```text
localhost:1433
```

---

## Cómo levantar el frontend

## Paso 1: abrir otra terminal

Pararse en:

```text
GLAT_PROJECT\frontend\glat-frontend
```

## Paso 2: instalar dependencias

```bash
npm install
```

## Paso 3: ejecutar Angular

```bash
ng serve
```

## URL del frontend

```text
http://localhost:4200
```

---

## Orden recomendado de levantamiento

Para evitar errores, seguir este orden:

### Terminal 1
Desde la raíz del proyecto:

```bash
docker compose up --build
```

### Terminal 2
Desde `frontend/glat-frontend`:

```bash
ng serve
```

---

## Flujo recomendado de validación

## 1. Validar backend desde Swagger

Abrir:

```text
http://localhost:8080/swagger
```

### Login
Usar `POST /auth/login` con:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Copiar el token devuelto.

### Authorize
Hacer clic en **Authorize** y pegar:

```text
Bearer TU_TOKEN
```

### Probar endpoints
- crear asset
- consultar assets
- crear telemetría
- consultar status

---

## 2. Validar frontend

Abrir:

```text
http://localhost:4200
```

### Flujo sugerido
1. iniciar sesión
2. visualizar listado de assets
3. entrar al detalle de un asset
4. crear un asset desde la UI
5. crear telemetría desde la UI
6. volver al detalle y validar el `HealthScore`

---

## Payloads de ejemplo

## Crear asset

```json
{
  "id": "truck-001",
  "name": "Truck 001",
  "type": "truck",
  "location": "Montevideo Warehouse",
  "latitude": -34.9011,
  "longitude": -56.1645
}
```

## Crear telemetría

```json
{
  "assetId": "truck-001",
  "timestamp": "2026-03-06T20:00:00Z",
  "temperature": 25,
  "batteryLevel": 15,
  "vibration": 0.9
}
```

---

## Librería nativa en ANSI C

El cálculo de `HealthScore` se realiza en:

```text
native/libhealthscore.so
```

Código fuente:

```text
native/healthscore.c
native/healthscore.h
```

El backend utiliza **P/Invoke** para llamar a esta función desde C#.

La integración se encuentra en:

```text
backend/GLAT.Api/Interop/HealthScoreNative.cs
```

El endpoint que utiliza este cálculo es:

```text
GET /assets/{id}/status
```

---

## Recompilar la librería nativa

Solo si se modifica `healthscore.c`.

Desde Linux/WSL, parado en la raíz del proyecto:

```bash
cd native
gcc -shared -fPIC -o libhealthscore.so healthscore.c
```

Luego reconstruir contenedores:

```bash
docker compose down
docker compose up --build
```

---

## Cliente frontend generado desde OpenAPI

El frontend utiliza un cliente generado automáticamente a partir de:

```text
assets-api.yaml
```

La generación se realizó con:

```bash
npx openapi-generator-cli generate -i ..\..\assets-api.yaml -g typescript-angular -o src\app\api-client
```

Ese cliente se integra a través de wrappers en:

```text
src/app/core/services
```

Esto permitió mantener el frontend alineado con el contrato OpenAPI.

---

## Migraciones y base de datos

Las migraciones de Entity Framework se encuentran en:

```text
backend/GLAT.Api/Migrations
```

Si fuera necesario ejecutar migraciones manualmente fuera del contenedor, desde:

```text
backend/GLAT.Api
```

puede ejecutarse:

```bash
dotnet ef database update
```

---

## Problemas comunes

## 1. CORS entre Angular y backend
El backend debe estar levantado y configurado para permitir el origen:

```text
http://localhost:4200
```

## 2. El login falla desde el frontend
Verificar:
- que Docker esté levantado
- que la API responda en `http://localhost:8080`
- que las credenciales sean `admin / admin123`

## 3. El frontend levanta pero no navega correctamente
Verificar:
- que Angular esté corriendo en `http://localhost:4200`
- que exista token en `localStorage`
- que el backend siga levantado

## 4. El backend no encuentra la librería C
Reconstruir contenedores con:

```bash
docker compose down
docker compose up --build
```

y verificar que exista:

```text
native/libhealthscore.so
```

---

## Notas para evaluación

La forma más simple de validar la solución es:

### Backend
```bash
docker compose up --build
```

### Frontend
```bash
cd frontend/glat-frontend
npm install
ng serve
```

### URLs
- Swagger: `http://localhost:8080/swagger`
- Frontend: `http://localhost:4200`

Se recomienda probar este flujo:

1. login
2. creación de asset
3. creación de telemetría
4. consulta de status
5. validación del flujo desde frontend

---

## Alcance actual

La solución implementa:

- contrato OpenAPI
- backend en .NET
- SQL Server en contenedor
- autenticación JWT
- componente nativo en ANSI C
- P/Invoke
- Docker Compose
- frontend Angular con Tailwind
- cliente frontend generado desde OpenAPI

---

## Archivos de documentación

- `README.md`
- `README.es.md`
- `AI_STRATEGY.md`

---

## Nota final

La solución fue organizada para que backend y base de datos se levanten con Docker, mientras que el frontend se ejecuta localmente con Angular. Para validar correctamente el proyecto conviene seguir los pasos indicados arriba en ese mismo orden.
