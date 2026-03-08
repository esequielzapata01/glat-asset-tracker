# AI_STRATEGY.md

## Descripción general

Para esta prueba técnica utilicé inteligencia artificial como apoyo durante distintas etapas del desarrollo, sobre todo para acelerar tareas de análisis, debugging, estructura inicial y documentación.

La IA no se usó como sustituto de validación técnica. Cada parte importante fue revisada y probada manualmente, tanto en Swagger como en Docker y en el frontend.

---

## Herramientas utilizadas

Durante el desarrollo utilicé principalmente:

- **ChatGPT**  
  Para revisar ideas, resolver bloqueos, corregir errores, proponer estructuras de código, ajustar el contrato OpenAPI, apoyar la integración entre capas y redactar documentación.

- **Swagger Editor / tooling de OpenAPI**  
  Para validar y revisar el archivo `assets-api.yaml`.

- **OpenAPI Generator CLI**  
  Para generar el cliente Angular a partir de `assets-api.yaml`.

---

## Cómo usé la IA en el proyecto

## 1. Contrato OpenAPI

La IA me ayudó a definir y refinar el archivo `assets-api.yaml`, que fue la base del proyecto.

Se utilizó para:
- proponer la estructura inicial de endpoints
- revisar requests y responses
- mejorar los esquemas de datos
- detectar inconsistencias en códigos HTTP y convenciones REST
- agregar `tags` para que el cliente Angular generado quedara separado por servicios

Esto ayudó a mantener un enfoque contract-first real, y después facilitó tanto el backend como el frontend.

---

## 2. Backend en .NET

En el backend la IA fue útil sobre todo para acelerar configuración y debugging.

Se utilizó para:
- orientar la creación de controllers
- configurar Swagger
- configurar JWT
- configurar CORS
- conectar Entity Framework Core con SQL Server
- resolver errores de compilación y de ejecución
- ajustar Docker y Docker Compose

También fue útil para entender errores concretos, por ejemplo:
- conflictos de rutas en Swagger
- problemas de conexión a SQL Server
- errores de `IDENTITY_INSERT`
- problemas de CORS entre Angular y la API

---

## 3. Componente nativo en ANSI C y P/Invoke

La IA también me ayudó bastante en la parte más específica de la prueba: la integración entre una librería en ANSI C y el backend en C#.

Se utilizó para:
- definir la función de cálculo del `HealthScore`
- estructurar `healthscore.c` y `healthscore.h`
- generar el wrapper C# con `DllImport`
- entender mejor el uso de P/Invoke
- resolver diferencias entre ejecución local y ejecución en Linux/Docker

La validación importante de esta parte se hizo manualmente. Para confirmar que el backend estaba llamando realmente a la librería C, se modificó temporalmente la función nativa para devolver un valor fijo y luego se verificó ese mismo valor en la respuesta de la API.

---

## 4. Frontend en Angular

En el frontend la IA se utilizó principalmente como apoyo para avanzar más rápido en la estructura y en la integración con el backend.

Se utilizó para:
- diseñar el flujo de login
- crear el interceptor JWT
- crear guards de autenticación
- armar la estructura de rutas
- construir las vistas principales
- resolver problemas de SSR y `localStorage`
- configurar Tailwind
- migrar de servicios escritos a mano hacia un cliente generado con OpenAPI

---

## 5. Cliente generado desde OpenAPI

Como la consigna pedía que el cliente del frontend fuera generado automáticamente desde `assets-api.yaml`, la IA también se utilizó para orientar ese proceso.

Se utilizó para:
- ajustar el YAML para mejorar la generación
- agregar `tags`
- regenerar el cliente Angular
- integrar progresivamente el cliente generado sin romper el frontend que ya estaba funcionando

El resultado final fue un frontend alineado con el contrato OpenAPI, lo cual reduce el riesgo de desajustes entre spec y código.

---

## 6. Documentación

La IA también fue utilizada para redactar borradores de:

- `README.md`
- `README.es.md`
- `AI_STRATEGY.md`

Después esos textos fueron revisados y ajustados manualmente para asegurar que reflejaran el estado real del proyecto.

---

## Prompt Log (ejemplos de prompts utilizados)

A continuación dejo ejemplos representativos del tipo de prompts utilizados durante el desarrollo.

### OpenAPI / especificación
- “Ayúdame a completar un archivo OpenAPI para assets, telemetry y status”
- “Revisa este YAML y dime qué le falta para cumplir mejor la letra”
- “Agrega tags al OpenAPI para que el generador cree servicios separados”

### Backend / .NET
- “Ayúdame a crear los endpoints para assets y telemetry”
- “Cómo configuro JWT en ASP.NET Core con Swagger”
- “Cómo habilito CORS para Angular en localhost:4200”
- “Cómo conecto SQL Server en Docker con Entity Framework Core”
- “Qué significa este error de Swagger o de EF Core”

### ANSI C / P/Invoke
- “Ayúdame a crear una librería en ANSI C para calcular un health score”
- “Cómo la llamo desde C# usando P/Invoke”
- “Por qué no encuentra la librería en Windows pero sí en Linux”

### Docker / infraestructura
- “Ayúdame a crear el Dockerfile de la API”
- “Cómo hago para montar la librería `.so` dentro del contenedor”
- “Qué significa este error de Docker al hacer build”

### Frontend / Angular
- “Ayúdame a crear un login en Angular conectado a JWT”
- “Cómo hago un auth guard y un guard inverso para login”
- “Ayúdame a crear la vista de detalle de asset”
- “Cómo migro mis servicios Angular a un cliente generado con OpenAPI”

### Documentación
- “Ayúdame a escribir el README del proyecto”
- “Ayúdame a redactar AI_STRATEGY de forma honesta y técnica”

---

## Ganancia de eficiencia

La IA aportó sobre todo en estas áreas:

- arranque más rápido del contrato OpenAPI
- generación de estructuras base de backend y frontend
- reducción del tiempo de debugging
- ayuda para destrabar errores complejos
- borradores iniciales de documentación

Mi impresión general es que el ahorro de tiempo fue importante en tareas de estructura, investigación y troubleshooting, pero la integración real y la validación final siguieron siendo manuales.

---

## Cómo validé la calidad del resultado

Todo lo asistido por IA fue validado manualmente.

Las validaciones más importantes fueron:

- pruebas de endpoints desde Swagger
- validación de respuestas HTTP
- pruebas de login JWT y endpoints protegidos
- validación de persistencia con SQL Server y Entity Framework
- ejecución del backend y la base de datos con Docker Compose
- validación de la librería ANSI C dentro del contenedor Linux
- validación del frontend completo:
  - login
  - listado de assets
  - detalle de asset
  - creación de asset
  - creación de telemetry

También se validó que:
- `GET /assets/{id}/status` respondiera según la telemetría registrada
- la librería C impactara realmente en el cálculo del `HealthScore`
- el frontend quedara conectado al cliente generado desde OpenAPI

---

## Reflexión final

La IA fue una herramienta útil para trabajar más rápido y con más contexto, sobre todo en momentos donde había que resolver configuración, integración o errores específicos.

Su aporte fue real, pero la calidad final del proyecto dependió de:
- revisión manual
- pruebas reales
- ajustes finos de integración
- validación end-to-end

En este proyecto la IA funcionó como asistente de desarrollo, no como reemplazo del criterio técnico ni de la verificación manual.
