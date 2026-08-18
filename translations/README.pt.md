<div align="center">

# Agent-Vorcl-Flow

**Uma equipe de subagentes de IA especializados para [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) e [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — com habilidades, comandos e ferramentas MCP.**
Um comando `npx` os instala. Sem back-end remoto ou hospedagem na nuvem: seu agente de codificação executa tudo localmente.

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

[English](../README.md) · [Русский](./README.ru.md) · [Українська](./README.uk.md) · [Deutsch](./README.de.md) · [Français](./README.fr.md) · [Español](./README.es.md)<br>
[**Português**](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 3321a7089b3f749787125626da692c98b8a2d556b237e1ba36bbf67afc34dc3d. -->

</div>

---

## What is this?

Agent-Vorcl-Flow transforma um agente de codificação suportado em uma **equipe de engenharia estruturada**. Em vez de um assistente geral, você recebe **25 subagentes focados** (arquiteto, arquiteto principal baseado em código, back-end, front-end, Expo engenheiro móvel, engenheiro de design visual e de produto, DB engenheiro, auditor de integridade entre idiomas, cartógrafo de arquitetura, operador de liveboard e muito mais), cada um com suas próprias **habilidades** de domínio, **comandos de barra** rápidos e as **MCP ferramentas** necessárias. Cada tarefa não trivial passa por um ciclo **Task Master** disciplinado — *objetivo → tarefas → implementar → verificar → concluído* — para que o trabalho seja planejado, rastreado e sobreviva a interrupções.

- 🧩 **25 subagentes**, 73 habilidades, 155 comandos de barra
- ⚡ **Instalação com um comando** para Claude Code, Codex, Cursor e/ou Kimi CLI — `npx`
- 🔌 **11 MCP servidores** conectados (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Renderização, sistema de arquivos, Task Master, Mermaid)
- 🔑 **Um arquivo `.env` para todos os tempos de execução** — chaves lidas por um inicializador, não `~/.zshrc`, para que funcionem mesmo em inicialização de GUI/IDE; nenhum serviço AVF remoto; liveboard é apenas localhost e efêmero
- 🤝 **Funciona em Claude Code, GPT Codex, Cursor e Kimi CLI** da mesma fonte

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** e/ou **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Direcione um único ambiente de execução com um sinalizador:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

O que o instalador faz:

| Tempo de execução | Ação |
| --- | --- |
| **Camada compartilhada** | Copia o inicializador para `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` e cria `~/.config/agent-vorcl-flow/.env` a partir do modelo (uma vez) — o arquivo de chave único para cada tempo de execução. |
| **Claude Code** | Registra este repositório como um plugin **marketplace** e habilita o plugin (via `claude plugin …`, com um fallback `~/.claude/settings.json` direto). |
| **GPT Codex** | Mescla as habilidades em `~/.agents/skills` e os blocos `config.toml` + `AGENTS.md` em `~/.codex` (idempotente, entre marcadores). |
| **Cursor** | Instala habilidades em `~/.cursor/skills`, subagentes personalizados nativos em `~/.cursor/agents` e mescla servidores ausentes em `~/.cursor/mcp.json`. |
| **Kimi CLI** | Instala habilidades em `~/.kimi/skills`, o agente personalizado Expo nativo em `~/.kimi/agents`, ambos Expo arquitetura/UI conecta-se em `~/.kimi/config.toml` e mescla servidores MCP. |

> O instalador nunca preenche seus segredos — ele apenas cria um `.env` vazio a partir do modelo. Você adiciona chaves lá (veja [Configuration](#configuration-mcp--keys)).

### Update to the latest version

Execute o instalador novamente com a tag npm `latest`:

```bash
npx --yes agent-vorcl-flow@latest
```

Para atualizar apenas um tempo de execução, mantenha o mesmo sinalizador de tempo de execução usado durante a instalação:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

A atualização sobrepõe habilidades, agentes, ganchos, inicializadores e blocos de configuração gerenciados por Agent-Vorcl-Flow. Ele mantém seu `~/.config/agent-vorcl-flow/.env` existente e seus segredos inalterados e preserva as habilidades Firecrawl anteriores. Reinicie o cliente de codificação atualizado posteriormente (ou execute `/reload-plugins` em Claude Code).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Após a instalação, **reinicie Claude Code** (ou execute `/reload-plugins` em uma sessão aberta) para carregar os agentes.

---

## How to use

Os exemplos nesta seção usam a sintaxe Claude Code; veja os mapeamentos [Cursor](#cursor) e [GPT Codex](#gpt-codex) abaixo para ver sua sintaxe nativa. Em Claude Code existem **três maneiras** de invocar a equipe.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` descobre qual subagente deve ser o proprietário do trabalho e conduz o ciclo Task Master completo. `/audit` detecta automaticamente backend, frontend, dispositivos móveis, dados e infraestrutura e escreve um `PROJECT_AUDIT.md` baseado em evidências usando todas as funções relevantes. `/init-code` lê o repositório estaticamente e cria um `PROJECT_DESCRIPTION.md` baseado em evidências sem executar o código do projeto. Uma vez que esse arquivo exista, cada função modificadora deverá manter suas seções afetadas sincronizadas; O desvio de descrição comprovado bloqueia a conclusão da tarefa.

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

Cada agente também tem seu próprio ponto de entrada `/<agent>:vorcl` que executa o loop Task Master com escopo definido para esse agente.

### The Task Master loop
Toda tarefa não trivial flui através de **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```Isso mantém o trabalho planejado, verificado e retomável — nada é declarado “feito” sem passar pela etapa de verificação.

---

## The agents| Agente | Função | Destaques |
| --- | --- | --- |
| 🔵 **arquiteto** | Arquiteto de sistemas e soluções | Análise de requisitos, design de sistema/DB/API, revisões de arquitetura |
| 🏛️ **arquiteto-chefe** | Principal software / infraestrutura / arquiteto de IA | Verifica código real em 11 idiomas e cria MD, JSON, HTML, PDF, draw.io e Mermaid com base em evidências; atualizações de nova verificação completa preservam anotações |
| 🟢 **back-end** | Desenvolvedor back-end | Nó/TS, Postgres, Redis; arquitetura modular; todas as rotas totalmente cobertas por OpenAPI |
| 🟣 **front-end** | Frontend (React 19 / Next.js App Router) | Componentes, estado, busca de dados, otimização de renderização/pacote, testes |
| 📱 **expo-móvel** | React Native + Expo engenheiro | Arquitetura modular mais sistema de design/movimento/interação, navegação nativa, tokens, gestos, sensação ao toque, movimento reduzido |
| 🟠 **analisador** | Auditor de código (somente leitura) | Bugs, segurança de tipo, estrutura DB, simulações de frontend, cheiros de backend |
| 🧭 **integridade** | Auditor de integridade de código entre idiomas (somente leitura) | Código rígido de produção e vazamento de mock/fake/demo/fixture em frontend/backend/mobile/shared |
| 🟡 **arrogância** | Cobertura OpenAPI/Swagger (qualquer pilha) | Encontra rotas não totalmente documentadas e as cobre, com verificação |
| 🔴 **fogo** | Pesquisador da Web | Live CLI/MCP/REST, integração de aplicativos e fluxos de trabalho de dados da web finalizados |
| 🟤 **renderizar** | Hospedagem e implantação (Renderização) | Implantações, diagnóstico baseado em log, métricas, env vars, Render Postgres |
| 🟦 **banco de dados** | DB engenheiro / DBA | Esquema, consultas e planos, índices, N+1, migrações reversíveis seguras, cache |
| ⚪ **resiliência** | Confiabilidade: erros + registro | try/catch nos limites corretos, erros de digitação, novas tentativas/tempos limite, logs estruturados |
| 🖼️ **captura de tela** | Captura de tela UI → código | Transforma uma captura de tela UI em código pronto para produção, responsivo e acessível |
| 🎨 **estúdio de design** | Estúdio de design visual e de produto | Artefatos HTML locais, protótipos, wireframes, decks/PPTX, documentos, animação, 3D, sistemas de design e importação Figma/GitHub/HTML; adaptado do MIT |
| 🔎 **pesquisa visual** | Captura de tela → resposta verificada | Identifica o site/página, encontra documentos oficiais, verifica dados ao vivo e respostas com URLs e confiança |
| 🎯 **identificar** | Captura de tela → colocar em um projeto existente (somente leitura) | Baseia uma captura de tela do aplicativo em execução na base de código real — componente, `file:line`, rota/página, o controle exato e a lógica por trás dele; não cria nada, delega a edição |
| 📊 **sorteio** | Diagramas (draw.io / diagrams.net) | Fluxograma, BPMN, UML, ERD, rede/nuvem e PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **arquimapa** | Cartógrafo de arquitetura | Código determinístico → `architecture.json` (cada nó com `source:{file,line}`) → mapa HTML interativo, draw.io, Mermaid, ARCHITECTURE.md, PDF; fatos não comprovados são marcados como `inferred` |
| 🧜 **sereia** | Mermaid diagramas (+ renderização real) | fluxograma, sequência, classe, estado, ER, gantt, gitGraph, mapa mental…; validado via mcp-sereia/`mmdc`; entrega o arquivo (`.mmd` + SVG/PNG/PDF) |
| 🧪 **testes** | Engenheiro de teste e verificação | Unidade (Vitest/Jest), integração (Supertest), E2E (Playwright), cobertura, caça a testes esquisitos; executa o `testStrategy` de cada tarefa — nada é "feito" sem uma execução verde |
| 🌿 **gitflow** | Git fluxo de trabalho e lançamentos | Commits convencionais, commits por nome (nunca `git add .`), PRs, Keep-a-Changelog, lançamentos semver; push apenas com confirmação explícita |
| 🛡️ **segurança** | Auditor de segurança (somente leitura) | Segredos na história da árvore e do git, OWASP Top 10, CVEs de dependência, PII; descobertas tornam-se tarefas – as correções são delegadas || 📝 **documentos** | Engenheiro de documentação | README (paridade multilíngue), API documentos de OpenAPI, ARCHITECTURE, CONTRIBUTING, notas de lançamento; cada exemplo verificado em relação ao código |
| 🐳 **devops** | Recipientes & CI/CD | Dockerfiles de vários estágios, docker-compose para desenvolvimento local, GitHub Pipelines de ações, higiene de ambientes/segredos, monitoramento |
| 📡 **quadro ao vivo** | Conselho de operações locais | Árvores de trabalho Git, processos de agentes e tarefas Task Master ativas em um painel localhost efêmero |

**Algumas coisas que vale a pena saber:**
- **O frontend sempre fala com um API real.** A especificação OpenAPI do backend é a única fonte da verdade; tipos são gerados a partir dele (`openapi-typescript` + `openapi-fetch`). Não há simulações no caminho de produção.
- **`database` mutações requerem confirmação explícita.** As análises são somente leitura; alterações de esquema/dados (DDL/DML/migrações) nunca são executadas sem sua autorização.
- **`resilience` vem com um gancho de segurança.** Um gancho `PostToolUse` sem bloqueio (`catch-guard.js`) sinaliza suavemente blocos `catch {}` vazios nos arquivos que você acabou de editar.
- **`archmap` nunca se baseia na imaginação.** A extração e a renderização são estritamente separadas: scripts de dependência zero levam o repositório para `architecture.json` (bancos de dados com cardinalidade FK real, rotas API, agentes de IA com seus modelos/ferramentas/memória, gráfico de importação, ambiente) e cada diagrama é renderizado apenas a partir desse JSON. Qualquer coisa que o LLM adicione sem um `file:line` verificável é marcado à força como `inferred:true` e desenhado tracejado.
- **`principal-architect` é o fluxo de trabalho completo de publicação de arquitetura.** Ele funciona em qualquer repositório que inicia o agente, ignora declarações de Markdown como evidência de topologia, usa WASM Tree-sitter off-line agrupado para TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin e Swift, escreve `ARCHITECTURE.md` primeiro e depois produz o modelo JSON compartilhado, autocontido HTML, PDF, draw.io nativo e Mermaid copiável L0–L4. `update` executa uma nova verificação completa e preserva anotações e arquivos não gerenciados.
- **`pinpoint` encontra, nunca cria.** Dada uma captura de tela de um aplicativo em execução, ele mapeia a tela para o código real — componente, rota, o controle exato e a lógica por trás dele — e entrega a edição para `frontend`/`backend`. Funciona sobre o que já existe (o inverso de `screenshot`).
- **`visual-research` verifica em vez de adivinhar.** Ele trata uma captura de tela como evidência, confirma o domínio e os documentos oficiais, verifica os dados atuais do site e sinaliza possíveis valores de phishing ou obsoletos.
- **`i18n` impõe "codificação de idioma zero."** Os agentes primeiro detectam se um projeto é multilíngue e se adaptam — as strings voltadas para o usuário passam por uma camada de tradução (next-intl / react-i18next / i18next), nunca inline.

---

## Command referenceCada comando abaixo é um comando de barra. `<…>` marca sua entrada.

### `/vorcl` — universal router
| Comando | O que faz |
| --- | --- |
| `/vorcl <goal>` | Transforma qualquer meta em tarefas e a encaminha para o subagente certo e, em seguida, executa o ciclo completo até a conclusão. |
| `/audit [path] [focus]` | Auditoria multifuncional somente leitura profunda → sistemas detectados, descobertas de segurança/CVE/resiliência, arquitetura de destino e fases `PROJECT_AUDIT.md`. |
| `/init-code [path] [--update]` | Descoberta de base de código estática → `PROJECT_DESCRIPTION.md` baseada em evidências; o código do projeto nunca é executado. |

### 🔵 architect — architecture
| Comando | O que faz |
| --- | --- |
| `/architect:vorcl <goal>` | Objetivo → tarefas → ciclo, no escopo da arquitetura. |
| `/architect:analyze <context>` | Analise os requisitos e o contexto da tarefa. |
| `/architect:design <problem>` | Projete a arquitetura da solução (sistema, DB, API). |
| `/architect:review <target>` | Revise uma arquitetura existente. |

### 🏛️ principal-architect — code-grounded architecture package
| Comando | O que faz |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Executa um grande objetivo de arquitetura por meio de Task Master e artefatos verificados. |
| `/principal-architect:create [options]` | Verifica o repositório atual e cria MD, JSON, HTML, PDF, draw.io e Mermaid a partir de evidências de código. |
| `/principal-architect:update [options]` | Faz uma nova varredura completa de um pacote existente, grava uma comparação de evidências e atualiza atomicamente os artefatos gerados. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| Comando | O que faz |
| --- | --- |
| `/backend:vorcl <goal>` | Meta → tarefas → ciclo para trabalho de back-end. |
| `/backend:create-api <endpoint>` | Gere um endpoint API na arquitetura modular, totalmente coberto por OpenAPI. |
| `/backend:refactor <target>` | Refatore o código sem alterar o comportamento. |
| `/backend:optimize <target>` | Otimização de desempenho. |
| `/backend:test <target>` | Gere testes para o código. |

### 🟣 frontend — React / Next.js
| Comando | O que faz |
| --- | --- |
| `/frontend:vorcl <goal>` | Meta → tarefas → ciclo para trabalho de frontend. |
| `/frontend:create-component <spec>` | Gere um componente UI seguindo a estrutura de recursos. |
| `/frontend:refactor <target>` | Refatore UI / hooks sem alterar o comportamento. |
| `/frontend:optimize <target>` | Otimize renderização/pacote/Core Web Vitals. |
| `/frontend:test <target>` | Gere testes de componentes. |

### 📱 expo-mobile — React Native / Expo

| Comando | O que faz |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Objetivo → Task Master ciclo para Expo trabalho móvel. |
| `/expo-mobile:create-module <domain>` | Crie uma fatia de negócios modular com apenas as camadas de que sua complexidade necessita. |
| `/expo-mobile:create-screen <flow>` | Crie uma rota Expo Router fina mais uma tela e estados de propriedade do módulo. |
| `/expo-mobile:design-screen <flow>` | Crie uma tela premium com tokens de design/movimento, estados e acessibilidade compartilhados. |
| `/expo-mobile:motion <interaction>` | Projete navegação nativa, molas, gestos, sensação tátil e substitutos de movimento reduzido. |
| `/expo-mobile:add-api <contract>` | Adicione chaves de esquema/DTO/mapper/query e integração TanStack Query. |
| `/expo-mobile:audit [scope]` | Proteção de arquitetura somente leitura e auditoria baseada em evidências. |
| `/expo-mobile:ui-audit [scope]` | Sistema de design somente leitura, movimento, interação, acessibilidade e auditoria de desempenho. |
| `/expo-mobile:compatibility [app] [change]` | Auditoria de compatibilidade Expo/RN/Node/package/native-runtime somente leitura em tempo real contra fontes oficiais versionadas. |
| `/expo-mobile:test <scope>` | Execute a unidade de domínio, React Native Biblioteca de testes e Maestro verificações. |

### 🟠 analyzer — code audit (read-only)
| Comando | O que faz |
| --- | --- |
| `/analyzer:vorcl <goal>` | Audite uma meta via Task Master — as descobertas se tornam tarefas. |
| `/analyzer:audit` | Auditoria completa: bugs, tipos, DB, simulações de frontend, cheiros de backend. |
| `/analyzer:bugs` | Procure bugs – erros não tratados, condições de corrida, casos extremos. |
| `/analyzer:types` | Verificação de tipo — `tsc`, `any`, lançamentos inseguros, desvio de zod↔types. |
| `/analyzer:db` | Estrutura de auditoria DB — esquema, índices, FKs, N+1, migrações. |
| `/analyzer:mocks` | Rota de compatibilidade para dados simulados/falsos no frontend e backend; delega verificações poliglotas profundas à integridade. |
| `/analyzer:backend` | Encontre código de back-end “ruim” – violações de arquitetura, lógica em controladores. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)| Comando | O que faz |
| --- | --- |
| `/integrity:vorcl <goal>` | Executa um objetivo de integridade não trivial por meio de Task Master e transforma as descobertas em tarefas específicas do proprietário. |
| `/integrity:audit [path]` | Verifica o código rígido e o vazamento simulado juntos e, em seguida, comprova a acessibilidade da produção. |
| `/integrity:hardcode [path]` | Encontra literais de usuário/configuração/negócios que ignoram a localização, a configuração ou o sistema de registro. |
| `/integrity:mocks [path]` | Encontra estruturas simuladas, geradores falsos, acessórios, dados de demonstração e respostas estáticas acessíveis na produção. |

O scanner de dependência zero incluído oferece suporte a TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML e Razor. No código de back-end, ele também sinaliza valores de negócios ocultos em constantes, campos estáticos/finais, parâmetros padrão, argumentos nomeados e catálogos estáticos; o auditor então os compara com esquemas/modelos/repositórios/consultas/mutações administrativas para provar que o banco de dados – e não o código ou a configuração – possui o valor. Testes, fixtures, histórias, exemplos, sementes, código gerado e raízes de fornecedores são suprimidos por padrão; candidatos lexicais não são defeitos até que a acessibilidade e a propriedade sejam comprovadas.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| Comando | O que faz |
| --- | --- |
| `/swagger:vorcl <goal>` | Meta de cobertura total via Task Master — auditoria → tarefas → cobertura → verificação. |
| `/swagger:audit` | Somente leitura: encontre rotas não totalmente cobertas pelas especificações. |
| `/swagger:cover <route>` | Cubra uma rota/módulo — parâmetros, respostas, descrições, segurança + verificação. |

### 🔴 firecrawl — web research
| Comando | O que faz |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Objetivo de pesquisa via Task Master — coletar dados da web para obter um resultado final. |
| `/firecrawl:search <query>` | Pesquisa na Web por fontes sobre uma questão. |
| `/firecrawl:scrape <url>` | Raspe um URL em markdown/JSON. |
| `/firecrawl:map <url>` | Mapeie os URLs de um site. |
| `/firecrawl:crawl <url>` | Rastrear recursivamente uma seção/site. |
| `/firecrawl:extract <url>` | Extração estruturada por um esquema JSON. |
| `/firecrawl:setup` | Instalar/verificar CLI além de habilidades oficiais de construção e fluxo de trabalho (com confirmação). |
| `/firecrawl:interact <url>` | Clique, navegue ou preencha formulários quando a raspagem for insuficiente. |
| `/firecrawl:parse <file>` | Analise um documento local/privado em markdown ou JSON. |
| `/firecrawl:monitor <action>` | Liste verificações ou gerencie monitores recorrentes de mudança de página. |
| `/firecrawl:agent <goal>` | Execute uma tarefa de agente Firecrawl de longa duração limitada. |
| `/firecrawl:research <query>` | Pesquisar artigos e GitHub contexto de pesquisa. |
| `/firecrawl:ask <jobId>` | Diagnosticar um trabalho Firecrawl com falha. |
| `/firecrawl:docs-search <question>` | Pesquise a documentação Firecrawl oficial atual. |
| `/firecrawl:integrate <feature>` | Adicione Firecrawl ao código do aplicativo por meio de habilidades de construção upstream. |
| `/firecrawl:deliverable <artifact>` | Produza um resumo, uma auditoria, uma lista de leads ou outro artefato de fluxo de trabalho. |`/firecrawl:setup` executa o fluxo `firecrawl-cli init --all` oficial somente após a confirmação. As habilidades `firecrawl-*` oficiais existentes têm precedência e são preservadas pelo instalador Codex/Cursor; AVF fornece alternativas compatíveis para habilidades ausentes. Rota de operações ao vivo através de CLI → MCP → REST/keyless.

### 🟤 render — hosting / deploy (Render)
| Comando | O que faz |
| --- | --- |
| `/render:vorcl <goal>` | Objetivo de infraestrutura via Task Master — implantar/diagnosticar/configurar para concluir. |
| `/render:deploy <service>` | Implantar/reimplantar um serviço. |
| `/render:logs <service>` | Logs de serviço e diagnósticos até a causa raiz. |
| `/render:status <service>` | Status do serviço + implantação + métricas. |
| `/render:query <sql>` | SQL somente leitura contra Render Postgres. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| Comando | O que faz |
| --- | --- |
| `/database:vorcl <goal>` | Objetivo de dados via Task Master — esquema/consultas/migrações/cache a serem concluídos. |
| `/database:query <query>` | Consulta/análise somente leitura. |
| `/database:schema <target>` | Projetar/revisar esquema e integridade de dados. |
| `/database:migrate <change>` | Planeje uma migração de esquema/dados segura e reversível. |
| `/database:optimize <target>` | Otimizar — índices, N+1, planos de consulta, paginação. |
| `/database:cache <target>` | Redis — TTL, invalidação, bloqueios, limitação de taxa, Streams. |

### ⚪ resilience — error handling + logging
| Comando | O que faz |
| --- | --- |
| `/resilience:vorcl <goal>` | Meta de confiabilidade via Task Master — código de cobertura com try/catch + logs. |
| `/resilience:harden <target>` | Enrole o código em try/catch/finalmente com registro sólido, sem falhas silenciosas. |
| `/resilience:logging <target>` | Adicionar/corrigir registro estruturado — níveis, contexto, sem segredos/PII. |
| `/resilience:audit` | Somente leitura: encontre falhas silenciosas, capturas vazias, lacunas de registro. |

### 🖼️ screenshot — screenshot UI → code
| Comando | O que faz |
| --- | --- |
| `/screenshot:vorcl <goal>` | Um conjunto de telas de capturas de tela via Task Master — detalhamento → código. |
| `/screenshot:analyze <image>` | Detalhamento somente leitura – layout, componentes, tokens, estados → plano. |
| `/screenshot:convert <image> [framework]` | Gere código executável completo a partir de uma captura de tela (padrão React + Tailwind v4). |
| `/screenshot:tokens <image>` | Extraia tokens de design (cores OKLCH, tipografia, espaçamento) em Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Torne o UI gerado responsivo — pontos de interrupção, fluido, `clamp()`, consultas de contêiner. |

### 🎨 design-studio — product and visual design
| Comando | O que faz |
| --- | --- |
| `/design-studio:vorcl <goal>` | Objetivo completo do design por meio de Task Master — contexto → variantes → HTML → visualização → verificação → exportação. |
| `/design-studio:create <brief>` | Crie um artefato visual independente e sofisticado ou hi-fi UI. |
| `/design-studio:prototype <flow>` | Crie um protótipo interativo web/móvel com estados e transições. |
| `/design-studio:wireframe <flow>` | Construa um wireframe low-fi focado em arquitetura de informação e UX. |
| `/design-studio:design-system <operation>` | Crie, importe, compile, vincule, atualize ou verifique um sistema de design. |
| `/design-studio:import <type> <source>` | Importe Figma `.fig`, GitHub ou HTML/CSS com procedência. |
| `/design-studio:deck <brief>` | Crie um deck HTML com anotações do orador, animações e PPTX editável opcional. |
| `/design-studio:document <brief>` | Crie um documento, currículo, memorando, página única ou relatório pronto para impressão. |
| `/design-studio:animation <brief>` | Crie um artefato de movimento e, opcionalmente, renderize-o em MP4. |
| `/design-studio:research <question>` | Crie um artefato de pesquisa visual baseado na fonte. |
| `/design-studio:export <project> <format>` | Exporte para formato independente HTML, PDF, PPTX, MP4 ou handoff. |
| `/design-studio:review <target>` | Visual somente leitura, UX, responsivo, A11y e revisão do sistema de design. |

### 🔎 visual-research — screenshot → verified web answer
| Comando | O que faz |
| --- | --- |
| `/visual-research:vorcl <goal>` | Pesquisa de captura de tela em várias etapas por meio de Task Master. |
| `/visual-research:identify <image>` | Identifique o site, a página e o recurso com evidências de confiança. |
| `/visual-research:search <image> <target>` | Encontre a página real ou a documentação oficial a partir de pistas visuais. |
| `/visual-research:answer <image> <question>` | Responda usando evidências de captura de tela, documentos oficiais e dados atuais ao vivo. |
| `/visual-research:hints <image> <goal>` | Forneça etapas seguras e apoiadas em documentação para a interface visível. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| Comando | O que faz |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Encontre/entenda/altere UI existente a partir de uma captura de tela via Task Master — mapa → tarefas → delegar. |
| `/pinpoint:locate <image>` | Localize os componentes/arquivos existentes em uma captura de tela — `file:line`, sem código novo. |
| `/pinpoint:route <image>` | Identifique a rota/página em que a tela está (Next.js App/Pages Router, React Router). |
| `/pinpoint:control <image>` | Identifique o controle exato (botão/campo) e seu manipulador no código. |
| `/pinpoint:trace <target>` | Rastreie a lógica por trás de um elemento - manipulador → estado → busca de dados → API. || `/pinpoint:handoff <change>` | Crie uma solicitação de edição precisa em relação ao código existente e delegue para `frontend`/`backend`. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| Comando | O que faz |
| --- | --- |
| `/drawio:vorcl <goal>` | Um conjunto de diagramas via Task Master — build to done. |
| `/drawio:create <description> [type]` | Construa um diagrama a partir de uma descrição de texto (XML nativo válido). |
| `/drawio:pmp <type> <project>` | Construa um diagrama PMP/PMBOK — EAP, PERT/CPM, Gantt, RACI, matriz de risco, grade de partes interessadas. |
| `/drawio:convert <source> [type]` | Converta uma fonte em um diagrama — DB esquema → ERD, pastas → árvore, código → UML, sereia/CSV/JSON. |
| `/drawio:refine <file>` | Refine um `.drawio` existente — layout, tema, adicione/remova nós, alinhe à grade. |

### 🗺️ archmap — architecture map from code| Comando | O que faz |
| --- | --- |
| `/archmap:vorcl <goal>` | Uma meta de mapeamento via Task Master — construída para um conjunto de artefatos verificados. |
| `/archmap:map [repo]` | Pipeline completo: extração → `architecture.json` → anotação LLM → todos os formatos (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Somente extração — legível por máquina `architecture.json` com `source:{file,line}` em cada nó. |
| `/archmap:annotate [json]` | Enriquecimento LLM de um `architecture.json` existente (memória do agente, semântica de fluxo de dados); fatos não comprovados são automaticamente rebaixados para `inferred`. |
| `/archmap:html [json]` | Mapa HTML interativo e independente — alternância de camadas, rastreamento de feixes, nó → painel `file:line`, pesquisa, impressão CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (várias páginas: Visão geral / ERD / API / Agentes) e/ou Mermaid visualizações, validadas. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| Comando | O que faz |
| --- | --- |
| `/mermaid:vorcl <goal>` | Um conjunto de diagramas via Task Master — build to done (renderização verificada). |
| `/mermaid:create <description> [type]` | Construa um diagrama a partir de uma descrição — sintaxe válida, verificada por uma renderização real; lhe entrega o arquivo. |
| `/mermaid:convert <source> [type]` | Converta uma fonte em Mermaid — DB esquema → ER, código → classe/sequência, pastas → fluxograma, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Sintaxe + teste de renderização real; encontre e corrija erros (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Exporte para SVG/PNG/PDF (sereia-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Refine um `.mmd` existente — direção, subgráfico, classDef/estilos, legibilidade. |

### 🧪 testing — tests & verification
| Comando | O que faz |
| --- | --- |
| `/testing:vorcl <goal>` | Uma meta de teste/verificação via Task Master — unidade + integração + e2e concluída. |
| `/testing:unit <file\|module>` | Testes unitários (Vitest/Jest) — caminho feliz, limites, erros; os executa e mostra a saída. |
| `/testing:integration <endpoint\|module>` | Testes de integração (Supertest/inject, real DB ou testcontainers). |
| `/testing:e2e <scenario>` | Playwright E2E para um caminho de usuário crítico — seletores de função, fixtures, rastreamento em caso de falha. |
| `/testing:verify <task\|testStrategy>` | Executa o `testStrategy` de uma tarefa e retorna um veredicto READY / NOT READY com saída real. |
| `/testing:coverage [path]` | Relatório de cobertura com descobertas — qual código crítico não foi testado; cria tarefas. |
| `/testing:flaky <test>` | Diagnostica um teste instável (corrida, tempo, estado compartilhado, simulações) e corrige-o definitivamente. |

### 🌿 gitflow — git workflow & releases
| Comando | O que faz |
| --- | --- |
| `/gitflow:vorcl <goal>` | Uma meta git/release via Task Master (preparar um lançamento, limpar histórico, ramificação de recurso). |
| `/gitflow:commit <files\|scope>` | Um commit por nome (nunca `git add .`) com uma mensagem de commits convencionais; para em WIP desconhecido. |
| `/gitflow:pr <base> <title>` | Branch → commits → pull request (gh / GitHub MCP) com o que/por que/como foi verificado. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Mantenha um Changelog) gerado a partir de commits entre tags. |
| `/gitflow:release <version\|auto>` | Sempre de commits → sincronizar versões do manifesto → tag → GitHub lançamento. Push somente após confirmação explícita. |
| `/gitflow:audit [branch]` | Auditoria de histórico somente leitura: violações de convenção, commits de despejo, grandes blobs, ramificações órfãs. |

### 🛡️ security — security audit (read-only)
| Comando | O que faz |
| --- | --- |
| `/security:vorcl <goal>` | Uma meta de segurança via Task Master — auditoria → descobertas → tarefas → correções delegadas. |
| `/security:secrets [path\|branch]` | Segredos na árvore de trabalho E no histórico do git (todas as ramificações); `${VAR:-}` espaços reservados não são segredos. |
| `/security:owasp [path]` | OWASP Top 10 no código: injeções, XSS, autenticação, exposição de dados, CORS/cookies — com prova de arquivo:linha. |
| `/security:deps` | CVEs de dependência via npm audit / lockfiles — gravidade, sinalizadores de alteração significativa. |
| `/security:pii [path]` | Riscos PII/GDPR: e-mails, telefones, cartões em código e logs; caminhos privados do desenvolvedor. |
| `/security:pre-push [branch]` | Verificação combinada rápida de arquivos alterados antes de um push: segredos + injeções + PII; veredicto verde/vermelho. |

### 📝 docs — documentation
| Comando | O que faz |
| --- | --- |
| `/docs:vorcl <goal>` | Uma meta de documentação via Task Master. |
| `/docs:readme [path]` | Criar/atualizar README — what/quickstart/usage/config/troubleshooting; exemplos verificados; versões de idiomas sincronizadas. |
| `/docs:api [spec]` | API documentos gerados a partir da OpenAPI especificação (endpoints, params, curl exemplos); sugere `/swagger:audit` se não houver especificação. |
| `/docs:architecture` | ARCHITECTURE.md — módulos, limites, fluxo de dados; diagramas delegados a `mermaid`/`drawio`. || `/docs:contributing` | CONTRIBUTING.md — configuração, estrutura, testes, convenções de commit (alinhadas com `gitflow`), processo de PR. |
| `/docs:release-notes <version>` | Notas de lançamento para uma versão de CHANGELOG/history. |
| `/docs:audit` | Verificação de desvio de código de documentos somente leitura: links quebrados, exemplos/contadores obsoletos, traduções não sincronizadas. |

### 🐳 devops — containers & CI/CD
| Comando | O que faz |
| --- | --- |
| `/devops:vorcl <goal>` | Uma meta de infraestrutura via Task Master. |
| `/devops:dockerfile [app-type]` | Escreva/revise um Dockerfile — multiestágio, base estreita, não root, HEALTHCHECK; verificado por um `docker build` real. |
| `/devops:compose` | docker-compose.yml para desenvolvimento local (aplicativo + bancos de dados); as alterações de env precisam de `--force-recreate`, aguarda por integridade. |
| `/devops:ci [type]` | GitHub Ações — fluxo de trabalho de PR (lint+typecheck+test, npm cache), fluxo de trabalho de implantação, permissões mínimas. |
| `/devops:env` | Inventário de variáveis ​​ambientais: onde ler, o que é necessário, modelo `.env.example`; segredos nunca em imagens. |
| `/devops:monitoring` | Logs estruturados (pino/JSON), endpoint de integridade, sobre o que alertar; Renderize métricas por meio do agente `render`. |

### 📡 liveboard — ephemeral local operations board
| Comando | O que faz |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Inicie um painel sofisticado de 43 idiomas em uma porta localhost gratuita; Task Master muda o fluxo através do SSE e reconcilia a cada 5 minutos. |
| `/liveboard:vorcl <goal>` | Desenvolva ou altere o próprio liveboard por meio do fluxo de trabalho Task Master necessário. |

Liveboard lê Git árvores de trabalho, processos Claude/Codex/Cursor locais e `.taskmaster/tasks/tasks.json` de cada árvore de trabalho. O estado de tempo de execução permanece na memória e desaparece quando o processo em primeiro plano é interrompido. O UI detecta o idioma do navegador e oferece 43 localidades, incluindo inglês, russo, ucraniano, alemão, francês, espanhol, português, italiano, polonês, turco, chinês, japonês, árabe, holandês, tcheco, eslovaco, romeno, húngaro, búlgaro, sérvio, croata, esloveno, grego, hebraico, persa, hindi, bengali, urdu, indonésio, malaio, vietnamita, tailandês, coreano, sueco, norueguês, dinamarquês, finlandês, estoniano, letão, lituano, Georgiano, Armênio e Azerbaijano. Árabe, hebraico, persa e urdu usam layout RTL.

Configuração direta:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: projeto cujas Git árvores de trabalho e Task Master arquivos são verificados.
- `--port 0`: selecione automaticamente uma porta livre.
- `--interval`: intervalo completo de reconciliação em milissegundos; arquivo assistindo fluxos estáticos Task Master muda imediatamente.
- Pontos finais: `/health`, `/api/snapshot`, `/api/events` (SSE) e `POST /api/refresh`.
- Mantenha `--host 127.0.0.1`, a menos que pretenda explicitamente expor informações do projeto à rede.

---

## Configuration (MCP & keys)

O pacote **não possui back-end ou banco de dados remoto**. O liveboard opcional é um processo na memória somente localhost. MCP os servidores precisam de tokens e **cada usuário fornece o seu próprio**. Para fazer isso funcionar de forma idêntica em **Claude Code, Codex, Cursor e Kimi CLI** — e se você inicia a partir de um terminal ou de Dock/Spotlight/um IDE — cada servidor stdio MCP é iniciado através de um pequeno launcher (`bin/mcp-env.mjs`) que lê suas chaves de **um arquivo**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

O instalador o cria a partir de [`.env.example`](../.env.example). Abra-o e preencha apenas as chaves que você usa:

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

> **Por que um iniciador em vez de `~/.zshrc`?** A expansão Env-var difere de acordo com o tempo de execução (`${VAR:-}` em Claude, `${env:VAR}` em Cursor, literais em Codex/Kimi) e cada tempo de execução lê apenas o ambiente **em que** foi iniciado. Inicializações de GUI/IDE no macOS não originam `~/.zshrc`, portanto, as chaves exportadas são invisíveis e os servidores não se conectam a nada — a clássica falha "MCP env not set". A leitura de um arquivo `.env` elimina os dois problemas de uma só vez.

**Precedência** (vence mais tarde): o `~/.config/agent-vorcl-flow/.env` → um `./.env` compartilhado na raiz do projeto → um `export` real no seu shell. Mantenha as chaves globais no arquivo compartilhado, substitua por projeto (por exemplo, um `MONGODB_URI` diferente) por um projeto `.env`, e uma exportação de shell genuína ainda vence para execuções de CLI. Você pode apontar o inicializador para um arquivo diferente com `AGENT_VORCL_ENV_FILE=/path/.env`.Um servidor cuja chave necessária está faltando simplesmente **não inicia** — você verá uma linha `[agent-vorcl-flow] MCP «…» is not configured: …` no log MCP do tempo de execução e todos os outros servidores continuarão funcionando. Adicione a chave a `.env` e reinicie. (Você pode manter os nomes `GITHUB_TOKEN`/`MONGODB_URI` — o inicializador os mapeia para os `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` que os servidores esperam.)

> ⚠️ **Obrigatório para comandos Task Master com tecnologia de IA:** configure pelo menos um provedor selecionado — `ANTHROPIC_API_KEY` para Claude, `OPENAI_API_KEY` para GPT ou Codex CLI OAuth. Sem credenciais para o modelo selecionado em `.taskmaster/config.json`, `/vorcl` não pode gerar ou expandir tarefas.

Escolha qual provedor Task Master realmente executa a geração; as teclas por si só não selecionam o modelo:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

O comando usa o fluxo oficial `task-master models` e armazena apenas a seleção do modelo em `.taskmaster/config.json`. `PERPLEXITY_API_KEY` é opcional e necessário apenas quando Perplexity é selecionado como modelo de pesquisa.

Os servidores **vercel** e **render** remotos usam OAuth (autorize com `/mcp` em um navegador). Para Renderizar em headless/CI, defina `RENDER_API_KEY` em seu ambiente e adicione uma entrada de cabeçalho Bearer a esse servidor para seu tempo de execução.

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

O repositório agora inclui um manifesto de plugin nativo Codex em `.codex-plugin/plugin.json`. O instalador npm permanece disponível e instala os mesmos recursos de **habilidades**, **perfis** e um roteador `AGENTS.md` para Codex CLI, Cursor e Kimi:

| Claude Code | Codex equivalente |
| --- | --- |
| subagente `@agent-vorcl-flow:frontend` | personalidade de habilidade `$frontend` + `codex --profile frontend` |
| comando `/analyzer:audit` | habilidade de tarefa `$analyzer-audit` |
| comando `/vorcl` | habilidade de tarefa `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` em `config.toml` |
| `SessionStart` gancho | roteamento de função em `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Consulte [`codex/README.md`](../codex/README.md) para obter o mapeamento completo.

---

## Cursor

Cursor usa o mesmo formato `SKILL.md` aberto do adaptador Codex, além de subagentes personalizados nativos e configuração MCP global:

| Agent-Vorcl-Flow conceito | Cursor equivalente |
| --- | --- |
| papel `backend` | subagente personalizado `/avf-backend` em `~/.cursor/agents` |
| comando de tarefa `/backend:create-api` | habilidade `/backend-create-api` |
| universais `/vorcl` | habilidade `/vorcl` |
| `.mcp.json` | servidores mesclados em `~/.cursor/mcp.json` |

O instalador converte definições de função para Cursor frontmatter, prefixa subagentes com `avf-` para evitar colisões de nomes de habilidades, usa `model: inherit` e marca agentes somente de auditoria como `readonly: true`. As entradas de servidor MCP existentes com os mesmos nomes são preservadas. Consulte [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) carrega nativamente habilidades de agente, arquivos de agente personalizados e ganchos de ciclo de vida; AVF também mescla os mesmos servidores MCP usados por Claude e Cursor:

| Agent-Vorcl-Flow conceito | Kimi CLI equivalente |
| --- | --- |
| habilidades/comandos de tarefas | `~/.kimi/skills` e `/skill:<name>` |
| Expo agente personalizado | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse guarda | mesclado em `~/.kimi/config.toml` |
| `.mcp.json` | servidores mesclados em `~/.kimi/mcp.json` |
| arquivo de chave por tempo de execução | o `~/.config/agent-vorcl-flow/.env` compartilhado (através do iniciador) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI não tem expansão `${VAR}` em `mcp.json`, então as chaves vêm do `.env` compartilhado por meio do inicializador — exatamente como os outros tempos de execução. Consulte [`kimi/README.md`](../kimi/README.md).

---

## Project structure

```text
.claude-plugin/plugin.json      # plugin manifest
.claude-plugin/marketplace.json # local marketplace (for install)
agents/       25 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (73 skills; some ship references, scripts, tests or HTML assets)
commands/     <namespace>/<command>.md    (150 commands, /namespace:command, including /vorcl and /audit)
hooks/        hooks.json + SessionStart + PostToolUse guards (empty catch, Expo architecture/UI boundaries)
.mcp.json     github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master, mermaid
.env.example  template for ~/.config/agent-vorcl-flow/.env (single key file for all runtimes)
translations/ localized README files (21 translations)
bin/          install.mjs (the npx installer) + mcp-env.mjs (cross-runtime MCP launcher / .env loader)
codex/        GPT Codex adapter (skills + config.toml + install.sh)
cursor/       Cursor adapter (MCP template + installation notes)
kimi/         Kimi CLI adapter (skills install + Expo agent/hook + MCP)
```

**Como tudo se encaixa:** `agents/*.md` declara uma função e, no início `skills:`, anexa habilidades → habilidades em `skills/*/SKILL.md` são carregadas automaticamente por descrição → `commands/<agent>/*.md` fornece atalhos rápidos `/agent:command` que delegam ao subagente → `.mcp.json` fornece aos agentes suas ferramentas, cada uma iniciada por `bin/mcp-env.mjs` que carrega segredos do `.env` compartilhado. Um gancho `SessionStart` informa Claude que os agentes estão disponíveis.

---

## License

MIT — gratuito para usar, copiar, modificar e distribuir; fornecido "como está", sem garantia e sem responsabilidade. Consulte [LICENSE](../LICENSE).

© 2026 Christian Avis (Vorcl).
