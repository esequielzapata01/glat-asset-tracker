# Global Logistics Asset Tracker (GLAT)

Solución de la prueba técnica **Global Logistics Asset Tracker (GLAT) - L3 2026**.

> **Importante**  
> Los pasos de este README están pensados para ejecutarse **literalmente**.  
> Para validar correctamente el proyecto, seguir el orden indicado y ejecutar cada comando **desde la carpeta especificada**.

---

## 1. Qué hace este proyecto

GLAT es una aplicación full stack para gestión y monitoreo de activos logísticos.

La solución permite:

- autenticarse con JWT
- registrar assets logísticos
- consultar assets registrados
- registrar telemetría
- consultar el estado de salud de un asset
- calcular el `HealthScore` usando una librería nativa en ANSI C integrada con **P/Invoke**
- operar el sistema desde un frontend Angular

---

## 2. Tecnologías utilizadas

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

## 3. Requisitos previos

Para correr el proyecto completo en una PC nueva, instalar lo siguiente:

### Obligatorio
- **Git**
- **Docker Desktop**
- **Node.js**
- **npm**
- **Angular CLI**
- **.NET 8 SDK**

### Opcional
Solo hace falta si se quiere regenerar el cliente OpenAPI:
- **Java**

Solo hace falta si se quiere recompilar manualmente la librería nativa:
- **WSL o Linux**
- **GCC**

---

## 4. Verificación rápida de herramientas instaladas

Después de instalar los prerequisitos, abrir una terminal y verificar:

```bash
git --version
docker --version
node -v
npm -v
ng version
dotnet --version
```

Si alguno de estos comandos falla, completar la instalación antes de seguir.

---

## 5. Cómo obtener el proyecto

## Paso 1: clonar el repositorio

Abrir una terminal y ejecutar:

```bash
git clone https://github.com/esequielzapata01/glat-asset-tracker.git
cd glat-asset-tracker
```

## Paso 2: confirmar que estás en la raíz del proyecto

En esta carpeta deben verse, entre otros, estos archivos y carpetas:

- `assets-api.yaml`
- `docker-compose.yml`
- `backend`
- `frontend`
- `native`

### Ejemplo de ruta en Windows
La ruta puede verse, por ejemplo, así:

```text
C:\Users\NombreUsuario\Desktop\glat-asset-tracker
```

> A partir de este punto, cuando el README diga **raíz del proyecto**, se refiere a esta carpeta.

---

## 6. Estructura principal del proyecto

```text
glat-asset-tracker/
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
│       ├── Migrations/
│       ├── Models/
│       ├── Dockerfile
│       ├── Program.cs
│       ├── appsettings.json
│       └── GLAT.Api.csproj
└── frontend/
    └── glat-frontend/
```

---

## 7. Contrato OpenAPI

El contrato principal del sistema está en:

```text
assets-api.yaml
```

Ese archivo define:

- autenticación
- endpoints de assets
- endpoints de telemetry
- endpoint de status
- esquemas de datos
- seguridad Bearer JWT

También se utilizó para generar automáticamente el cliente Angular.

---

## 8. Credenciales de prueba

Usar estas credenciales para autenticación JWT:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

---

## 9. Cómo levantar el backend

## IMPORTANTE
Todos los comandos de esta sección deben ejecutarse **desde la raíz del proyecto**, es decir, desde la carpeta donde está `docker-compose.yml`.

## Paso 1: abrir Docker Desktop y esperar a que esté completamente iniciado

Antes de ejecutar `docker compose up --build`, confirmar que:

- **Docker Desktop esté abierto**
- el motor esté funcionando correctamente
- Docker no muestre errores de virtualización ni de arranque

Como verificación rápida, puede ejecutarse:

```bash
docker version
```

Si este comando falla, no seguir hasta resolver Docker Desktop.

## Paso 2: levantar los contenedores

Desde la raíz del proyecto, ejecutar:

```bash
docker compose up --build
```

Este comando levanta:

- SQL Server
- API ASP.NET Core

> No cerrar esta terminal mientras se quiera usar el backend.

## Paso 3: validar que el backend haya levantado

Cuando el backend esté listo, abrir en el navegador:

```text
http://localhost:8080/swagger
```

Si Swagger abre correctamente, el backend está funcionando.

---

## 11. Cómo levantar el frontend

## IMPORTANTE
El frontend se levanta en una **segunda terminal**, distinta a la del backend.

## Paso 1: abrir una nueva terminal

## Paso 2: ir a la carpeta del frontend

Desde la raíz del proyecto, ejecutar:

```bash
cd frontend/glat-frontend
```

## Paso 3: instalar dependencias

```bash
npm install
```

## Paso 4: levantar Angular

```bash
ng serve
```

> No cerrar esta terminal mientras se quiera usar el frontend.

## Paso 5: validar que el frontend haya levantado

Abrir en el navegador:

```text
http://localhost:4200
```

---

## 12. Orden correcto de ejecución

Seguir este orden exacto:

### Terminal 1
Desde la raíz del proyecto:

```bash
docker compose up --build
```

### Terminal 2
Desde `frontend/glat-frontend`:

```bash
npm install
ng serve
```

### Navegador
Abrir:

- `http://localhost:8080/swagger`
- `http://localhost:4200`

---

## 13. Validación mínima recomendada

Para confirmar que el sistema funciona, se recomienda validar este flujo completo.

## Parte A: validar backend en Swagger

Abrir:

```text
http://localhost:8080/swagger
```

### 1. Obtener token
Usar `POST /auth/login` con este body:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Copiar el token devuelto.

### 2. Autorizar Swagger
Hacer clic en **Authorize** y pegar:

```text
Bearer TU_TOKEN
```

### 3. Crear un asset
Usar `POST /assets` con este body de ejemplo:

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

### 4. Registrar telemetría
Usar `POST /telemetry` con este body de ejemplo:

```json
{
  "assetId": "truck-001",
  "timestamp": "2026-03-06T20:00:00Z",
  "temperature": 25,
  "batteryLevel": 15,
  "vibration": 0.9
}
```

### 5. Consultar estado del asset
Usar:

```text
GET /assets/truck-001/status
```

Si esto responde correctamente, backend, base de datos, JWT y librería nativa están funcionando.

---

## Parte B: validar frontend

Abrir:

```text
http://localhost:4200
```

### Flujo sugerido
1. iniciar sesión con `admin / admin123`
2. visualizar listado de assets
3. entrar al detalle de un asset
4. crear un asset desde la UI
5. crear telemetría desde la UI
6. volver al detalle y validar el `HealthScore`

---

## 14. Payloads de ejemplo

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

## 15. Librería nativa en ANSI C

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

## 16. Recompilar la librería nativa

Este paso **no es necesario** para correr el proyecto normalmente.

Solo hace falta si se modifica `healthscore.c`.

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

## 17. Cliente frontend generado desde OpenAPI

El frontend utiliza un cliente generado automáticamente a partir de:

```text
assets-api.yaml
```

La generación se realizó con:

```bash
npx openapi-generator-cli generate -i ..\..\assets-api.yaml -g typescript-angular -o src\app\api-client
```

Ese cliente se integra mediante wrappers ubicados en:

```text
src/app/core/services
```

---

## 18. Migraciones y base de datos

Las migraciones de Entity Framework se encuentran en:

```text
backend/GLAT.Api/Migrations
```

Este paso **no es necesario** para correr el proyecto normalmente con Docker Compose.

Si se necesitara ejecutar migraciones manualmente fuera del contenedor, desde:

```text
backend/GLAT.Api
```

puede ejecutarse:

```bash
dotnet ef database update
```

---

## 19. Problemas comunes

## 1. Swagger no abre
Verificar:
- que Docker Desktop esté abierto
- que Docker Desktop haya iniciado correctamente
- que `docker compose up --build` se haya ejecutado desde la raíz del proyecto
- que la terminal del backend siga abierta

## 2. El login falla desde el frontend
Verificar:
- que el backend siga levantado
- que la API responda en `http://localhost:8080`
- que las credenciales sean `admin / admin123`

## 3. El frontend abre pero no navega correctamente
Verificar:
- que Angular esté corriendo en `http://localhost:4200`
- que exista token en `localStorage`
- que el backend siga levantado

## 4. Error relacionado a CORS
El backend debe estar levantado y configurado para permitir el origen:

```text
http://localhost:4200
```

## 5. El backend no encuentra la librería C
Reconstruir contenedores con:

```bash
docker compose down
docker compose up --build
```

y verificar que exista:

```text
native/libhealthscore.so
```

## 6. El cliente OpenAPI no se puede regenerar
Verificar:
- que Java esté instalado
- que `assets-api.yaml` sea válido
- que el comando se ejecute desde `frontend/glat-frontend`

---

## 20. Alcance actual

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

## 21. Archivos de documentación

En la raíz del proyecto se incluyen:

- `README.md`
- `README.es.md`
- `AI_STRATEGY.md`

---

## 22. Nota final

La solución fue organizada para que backend y base de datos se levanten con Docker, mientras que el frontend se ejecuta localmente con Angular.

Para validar correctamente el proyecto, seguir **exactamente** los pasos de este README, en el orden indicado.
