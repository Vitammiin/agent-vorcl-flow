<div align="center">

# Agent-Vorcl-Flow

**Un equipo de subagentes de IA especializados para [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) y [Kimi CLI](https://github.com/MoonshotAI/kimi-cli), con habilidades, comandos y MCP herramientas.**
Un comando `npx` los instala. Sin backend remoto ni alojamiento en la nube: su agente de codificación ejecuta todo localmente.

![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-6C5CE7)
![GPT Codex](https://img.shields.io/badge/GPT%20Codex-adapter-1abc9c)
![Cursor](https://img.shields.io/badge/Cursor-native%20adapter-111111)
![Kimi CLI](https://img.shields.io/badge/Kimi%20CLI-adapter-000000)
![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)
![Agents](https://img.shields.io/badge/agents-25-blue)
![Commands](https://img.shields.io/badge/commands-155-blue)
![License](https://img.shields.io/badge/license-MIT-green)

<details>
<summary>🌐 <strong>Languages (22)</strong> — translations live in `translations/`</summary>

[English](../README.md) · [Русский](./README.ru.md) · [Українська](./README.uk.md) · [Deutsch](./README.de.md) · [Français](./README.fr.md) · [**Español**](./README.es.md)<br>
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 83d6d9acc986bc985e4ad946e5d40538d51bf4d6cafa9623e93e5244c4da8b5e. -->

</div>

---

## What is this?

Agent-Vorcl-Flow convierte a un agente de codificación compatible en un **equipo de ingeniería estructurado**. En lugar de un asistente general, obtienes **25 subagentes enfocados** (arquitecto, arquitecto principal basado en código, backend, frontend, Expo ingeniero móvil, ingeniero de diseño visual y de producto, DB ingeniero, auditor de integridad en varios idiomas, cartógrafo de arquitectura, operador de liveboard y más), cada uno con sus propias **habilidades** de dominio, **comandos de barra diagonal** rápidos y las **MCP herramientas** que necesita. Cada tarea no trivial se ejecuta a través de un ciclo disciplinado **Task Master** (*objetivo → tareas → implementar → verificar → hecho*) para que el trabajo se planifique, se realice un seguimiento y sobreviva a las interrupciones.

- 🧩 **25 subagentes**, 73 habilidades, 155 comandos de barra
- ⚡ **Instalación con un solo comando** para Claude Code, Codex, Cursor y/o Kimi CLI — `npx`
- 🔌 **11 MCP servidores** conectados (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, renderizado, sistema de archivos, Task Master, Mermaid)
- 🔑 **Un archivo `.env` para todos los tiempos de ejecución**: claves leídas por un iniciador, no por `~/.zshrc`, por lo que funcionan incluso desde inicios de GUI/IDE; sin servicio AVF remoto; liveboard es solo localhost y efímero
- 🤝 **Se ejecuta en Claude Code, GPT Codex, Cursor y Kimi CLI** de la misma fuente

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** y/o **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Apunte a un único tiempo de ejecución con una bandera:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Qué hace el instalador:

| Tiempo de ejecución | Acción |
| --- | --- |
| **Capa compartida** | Copia el iniciador en `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` y crea `~/.config/agent-vorcl-flow/.env` a partir de la plantilla (una vez): el archivo de clave único para cada tiempo de ejecución. |
| **Claude Code** | Registra este repositorio como un **mercado** de complementos y habilita el complemento (a través de `claude plugin …`, con un respaldo directo de `~/.claude/settings.json`). |
| **GPT Codex** | Fusiona las habilidades en `~/.agents/skills` y los bloques `config.toml` + `AGENTS.md` en `~/.codex` (idempotente, entre marcadores). |
| **Cursor** | Instala habilidades en `~/.cursor/skills`, subagentes personalizados nativos en `~/.cursor/agents` y fusiona los servidores que faltan en `~/.cursor/mcp.json`. |
| **Kimi CLI** | Instala habilidades en `~/.kimi/skills`, el agente personalizado nativo Expo en `~/.kimi/agents`, ambos Expo arquitectura/UI enlaces en `~/.kimi/config.toml` y fusiona MCP servidores. |

> El instalador nunca completa sus secretos: solo crea un `.env` vacío a partir de la plantilla. Allí agregas claves (ver [Configuration](#configuration-mcp--keys)).

### Update to the latest version

Ejecute el instalador nuevamente con la etiqueta npm `latest`:

```bash
npx --yes agent-vorcl-flow@latest
```

Para actualizar solo un tiempo de ejecución, mantenga el mismo indicador de tiempo de ejecución que utilizó durante la instalación:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

La actualización superpone habilidades, agentes, ganchos, iniciadores y bloques de configuración administrados por Agent-Vorcl-Flow. Mantiene su `~/.config/agent-vorcl-flow/.env` existente y sus secretos sin cambios, y preserva las habilidades Firecrawl anteriores. Reinicie el cliente de codificación actualizado luego (o ejecute `/reload-plugins` en Claude Code).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Después de la instalación, **reinicie Claude Code** (o ejecute `/reload-plugins` en una sesión abierta) para cargar los agentes.

---

## How to use

Los ejemplos de esta sección utilizan la sintaxis Claude Code; consulte las asignaciones [Cursor](#cursor) y [GPT Codex](#gpt-codex) a continuación para conocer su sintaxis nativa. En Claude Code hay **tres formas** de invocar al equipo.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` determina qué subagente debería ser el propietario del trabajo y conduce el ciclo Task Master completo. `/audit` detecta automáticamente backend, frontend, dispositivos móviles, datos e infraestructura y escribe un `PROJECT_AUDIT.md` basado en evidencia utilizando todos los roles relevantes. `/init-code` lee el repositorio estáticamente y crea un `PROJECT_DESCRIPTION.md` basado en evidencia sin ejecutar el código del proyecto. Una vez que ese archivo existe, cada función de modificación debe mantener sincronizadas las secciones afectadas; La deriva de descripción comprobada bloquea la finalización de la tarea.

### 2. Talk to a specific sub-agent
```text
@agent-vorcl-flow:architect  design billing for a SaaS
@agent-vorcl-flow:backend    add a POST /invoices endpoint
```

### 3. Run a specific slash command
```text
/backend:create-api   POST /invoices
/analyzer:audit       src/
/screenshot:convert   ./mockups/dashboard.png  react
```

Cada agente también tiene su propio punto de entrada `/<agent>:vorcl` que ejecuta el bucle Task Master con alcance para ese agente.

### The Task Master loop
Cada tarea no trivial fluye a través de **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```Esto mantiene el trabajo planificado, controlado y reanudable: nada se declara "hecho" sin pasar el paso de verificación.

---

## The agents| Agente | Rol | Aspectos destacados |
| --- | --- | --- |
| 🔵 **arquitecto** | Arquitecto de sistemas y soluciones | Análisis de requisitos, diseño de sistemas/DB/API, revisiones de arquitectura |
| 🏛️ **arquitecto-principal** | Software principal / infraestructura / arquitecto de IA | Escanea código real en 11 idiomas y crea MD, JSON, HTML, PDF, draw.io y Mermaid respaldados por evidencia; las actualizaciones de nuevo análisis completo conservan las anotaciones |
| 🟢 **backend** | Desarrollador backend | Nodo/TS, Postgres, Redis; arquitectura modular; todas las rutas totalmente cubiertas por OpenAPI |
| 🟣 **interfaz** | Interfaz (React 19 / Next.js Enrutador de aplicaciones) | Componentes, estado, obtención de datos, optimización de renderizado/paquete, pruebas |
| 📱 **expo-móvil** | React Native + Expo ingeniero | Arquitectura modular más sistema de diseño/movimiento/interacción, navegación nativa, tokens, gestos, hápticos, movimiento reducido |
| 🟠 **analizador** | Auditor de código (solo lectura) | Errores, seguridad de tipos, estructura DB, simulacros de frontend, olores de backend |
| 🧭 **integridad** | Auditor de integridad de código en varios idiomas (solo lectura) | Código rígido de producción y fuga de simulacros/falsos/demostraciones/accesorios en el frontend/backend/móvil/compartido |
| 🟡 **arrogancia** | OpenAPI/Swagger cobertura (cualquier pila) | Encuentra rutas no totalmente documentadas y las cubre, con verificación |
| 🔴 **firecrawl** | Investigador web | Live CLI/MCP/REST, integración de aplicaciones y flujos de trabajo de datos web terminados |
| 🟤 **renderizar** | Alojamiento e implementación (Renderizado) | Implementaciones, diagnósticos basados ​​en registros, métricas, variables de entorno, renderizado Postgres |
| 🟦 **base de datos** | DB ingeniero / DBA | Esquema, consultas y planes, índices, N+1, migraciones reversibles seguras, caché |
| ⚪ **resiliencia** | Fiabilidad: errores + registro | intentar/capturar en los límites correctos, errores escritos, reintentos/tiempos de espera, registros estructurados |
| 🖼️ **captura de pantalla** | Captura de pantalla UI → código | Convierte una captura de pantalla UI en código accesible, responsivo y listo para producción |
| 🎨 **estudio-de-diseño** | Estudio de diseño visual y de producto | Artefactos locales HTML, prototipos, wireframes, decks/PPTX, documentos, animación, 3D, sistemas de diseño e importación Figma/GitHub/HTML; adaptado del MIT |
| 🔎 **investigación-visual** | Captura de pantalla → respuesta verificada | Identifica el sitio/página, encuentra documentos oficiales, verifica datos en vivo y responde con URL y confianza |
| 🎯 **identificar** | Captura de pantalla → colocar en un proyecto existente (solo lectura) | Fundamenta una captura de pantalla de una aplicación en ejecución en el código base real: componente, `file:line`, ruta/página, el control exacto y la lógica detrás de él; no crea nada, delega la edición |
| 📊 **dibujo** | Diagramas (draw.io / diagramas.net) | Diagrama de flujo, BPMN, UML, ERD, red/nube y PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **arcomapa** | Cartógrafo de arquitectura | Código determinista → `architecture.json` (cada nodo con `source:{file,line}`) → mapa interactivo HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF; los hechos no probados están marcados `inferred` |
| 🧜 **sirena** | Mermaid diagramas (+ render real) | diagrama de flujo, secuencia, clase, estado, ER, gantt, gitGraph, mapa mental…; validado a través de mcp-mermaid/`mmdc`; te entrega el archivo (`.mmd` + SVG/PNG/PDF) |
| 🧪 **prueba** | Ingeniero de pruebas y verificación | Unidad (Vitest/Jest), integración (Supertest), E2E (Playwright), cobertura, búsqueda de pruebas inestables; ejecuta el `testStrategy` de cada tarea: no se "hace" nada sin una ejecución verde |
| 🌿 **gitflow** | Git flujo de trabajo y lanzamientos | Confirmaciones convencionales, confirmaciones por nombre (nunca `git add .`), PR, Keep-a-Changelog, lanzamientos semver; empujar sólo con confirmación explícita |
| 🛡️ **seguridad** | Auditor de seguridad (solo lectura) | Secretos en el historial de árbol y git, OWASP Top 10, CVE de dependencia, PII; los hallazgos se convierten en tareas: las correcciones se delegan || 📝 **docs** | Ingeniero de documentación | README (paridad multilingüe), API documentos de OpenAPI, ARQUITECTURA, CONTRIBUCIÓN, notas de la versión; cada ejemplo verificado con el código |
| 🐳 **devops** | Contenedores y CI/CD | Dockerfiles de varias etapas, docker-compose para desarrollo local, GitHub Canalizaciones de acciones, higiene de entorno/secretos, monitoreo |
| 📡 **liveboard** | Junta de operaciones locales | Vive Git árboles de trabajo, procesos de agentes y Task Master tareas en un panel de control localhost efímero |

**Algunas cosas que vale la pena saber:**
- **El frontend siempre habla con un API real.** La especificación OpenAPI del backend es la única fuente de verdad; Los tipos se generan a partir de él (`openapi-typescript` + `openapi-fetch`). No hay burlas en el camino de producción.
- **`database` las mutaciones requieren confirmación explícita.** Los análisis son de solo lectura; Los cambios de esquema/datos (DDL/DML/migraciones) nunca se ejecutan sin su visto bueno.
- **`resilience` incluye un gancho de seguridad.** Un gancho `PostToolUse` sin bloqueo (`catch-guard.js`) señala suavemente los bloques `catch {}` vacíos en los archivos que acaba de editar.
- **`archmap` nunca se basa en la imaginación.** La extracción y la representación están estrictamente separadas: los scripts de dependencia cero llevan el repositorio a `architecture.json` (bases de datos con cardinalidad FK real, rutas API, agentes de IA con sus modelos/herramientas/memoria, gráfico de importación, env), y cada diagrama se representa desde ese JSON únicamente. Todo lo que el LLM agregue sin un `file:line` verificable se marca con fuerza `inferred:true` y se dibuja con guiones.
- **`principal-architect` es el flujo de trabajo de publicación de arquitectura completo.** Funciona en cualquier repositorio que inicie el agente, ignora las afirmaciones de Markdown como evidencia de topología, utiliza el paquete Tree-sitter WASM sin conexión para TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin y Swift, escribe `ARCHITECTURE.md` primero, luego produce el modelo JSON compartido, HTML, PDF autónomo, draw.io nativo y copiable Mermaid L0–L4. `update` realiza una nueva exploración completa y conserva anotaciones y archivos no administrados.
- **`pinpoint` encuentra, nunca crea.** Dada una captura de pantalla de una aplicación en ejecución, asigna la pantalla al código real (componente, ruta, el control exacto y la lógica detrás de ella) y entrega la edición a `frontend`/`backend`. Funciona sobre lo que ya existe (lo inverso de `screenshot`).
- **`visual-research` verifica en lugar de adivinar.** Trata una captura de pantalla como evidencia, confirma el dominio y los documentos oficiales, verifica los datos actuales del sitio y señala posibles valores obsoletos o de phishing.
- **`i18n` aplica "codificación en idioma cero".** Los agentes primero detectan si un proyecto es multilingüe y se adaptan: las cadenas de cara al usuario pasan por una capa de traducción (next-intl / react-i18next / i18next), nunca en línea.

---

## Command referenceCada comando a continuación es un comando de barra diagonal. `<…>` marca tu entrada.

### `/vorcl` — universal router
| Comando | Qué hace |
| --- | --- |
| `/vorcl <goal>` | Convierte cualquier objetivo en tareas y lo dirige al subagente correcto, luego ejecuta el ciclo completo para finalizar. |
| `/audit [path] [focus]` | Auditoría profunda de funciones múltiples de solo lectura → sistemas detectados, hallazgos de seguridad/CVE/resiliencia, arquitectura de destino y fases `PROJECT_AUDIT.md`. |
| `/init-code [path] [--update]` | Descubrimiento de base de código estático → basado en evidencia `PROJECT_DESCRIPTION.md`; El código del proyecto nunca se ejecuta. |

### 🔵 architect — architecture
| Comando | Qué hace |
| --- | --- |
| `/architect:vorcl <goal>` | Objetivo → tareas → ciclo, con alcance a la arquitectura. |
| `/architect:analyze <context>` | Analizar los requisitos y el contexto de la tarea. |
| `/architect:design <problem>` | Diseñar la arquitectura de la solución (sistema, DB, API). |
| `/architect:review <target>` | Revisar una arquitectura existente. |

### 🏛️ principal-architect — code-grounded architecture package
| Comando | Qué hace |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Ejecuta un objetivo de arquitectura grande a través de Task Master y artefactos verificados. |
| `/principal-architect:create [options]` | Escanea el repositorio actual y crea MD, JSON, HTML, PDF, draw.io y Mermaid a partir de evidencia de código. |
| `/principal-architect:update [options]` | Vuelve a escanear por completo un paquete existente, escribe una diferencia de evidencia y actualiza atómicamente los artefactos generados. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| Comando | Qué hace |
| --- | --- |
| `/backend:vorcl <goal>` | Objetivo → tareas → ciclo para el trabajo backend. |
| `/backend:create-api <endpoint>` | Genere un punto final API en la arquitectura modular, completamente cubierto por OpenAPI. |
| `/backend:refactor <target>` | Refactorizar código sin cambiar el comportamiento. |
| `/backend:optimize <target>` | Optimización del rendimiento. |
| `/backend:test <target>` | Generar pruebas para el código. |

### 🟣 frontend — React / Next.js
| Comando | Qué hace |
| --- | --- |
| `/frontend:vorcl <goal>` | Objetivo → tareas → ciclo para el trabajo frontend. |
| `/frontend:create-component <spec>` | Genere un componente UI siguiendo la estructura de características. |
| `/frontend:refactor <target>` | Refactorizar UI/enganches sin cambiar el comportamiento. |
| `/frontend:optimize <target>` | Optimice el renderizado/paquete/Core Web Vitals. |
| `/frontend:test <target>` | Generar pruebas de componentes. |

### 📱 expo-mobile — React Native / Expo

| Comando | Qué hace |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Meta → Task Master ciclo para Expo trabajo móvil. |
| `/expo-mobile:create-module <domain>` | Cree una porción de negocio modular con solo las capas que su complejidad necesita. |
| `/expo-mobile:create-screen <flow>` | Cree una ruta delgada Expo Router más una pantalla y estados propiedad del módulo. |
| `/expo-mobile:design-screen <flow>` | Cree una pantalla premium con tokens de diseño/movimiento, estados y accesibilidad compartidos. |
| `/expo-mobile:motion <interaction>` | Diseñe navegación nativa, resortes, gestos, hápticos y respaldos de movimiento reducido. |
| `/expo-mobile:add-api <contract>` | Agregue esquema/DTO/mapper/claves de consulta e integración TanStack Query. |
| `/expo-mobile:audit [scope]` | Protección de arquitectura de solo lectura y auditoría basada en evidencia. |
| `/expo-mobile:ui-audit [scope]` | Sistema de diseño de sólo lectura, movimiento, interacción, accesibilidad y auditoría de rendimiento. |
| `/expo-mobile:compatibility [app] [change]` | Auditoría de compatibilidad en vivo de solo lectura Expo/RN/Nodo/paquete/nativo en tiempo de ejecución contra fuentes oficiales versionadas. |
| `/expo-mobile:test <scope>` | Ejecute la unidad de dominio, React Native Biblioteca de pruebas y Maestro comprobaciones. |

### 🟠 analyzer — code audit (read-only)
| Comando | Qué hace |
| --- | --- |
| `/analyzer:vorcl <goal>` | Audite un objetivo mediante Task Master: los hallazgos se convierten en tareas. |
| `/analyzer:audit` | Auditoría completa: errores, tipos, DB, simulacros de frontend, olores de backend. |
| `/analyzer:bugs` | Busque errores: errores no controlados, condiciones de carrera, casos extremos. |
| `/analyzer:types` | Verificación de tipo: `tsc`, `any`, lanzamientos inseguros, deriva de tipos zod↔. |
| `/analyzer:db` | Auditoría DB estructura: esquema, índices, FK, N+1, migraciones. |
| `/analyzer:mocks` | Ruta de compatibilidad para datos simulados/falsos en el frontend y el backend; delega comprobaciones políglotas profundas a la integridad. |
| `/analyzer:backend` | Encuentre código backend "incorrecto": violaciones de arquitectura, lógica en los controladores. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)| Comando | Qué hace |
| --- | --- |
| `/integrity:vorcl <goal>` | Ejecuta un objetivo de integridad no trivial a través de Task Master y convierte los hallazgos en tareas específicas del propietario. |
| `/integrity:audit [path]` | Escanea el código físico y las fugas simuladas juntas y luego demuestra la accesibilidad de la producción. |
| `/integrity:hardcode [path]` | Encuentra literales de usuario/configuración/negocio que omiten la localización, la configuración o el sistema de registro. |
| `/integrity:mocks [path]` | Encuentra marcos simulados, generadores falsos, accesorios, datos de demostración y respuestas estáticas accesibles desde producción. |

El escáner de dependencia cero incluido es compatible con TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML y Razor. En el código backend también marca valores comerciales ocultos en constantes, campos estáticos/finales, parámetros predeterminados, argumentos con nombre y catálogos estáticos; Luego, el auditor los compara con esquemas/modelos/repositorios/consultas/mutaciones de administrador para demostrar que la base de datos, no el código ni la configuración, posee el valor. Las pruebas, accesorios, historias, ejemplos, semillas, código generado y raíces de proveedores se suprimen de forma predeterminada; Los candidatos léxicos no son defectos hasta que se demuestre su accesibilidad y propiedad.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| Comando | Qué hace |
| --- | --- |
| `/swagger:vorcl <goal>` | Objetivo de cobertura total a través de Task Master: auditoría → tareas → cubrir → verificar. |
| `/swagger:audit` | Solo lectura: busque rutas que no estén totalmente cubiertas por la especificación. |
| `/swagger:cover <route>` | Cubrir una ruta/módulo: parámetros, respuestas, descripciones, seguridad + verificación. |

### 🔴 firecrawl — web research
| Comando | Qué hace |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Objetivo de la investigación a través de Task Master: recopilar datos web para obtener un resultado final. |
| `/firecrawl:search <query>` | Búsqueda web de fuentes sobre una pregunta. |
| `/firecrawl:scrape <url>` | Extraiga una URL en Markdown/JSON. |
| `/firecrawl:map <url>` | Mapear las URL de un sitio. |
| `/firecrawl:crawl <url>` | Rastrear recursivamente una sección/sitio. |
| `/firecrawl:extract <url>` | Extracción estructurada mediante un esquema JSON. |
| `/firecrawl:setup` | Instalar/verificar CLI además de habilidades oficiales de compilación y flujo de trabajo (con confirmación). |
| `/firecrawl:interact <url>` | Haga clic, navegue o complete formularios cuando el raspado sea insuficiente. |
| `/firecrawl:parse <file>` | Analizar un documento local/privado en markdown o JSON. |
| `/firecrawl:monitor <action>` | Enumere las comprobaciones o administre los monitores de cambio de página recurrentes. |
| `/firecrawl:agent <goal>` | Ejecute una tarea limitada del Agente Firecrawl de larga duración. |
| `/firecrawl:research <query>` | Búsqueda de artículos y GitHub contexto de investigación. |
| `/firecrawl:ask <jobId>` | Diagnosticar un trabajo Firecrawl fallido. |
| `/firecrawl:docs-search <question>` | Busque documentación oficial actual Firecrawl. |
| `/firecrawl:integrate <feature>` | Agregue Firecrawl al código de la aplicación mediante habilidades de compilación ascendentes. |
| `/firecrawl:deliverable <artifact>` | Produzca un resumen, una auditoría, una lista de clientes potenciales u otro artefacto del flujo de trabajo. |`/firecrawl:setup` ejecuta el flujo oficial de `firecrawl-cli init --all` solo después de la confirmación. Las habilidades oficiales existentes de `firecrawl-*` tienen prioridad y las conserva el instalador de Codex/Cursor; AVF proporciona alternativas compatibles para las habilidades faltantes. Las operaciones en vivo se dirigen a través de CLI → MCP → REST/sin llave.

### 🟤 render — hosting / deploy (Render)
| Comando | Qué hace |
| --- | --- |
| `/render:vorcl <goal>` | Objetivo de infraestructura a través de Task Master: implementar/diagnosticar/configurar para finalizar. |
| `/render:deploy <service>` | Implementar/volver a implementar un servicio. |
| `/render:logs <service>` | Registros de servicio y diagnósticos hasta la causa raíz. |
| `/render:status <service>` | Estado del servicio + implementación + métricas. |
| `/render:query <sql>` | SQL de solo lectura contra Render Postgres. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| Comando | Qué hace |
| --- | --- |
| `/database:vorcl <goal>` | Objetivo de datos a través de Task Master: esquema/consultas/migraciones/caché para finalizar. |
| `/database:query <query>` | Consulta/análisis de solo lectura. |
| `/database:schema <target>` | Diseño/revisión de esquema e integridad de datos. |
| `/database:migrate <change>` | Planifique una migración de datos/esquema segura y reversible. |
| `/database:optimize <target>` | Optimizar: índices, N+1, planes de consulta, paginación. |
| `/database:cache <target>` | Redis — TTL, invalidación, bloqueos, limitación de velocidad, Streams. |

### ⚪ resilience — error handling + logging
| Comando | Qué hace |
| --- | --- |
| `/resilience:vorcl <goal>` | Objetivo de confiabilidad a través de Task Master: código de cobertura con registros try/catch +. |
| `/resilience:harden <target>` | Envuelva el código en try/catch/finally con un registro sólido, sin fallas silenciosas. |
| `/resilience:logging <target>` | Agregar/arreglar registros estructurados: niveles, contexto, sin secretos/PII. |
| `/resilience:audit` | Solo lectura: encuentre fallas silenciosas, capturas vacías y espacios en el registro. |

### 🪵 logging — Pino structured logging
| Command | What it does |
| --- | --- |
| `/logging:vorcl <goal>` | Logging goal via Task Master — cover or update the Pino package. |
| `/logging:audit [path]` | Read-only: one root logger, child context, redact, no console/Loki sink. |
| `/logging:cover <target>` | Create `infrastructure/logging` and cover a module/worker/route. |
| `/logging:update <target>` | Bring legacy `pino()`/`console.log` to the canonical package. |


### 🖼️ screenshot — screenshot UI → code
| Comando | Qué hace |
| --- | --- |
| `/screenshot:vorcl <goal>` | Un conjunto de pantallas a partir de capturas de pantalla a través de Task Master — desglose → código. |
| `/screenshot:analyze <image>` | Desglose de solo lectura: diseño, componentes, tokens, estados → plan. |
| `/screenshot:convert <image> [framework]` | Genere código ejecutable completo a partir de una captura de pantalla (predeterminado React + Tailwind v4). |
| `/screenshot:tokens <image>` | Extraiga tokens de diseño (colores OKLCH, tipografía, espaciado) en Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Haga que el UI generado responda: puntos de interrupción, fluidos, `clamp()`, consultas de contenedor. |

### 🎨 design-studio — product and visual design
| Comando | Qué hace |
| --- | --- |
| `/design-studio:vorcl <goal>` | Objetivo de diseño completo a través de Task Master — contexto → variantes → HTML → vista previa → verificación → exportación. |
| `/design-studio:create <brief>` | Cree un elegante artefacto visual autónomo o equipo de alta fidelidad UI. |
| `/design-studio:prototype <flow>` | Cree un prototipo web/móvil interactivo con estados y transiciones. |
| `/design-studio:wireframe <flow>` | Cree una estructura alámbrica de baja fidelidad centrada en la arquitectura de la información y la UX. |
| `/design-studio:design-system <operation>` | Cree, importe, compile, vincule, actualice o verifique un sistema de diseño. |
| `/design-studio:import <type> <source>` | Importe Figma `.fig`, GitHub o HTML/CSS con procedencia. |
| `/design-studio:deck <brief>` | Cree una plataforma HTML con notas del orador, animaciones y PPTX editable opcional. |
| `/design-studio:document <brief>` | Cree un documento, currículum vitae, memorando, hoja de una página o informe listo para imprimir. |
| `/design-studio:animation <brief>` | Cree un artefacto de movimiento y, opcionalmente, renderícelo en MP4. |
| `/design-studio:research <question>` | Cree un artefacto de investigación visual respaldado por fuentes. |
| `/design-studio:export <project> <format>` | Exporte a formato independiente HTML, PDF, PPTX, MP4 o de transferencia. |
| `/design-studio:review <target>` | Revisión visual, UX, responsiva, a11y y del sistema de diseño de solo lectura. |

### 🔎 visual-research — screenshot → verified web answer
| Comando | Qué hace |
| --- | --- |
| `/visual-research:vorcl <goal>` | Investigación de capturas de pantalla de varios pasos a través de Task Master. |
| `/visual-research:identify <image>` | Identifique el sitio, la página y la característica con evidencia confiable. |
| `/visual-research:search <image> <target>` | Encuentre la página real o la documentación oficial a partir de pistas visuales. |
| `/visual-research:answer <image> <question>` | Responda utilizando evidencia de capturas de pantalla, documentos oficiales y datos actuales en vivo. |
| `/visual-research:hints <image> <goal>` | Proporcione pasos seguros y respaldados por documentación para la interfaz visible. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| Comando | Qué hace |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Encuentre/comprenda/cambie UI existente desde una captura de pantalla a través de Task Master – mapa → tareas → delegar. |
| `/pinpoint:locate <image>` | Localice los componentes/archivos existentes en una captura de pantalla: `file:line`, sin código nuevo. |
| `/pinpoint:route <image>` | Identifique la ruta/página en la que se encuentra la pantalla (Next.js App/Pages Router, React Router). |
| `/pinpoint:control <image>` | Identifique el control exacto (botón/campo) y su controlador en el código. |
| `/pinpoint:trace <target>` | Rastree la lógica detrás de un elemento: controlador → estado → obtención de datos → API. || `/pinpoint:handoff <change>` | Cree una solicitud de edición precisa con el código existente y deléguela en `frontend`/`backend`. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| Comando | Qué hace |
| --- | --- |
| `/drawio:vorcl <goal>` | Un conjunto de diagramas a través de Task Master: desde la compilación hasta el final. |
| `/drawio:create <description> [type]` | Cree un diagrama a partir de una descripción de texto (XML nativo válido). |
| `/drawio:pmp <type> <project>` | Cree un diagrama PMP/PMBOK: WBS, PERT/CPM, Gantt, RACI, matriz de riesgos, cuadrícula de partes interesadas. |
| `/drawio:convert <source> [type]` | Convierta una fuente en un diagrama: DB esquema → ERD, carpetas → árbol, código → UML, sirena/CSV/JSON. |
| `/drawio:refine <file>` | Refinar un `.drawio` existente: diseño, tema, agregar/eliminar nodos, alinear con la cuadrícula. |

### 🗺️ archmap — architecture map from code| Comando | Qué hace |
| --- | --- |
| `/archmap:vorcl <goal>` | Un objetivo de mapeo a través de Task Master: construir en un conjunto de artefactos verificado. |
| `/archmap:map [repo]` | Canal completo: extracción → `architecture.json` → anotación LLM → todos los formatos (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Solo extracción: legible por máquina `architecture.json` con `source:{file,line}` en cada nodo. |
| `/archmap:annotate [json]` | Enriquecimiento LLM de un `architecture.json` existente (memoria del agente, semántica del flujo de datos); hechos no probados degradados automáticamente a `inferred`. |
| `/archmap:html [json]` | Mapa HTML interactivo y autónomo: alternancia de capas, trazar vigas, nodo → `file:line` panel, búsqueda, imprimir CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (varias páginas: Descripción general / ERD / API / Agentes) y/o Mermaid vistas, validadas. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| Comando | Qué hace |
| --- | --- |
| `/mermaid:vorcl <goal>` | Un conjunto de diagramas a través de Task Master: desde la compilación hasta el final (verificado por renderizado). |
| `/mermaid:create <description> [type]` | Cree un diagrama a partir de una descripción: sintaxis válida, verificada mediante una representación real; te entrega el archivo. |
| `/mermaid:convert <source> [type]` | Convierta una fuente a Mermaid — DB esquema → ER, código → clase/secuencia, carpetas → diagrama de flujo, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Sintaxis + prueba de renderizado real; buscar y corregir errores (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Exportar a SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Refinar un `.mmd` existente: dirección, subgrafo, definición de clase/estilos, legibilidad. |

### 🧪 testing — tests & verification
| Comando | Qué hace |
| --- | --- |
| `/testing:vorcl <goal>` | Un objetivo de prueba/verificación a través de Task Master — unidad + integración + e2e para terminar. |
| `/testing:unit <file\|module>` | Pruebas unitarias (Vitest/Jest): camino feliz, límites, errores; los ejecuta y muestra el resultado. |
| `/testing:integration <endpoint\|module>` | Pruebas de integración (Supertest/inject, real DB o testcontainers). |
| `/testing:e2e <scenario>` | Playwright E2E para una ruta de usuario crítica: selectores de roles, accesorios, seguimiento en caso de falla. |
| `/testing:verify <task\|testStrategy>` | Ejecuta `testStrategy` de una tarea y devuelve un veredicto LISTO/NO LISTO con resultados reales. |
| `/testing:coverage [path]` | Informe de cobertura con hallazgos: qué código crítico no se ha probado; crea tareas. |
| `/testing:flaky <test>` | Diagnostica una prueba inestable (carrera, cronometraje, estado compartido, simulacros) y la soluciona definitivamente. |

### 🌿 gitflow — git workflow & releases
| Comando | Qué hace |
| --- | --- |
| `/gitflow:vorcl <goal>` | Un objetivo de git/release a través de Task Master (preparar un lanzamiento, limpiar historial, rama de funciones). |
| `/gitflow:commit <files\|scope>` | Una confirmación por nombre (nunca `git add .`) con un mensaje de confirmación convencional; se detiene en WIP desconocido. |
| `/gitflow:pr <base> <title>` | Rama → confirma → solicitud de extracción (gh / GitHub MCP) con qué/por qué/cómo-verificado. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Mantener un registro de cambios) generado a partir de confirmaciones entre etiquetas. |
| `/gitflow:release <version\|auto>` | Semver de confirmaciones → versiones de manifiesto de sincronización → etiqueta → GitHub lanzamiento. Empuje solo después de una confirmación explícita. |
| `/gitflow:audit [branch]` | Auditoría del historial de solo lectura: violaciones de convenciones, confirmaciones de volcado, grandes blobs, ramas huérfanas. |

### 🛡️ security — security audit (read-only)
| Comando | Qué hace |
| --- | --- |
| `/security:vorcl <goal>` | Un objetivo de seguridad a través de Task Master: auditoría → hallazgos → tareas → correcciones delegadas. |
| `/security:secrets [path\|branch]` | Secretos en el árbol de trabajo Y el historial de git (todas las ramas); `${VAR:-}` los marcadores de posición no son secretos. |
| `/security:owasp [path]` | OWASP Top 10 en el código: inyecciones, XSS, autenticación, exposición de datos, CORS/cookies, con archivo: prueba de línea. |
| `/security:deps` | CVE de dependencia a través de npm auditoría/archivos de bloqueo: gravedad, indicadores de cambios importantes. |
| `/security:pii [path]` | Riesgos de PII/GDPR: correos electrónicos, teléfonos, tarjetas en código y registros; rutas privadas del desarrollador. |
| `/security:pre-push [branch]` | Comprobación combinada rápida de archivos modificados antes de un envío: secretos + inyecciones + PII; veredicto verde/rojo. |

### 📝 docs — documentation
| Comando | Qué hace |
| --- | --- |
| `/docs:vorcl <goal>` | Un objetivo de documentación a través de Task Master. |
| `/docs:readme [path]` | Crear/actualizar README: what/quickstart/usage/config/troubleshooting; ejemplos verificados; Versiones de idiomas sincronizadas. |
| `/docs:api [spec]` | API documentos generados a partir de la OpenAPI especificación (puntos finales, parámetros, ejemplos de curl); sugiere `/swagger:audit` si no hay especificaciones. |
| `/docs:architecture` | ARCHITECTURE.md — módulos, límites, flujo de datos; diagramas delegados a `mermaid`/`drawio`. || `/docs:contributing` | CONTRIBUTING.md: configuración, estructura, pruebas, convenciones de confirmación (alineadas con `gitflow`), proceso de relaciones públicas. |
| `/docs:release-notes <version>` | Notas de la versión para una versión de CHANGELOG/history. |
| `/docs:audit` | Documentos de solo lectura↔verificación de deriva de código: enlaces rotos, ejemplos/contadores obsoletos, traducciones no sincronizadas. |

### 🐳 devops — containers & CI/CD
| Comando | Qué hace |
| --- | --- |
| `/devops:vorcl <goal>` | Un objetivo de infraestructura a través de Task Master. |
| `/devops:dockerfile [app-type]` | Escriba/revise un Dockerfile: de varias etapas, de base delgada, sin raíz, HEALTHCHECK; verificado por un `docker build` real. |
| `/devops:compose` | docker-compose.yml para desarrollo local (aplicación + bases de datos); Los cambios de entorno necesitan `--force-recreate`, espera saludable. |
| `/devops:ci [type]` | GitHub Acciones: flujo de trabajo de relaciones públicas (lint+typecheck+test, npm caché), flujo de trabajo de implementación, permisos mínimos. |
| `/devops:env` | Inventario de variables ambientales: dónde leer, qué se requiere, `.env.example` plantilla; Secretos nunca en imágenes. |
| `/devops:monitoring` | Registros estructurados (pino/JSON), punto final de salud, sobre qué alertar; Representa métricas a través del agente `render`. |

### 📡 liveboard — ephemeral local operations board
| Comando | Qué hace |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Inicie un panel de control pulido en 43 idiomas en un puerto de host local gratuito; Task Master los cambios se transmiten a través de SSE y se concilian cada 5 minutos. |
| `/liveboard:vorcl <goal>` | Desarrolle o cambie el liveboard mediante el flujo de trabajo Task Master requerido. |

Liveboard lee Git árboles de trabajo, procesos locales Claude/Codex/Cursor y el `.taskmaster/tasks/tasks.json` de cada árbol de trabajo. El estado de ejecución permanece en la memoria y desaparece cuando se detiene el proceso en primer plano. El UI detecta el idioma del navegador y ofrece 43 idiomas, incluidos inglés, ruso, ucraniano, alemán, francés, español, portugués, italiano, polaco, turco, chino, japonés, árabe, holandés, checo, eslovaco, rumano, húngaro, búlgaro, serbio, croata, esloveno, griego, hebreo, persa, hindi, bengalí, urdu, indonesio, malayo, vietnamita, tailandés, coreano, sueco, noruego, danés, finlandés, estonio, letón, lituano, georgiano. Armenio y azerbaiyano. El árabe, el hebreo, el persa y el urdu utilizan el diseño RTL.

Configuración directa:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: proyecto cuyos Git árboles de trabajo y Task Master archivos se escanean.
- `--port 0`: selecciona automáticamente un puerto libre.
- `--interval`: intervalo de conciliación completo en milisegundos; La visualización de archivos aún se transmite Task Master cambia inmediatamente.
- Puntos finales: `/health`, `/api/snapshot`, `/api/events` (SSE) y `POST /api/refresh`.
- Mantenga `--host 127.0.0.1` a menos que tenga la intención explícita de exponer información del proyecto a la red.

---

## Configuration (MCP & keys)

El paquete **no tiene backend ni base de datos remota**. El liveboard opcional es un proceso en memoria exclusivo del host local. MCP los servidores necesitan tokens y **cada usuario proporciona los suyos**. Para que esto funcione de manera idéntica en **Claude Code, Codex, Cursor y Kimi CLI**, y ya sea que inicie desde una terminal o desde Dock/Spotlight/un IDE, cada servidor stdio MCP se inicia a través de un pequeño iniciador (`bin/mcp-env.mjs`) que lee sus claves desde **un archivo**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

El instalador lo crea desde [`.env.example`](../.env.example). Ábrelo y completa solo las claves que utilizas:

```dotenv
ANTHROPIC_API_KEY=      # Task Master main provider: Claude
OPENAI_API_KEY=         # alternative main provider: GPT
PERPLEXITY_API_KEY=     # optional: Task Master research mode
FIRECRAWL_API_KEY=      # firecrawl web research
GITHUB_TOKEN=           # github MCP

# For the `database` agent — these point at YOUR project's DB, not the plugin's:
MONGODB_URI=            # mongodb://user:pass@host:27017/db
REDIS_URL=              # redis://host:6379
POSTGRES_URL=           # postgres://user:pass@host:5432/db
```

> **¿Por qué un iniciador en lugar de `~/.zshrc`?** La expansión de Env-var difiere según el tiempo de ejecución (`${VAR:-}` en Claude, `${env:VAR}` en Cursor, literales en Codex/Kimi) y cada tiempo de ejecución lee solo el entorno en el que **se inició. Los lanzamientos de GUI/IDE en macOS no generan `~/.zshrc`, por lo que las claves exportadas son invisibles y los servidores no se conectan a nada: el clásico error "MCP env not set". La lectura de un archivo `.env` elimina ambos problemas a la vez.

**Precedencia** (luego gana): el `~/.config/agent-vorcl-flow/.env` compartido → un `./.env` en la raíz del proyecto → un `export` real en su shell. Mantenga las claves globales en el archivo compartido, anule por proyecto (por ejemplo, un `MONGODB_URI` diferente) con un proyecto `.env` y una exportación de shell genuina seguirá ganando para CLI ejecuciones. Puede apuntar el iniciador a un archivo diferente con `AGENT_VORCL_ENV_FILE=/path/.env`.Un servidor al que le falta la clave requerida simplemente **no se inicia**; verá una línea `[agent-vorcl-flow] MCP «…» is not configured: …` en el registro MCP del tiempo de ejecución y todos los demás servidores seguirán funcionando. Agregue la clave a `.env` y reinicie. (Puede conservar `GITHUB_TOKEN`/`MONGODB_URI` nombres; el iniciador los asigna a los `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` que esperan los servidores).

> ⚠️ **Requerido para Task Master comandos con tecnología de IA:** configure al menos un proveedor seleccionado: `ANTHROPIC_API_KEY` para Claude, `OPENAI_API_KEY` para GPT o Codex CLI OAuth. Sin credenciales para el modelo seleccionado en `.taskmaster/config.json`, `/vorcl` no puede generar ni expandir tareas.

Elija qué proveedor Task Master realmente ejecuta la generación; Las teclas por sí solas no seleccionan el modelo:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

El comando utiliza el flujo oficial de `task-master models` y almacena solo la selección de modelo en `.taskmaster/config.json`. `PERPLEXITY_API_KEY` es opcional y solo es necesario cuando se selecciona Perplejidad como modelo de investigación.

Los servidores remotos **vercel** y **render** usan OAuth (autoriza con `/mcp` en un navegador). Para renderizar sin cabeza/CI, configure `RENDER_API_KEY` en su entorno y agregue una entrada de encabezado Portador a ese servidor para su tiempo de ejecución.

---

## Verify the install

```bash
claude plugin validate . --strict      # validate the manifest and components
/plugin details agent-vorcl-flow       # list the loaded agents / skills / commands
@agent-vorcl-flow:architect            # the sub-agent appears in the typeahead
/architect:analyze billing for a SaaS  # run a slash command

# Cursor: open a new Agent window after installation
/vorcl add a shopping cart to checkout
/backend-create-api POST /invoices
```

---

## GPT Codex

El repositorio ahora incluye un manifiesto de complemento Codex nativo en `.codex-plugin/plugin.json`. El instalador npm permanece disponible e instala las mismas capacidades que **habilidades**, **perfiles** y un enrutador `AGENTS.md` para Codex CLI, Cursor y Kimi:

| Claude Code | Codex equivalente |
| --- | --- |
| subagente `@agent-vorcl-flow:frontend` | habilidad persona `$frontend` + `codex --profile frontend` |
| comando `/analyzer:audit` | habilidad de tarea `$analyzer-audit` |
| comando `/vorcl` | habilidad de tarea `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` en `config.toml` |
| `SessionStart` gancho | enrutamiento de roles en `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Consulte [`codex/README.md`](../codex/README.md) para ver el mapeo completo.

---

## Cursor

Cursor utiliza el mismo formato abierto `SKILL.md` que el adaptador Codex, además de subagentes personalizados nativos y configuración MCP global:

| Agent-Vorcl-Flow concepto | Cursor equivalente |
| --- | --- |
| rol `backend` | subagente personalizado `/avf-backend` en `~/.cursor/agents` |
| comando de tarea `/backend:create-api` | habilidad `/backend-create-api` |
| universales `/vorcl` | habilidad `/vorcl` |
| `.mcp.json` | servidores fusionados en `~/.cursor/mcp.json` |

El instalador convierte las definiciones de funciones a Cursor frontmatter, antepone a los subagentes `avf-` para evitar colisiones entre nombres de habilidades, utiliza `model: inherit` y marca los agentes de solo auditoría como `readonly: true`. Se conservan las MCP entradas del servidor existentes con los mismos nombres. Ver [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) carga de forma nativa Agent Skills, archivos de agente personalizados y enlaces de ciclo de vida; AVF también fusiona los mismos MCP servidores utilizados por Claude y Cursor:

| Agent-Vorcl-Flow concepto | Kimi CLI equivalente |
| --- | --- |
| habilidades/comandos de tarea | `~/.kimi/skills` y `/skill:<name>` |
| Expo agente de aduanas | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse guardia | fusionado en `~/.kimi/config.toml` |
| `.mcp.json` | servidores fusionados en `~/.kimi/mcp.json` |
| archivo de claves por tiempo de ejecución | el `~/.config/agent-vorcl-flow/.env` compartido (a través del lanzador) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI no tiene expansión `${VAR}` en `mcp.json`, por lo que las claves provienen del `.env` compartido a través del iniciador, exactamente como los otros tiempos de ejecución. Ver [`kimi/README.md`](../kimi/README.md).

---

## Project structure

```text
.claude-plugin/plugin.json      # plugin manifest
.claude-plugin/marketplace.json # local marketplace (for install)
agents/       26 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (78 skills; some ship references, scripts, tests or HTML assets)
commands/     <namespace>/<command>.md    (154 commands, /namespace:command, including /vorcl and /audit)
hooks/        hooks.json + SessionStart + PostToolUse guards (empty catch, Pino logging, Expo architecture/UI boundaries)
.mcp.json     github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master, mermaid
.env.example  template for ~/.config/agent-vorcl-flow/.env (single key file for all runtimes)
translations/ localized README files (21 translations)
bin/          install.mjs (the npx installer) + mcp-env.mjs (cross-runtime MCP launcher / .env loader)
codex/        GPT Codex adapter (skills + config.toml + install.sh)
cursor/       Cursor adapter (MCP template + installation notes)
kimi/         Kimi CLI adapter (skills install + Expo agent/hook + MCP)
```

**Cómo encaja:** `agents/*.md` declara un rol y, al frente `skills:`, adjunta habilidades → las habilidades en `skills/*/SKILL.md` se cargan automáticamente por descripción → `commands/<agent>/*.md` proporciona `/agent:command` atajos rápidos que delegan al subagente → `.mcp.json` les brinda a los agentes sus herramientas, cada una iniciada a través de `bin/mcp-env.mjs` que carga secretos del `.env` compartido. Un gancho `SessionStart` indica Claude que los agentes están disponibles.

---

## License

MIT: uso, copia, modificación y distribución gratuitos; se proporciona "tal cual", sin garantía ni responsabilidad. Ver [LICENSE](../LICENSE).

© 2026 Christian Avis (Vorcl).
