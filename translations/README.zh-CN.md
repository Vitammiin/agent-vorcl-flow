<div align="center">

# Agent-Vorcl-Flow

**[Claude Code](https://claude.com/claude-code)、[GPT Codex](https://developers.openai.com/codex/cli/)、[Cursor](https://cursor.com/) 和 [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) 的专业 AI 子代理团队 — 具有技能、命令和 MCP 工具。**
一条 `npx` 命令即可安装它们。没有远程后端或云托管：您的编码代理在本地运行所有内容。

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
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [**中文**](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 83d6d9acc986bc985e4ad946e5d40538d51bf4d6cafa9623e93e5244c4da8b5e. -->

</div>

---

## What is this?

Agent-Vorcl-Flow 将受支持的编码代理转变为**结构化工程团队**。您不再需要一名普通助理，而是拥有 **25 个专注的子代理**（架构师、以代码为基础的首席架构师、后端、前端、Expo 移动工程师、产品和视觉设计工程师、DB 工程师、跨语言完整性审核员、架构制图师、Liveboard 操作员等），每个代理都有自己的领域 **技能**、快速 **斜线命令** 以及所需的 **MCP 工具**。每项重要任务都经过严格的 **Task Master** 循环 — *目标 → 任务 → 实施 → 验证 → 完成* — 因此，工作会得到计划、跟踪，并且不会受到干扰。

- 🧩 **25 个子代理**，73 种技能，155 条斜线命令
- ⚡ **单命令安装** 适用于 Claude Code、Codex、Cursor 和/或 Kimi CLI — `npx`
- 🔌 **11 个 MCP 服务器** 连接（GitHub、Postgres、MongoDB、Redis、Docker、Firecrawl、Vercel、渲染、文件系统、Task Master、Mermaid）
- 🔑 **一个适用于所有运行时的 `.env` 文件** — 由启动器读取的密钥，而不是 `~/.zshrc`，因此它们甚至可以在 GUI/IDE 启动时工作；无远程 AVF 服务； liveboard 仅限本地主机且短暂
- 🤝 **在同一来源的 Claude Code、GPT Codex、Cursor 和 Kimi CLI 上运行**

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**、**[GPT Codex](https://developers.openai.com/codex/cli/)**、**[Cursor](https://cursor.com/)** 和/或 **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

使用标志定位单个运行时：

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

安装程序的作用：

|运行时 |行动|
| ---| ---|
| **共享层** |将启动器复制到 `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` 并从模板创建 `~/.config/agent-vorcl-flow/.env`（一次）——每个运行时的单个密钥文件。 |
| **Claude Code** |将此存储库注册为插件 **marketplace** 并启用该插件（通过 `claude plugin …`，直接使用 `~/.claude/settings.json` 后备）。 |
| **GPT Codex** |将技能合并到 `~/.agents/skills` 中，并将 `config.toml` + `AGENTS.md` 块合并到 `~/.codex` 中（幂等，标记之间）。 |
| **Cursor** |将技能安装到 `~/.cursor/skills`，将本机自定义子代理安装到 `~/.cursor/agents`，并将缺少的服务器合并到 `~/.cursor/mcp.json`。 |
| **Kimi CLI** |将技能安装到 `~/.kimi/skills` 中，将本机 Expo 自定义代理安装到 `~/.kimi/agents` 中，Expo 架构/UI 都挂接到 `~/.kimi/config.toml` 中，并合并 MCP 服务器。 |

> 安装程序永远不会填写您的秘密 - 它只会从模板创建一个空的 `.env`。您可以在此处添加密钥（请参阅 [Configuration](#configuration-mcp--keys该软件包没有远程后端或数据库可选的-liveboard-是一个仅限本地主机的内存进程-mcp-服务器需要令牌每个用户提供自己的为了使该功能在-claude-codecodexcursor-和-kimi-cli-上同样工作无论您是从终端还是从-dockspotlightide-启动每个-stdio-mcp-服务器都通过一个小型启动器-binmcp-envmjs-启动该启动器从-一个文件-读取密钥)）。

### Update to the latest version

使用 npm `latest` 标签再次运行安装程序：

```bash
npx --yes agent-vorcl-flow@latest
```

要仅更新一个运行时，请保留您在安装过程中使用的相同运行时标志：

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

该更新覆盖了 Agent-Vorcl-Flow 管理的技能、代理、挂钩、启动器和配置块。它使您现有的 `~/.config/agent-vorcl-flow/.env` 及其秘密保持不变，并保留上游 Firecrawl 技能。之后重新启动更新后的编码客户端（或在Claude Code中运行`/reload-plugins`）。

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

安装后，**重新启动 Claude Code**（或在打开的会话中运行 `/reload-plugins`）以加载代理。

---

## How to use本节中的示例使用 Claude Code 语法；请参阅下面的 [Cursor](#cursor) 和 [GPT Codex](#gpt-codex) 映射以了解其本机语法。在 Claude Code 中，有**三种方式**来调用团队。

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` 确定哪个子代理应该拥有该工作并驱动整个 Task Master 周期。 `/audit` 自动检测后端、前端、移动、数据和基础设施，并使用所有相关角色编写基于证据的 `PROJECT_AUDIT.md`。 `/init-code` 静态读取存储库并创建基于证据的 `PROJECT_DESCRIPTION.md`，而无需执行项目代码。一旦该文件存在，每个修改角色都必须保持其受影响的部分同步；经过验证的描述漂移会阻碍任务的完成。

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

每个代理还有自己的 `/<agent>:vorcl` 入口点，该入口点运行作用于该代理的 Task Master 循环。

### The Task Master loop
每个重要的任务都流经 **Task Master** (`task-master-ai`)：

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```

这使得工作保持计划性、检查点和可恢复性——没有通过验证步骤就不会宣布“完成”。

---

## The agents|代理|角色 |亮点|
| ---| ---| ---|
| 🔵 **建筑师** |系统和解决方案架构师 |需求分析、系统/DB/API 设计、架构评审 |
| 🏛️ **首席建筑师** |首席软件/基础设施/人工智能架构师 |扫描 11 种语言的真实代码并创建有证据支持的 MD、JSON、HTML、PDF、draw.io 和 Mermaid；完全重新扫描更新保留注释|
| 🟢 **后端** |后端开发人员 |节点/TS，Postgres，Redis；模块化架构； OpenAPI全面覆盖每条航线|
| 🟣 **前端** |前端（React 19 / Next.js 应用路由器）|组件、状态、数据获取、渲染/捆绑优化、测试 |
| 📱 **世博会移动** | React Native + Expo 工程师 |模块化架构加上设计/运动/交互系统、本机导航、令牌、手势、触觉、简化运动 |
| 🟠 **分析器** |代码审核员（只读）| Bug、类型安全、DB 结构、前端模拟、后端气味 |
| 🧭 **诚信** |跨语言代码完整性审核员（只读）|跨前端/后端/移动/共享的生产硬编码和模拟/伪造/演示/夹具泄漏 |
| 🟡 **大摇大摆** | OpenAPI/Swagger 覆盖范围（任何堆栈）|查找未完整记录的路线并覆盖它们，并进行验证 |
| 🔴 **火爬行** |网络研究员|实时 CLI/MCP/REST、应用程序集成和完成的网络数据工作流程 |
| 🟤 **渲染** |托管和部署（渲染）|部署、日志驱动的诊断、指标、环境变量、渲染 Postgres |
| 🟦 **数据库** | DB工程师/DBA |架构、查询和计划、索引、N+1、安全可逆迁移、缓存 |
| ⚪ **弹性** |可靠性：错误+日志记录|在正确的边界尝试/捕获、键入错误、重试/超时、结构化日志 |
| 🖼️ **截图** |截图 UI → 代码 |将 UI 屏幕截图转换为生产就绪、响应灵敏、可访问的代码 |
| 🎨 **设计工作室** |产品与视觉设计工作室|本地 HTML 工件、原型、线框图、幻灯片/PPTX、文档、动画、3D、设计系统和 Figma/GitHub/HTML 导入；改编自 MIT `JimLiu/baoyu-design` |
| 🔎 **视觉研究** |截图→验证答案|识别站点/页面、查找官方文档、检查实时数据并通过 URL 和信心给出答案 |
| 🎯 **精确定位** |屏幕截图→放置在现有项目中（只读）|在真实代码库中提供运行应用程序的屏幕截图 - 组件、`file:line`、路由/页面、精确控制及其背后的逻辑；不创建任何内容，委托编辑 |
| 📊 **绘图** |图表 (draw.io/diagrams.net) |流程图、BPMN、UML、ERD、网络/云和 PMP/PMBOK（WBS、甘特图、RACI...）|
| 🗺️ **拱形地图** |建筑制图师 |确定性代码→`architecture.json`（每个节点都有`source:{file,line}`）→交互式HTML地图，draw.io，Mermaid，ARCHITECTURE.md，PDF；未经证实的事实被标记为`inferred` |
| 🧜 **美人鱼** | Mermaid 图表（+ 真实渲染）|流程图、序列、类、状态、ER、甘特图、gitGraph、思维导图……；通过 mcp-mermaid/`mmdc` 验证；将文件交给您 (`.mmd` + SVG/PNG/PDF) |
| 🧪 **测试** |测试验证工程师|单元（Vitest/Jest）、集成（Supertest）、E2E（Playwright）、覆盖范围、片状测试搜索；执行每个任务的 `testStrategy` — 如果没有绿色运行，什么都不会“完成”|| 🌿 **gitflow** | Git 工作流程和发布 |常规提交、按名称提交（从不 `git add .`）、PR、保留更改日志、semver 版本；仅在明确确认的情况下推送 |
| 🛡️ **安全** |安全审核员（只读）|树和 git 历史中的秘密、OWASP Top 10、依赖项 CVE、PII；调查结果变成任务——修复被委托
| 📝 **文档** |文档工程师 |自述文件（多语言奇偶校验）、来自 OpenAPI 的 API 文档、架构、贡献、发行说明；每个示例都根据代码进行验证 |
| 🐳 **devops** |容器和CI/CD |多阶段 Dockerfiles、用于本地开发的 docker-compose、GitHub Actions 管道、env/secrets 卫生、监控 |
| 📡 **直播板** |本地运营委员会|临时本地主机仪表板上的实时 Git 工作树、代理进程和 Task Master 任务 |

**一些值得了解的事情：**
- **前端总是与真实的 API 对话。** 后端的 OpenAPI 规格是唯一的事实来源；类型是从它生成的（`openapi-typescript` + `openapi-fetch`）。生产路径中没有模拟。
- **`database` 突变需要明确确认。** 分析是只读的；如果没有您的批准，架构/数据更改（DDL/DML/迁移）永远不会运行。
- **`resilience` 附带一个安全挂钩。** 非阻塞 `PostToolUse` 挂钩 (`catch-guard.js`) 轻轻标记您刚刚编辑的文件中的空 `catch {}` 块。
- **`archmap` 永远不会从想象中绘制。** 提取和渲染是严格分开的：零依赖脚本将存储库引入 `architecture.json`（具有真实 FK 基数的数据库、API 路由、AI 代理及其模型/工具/内存、导入图、env），并且每个图表仅从 JSON 渲染。 LLM 在没有可验证的 `file:line` 的情况下添加的任何内容均强制标记为 `inferred:true` 并用虚线绘制。
- **`principal-architect` 是完整的架构发布工作流程。** 它适用于启动代理的任何存储库，忽略作为拓扑证据的 Markdown 声明，使用捆绑的离线 Tree-sitter WASM for TS/JS、Python、Go、Java、C#、Rust、PHP、Ruby、Kotlin 和 Swift，首先编写 `ARCHITECTURE.md`，然后生成共享的 JSON 模型、独立的 HTML， PDF、本机draw.io 和可复制的Mermaid L0–L4。 `update` 执行全面重新扫描并保留注释和非托管文件。
- **`pinpoint` 发现，从不创建。** 给定正在运行的应用程序的屏幕截图，它将屏幕映射到真实代码（组件、路由、精确控制及其背后的逻辑），并将编辑权交给 `frontend`/`backend`。它适用于已经存在的东西（`screenshot` 的逆）。
- **`visual-research` 进行验证而不是猜测。** 它将屏幕截图视为证据，确认官方域名和文档，检查当前站点数据，并标记可能的网络钓鱼或陈旧值。
- **`i18n` 强制执行“零语言硬编码”。** 代理首先检测项目是否是多语言的并进行调整 - 面向用户的字符串经过翻译层（next-intl/react-i18next/i18next），从不内联。

---

## Command reference下面的每个命令都是斜杠命令。 `<…>` 标记您的输入。

### `/vorcl` — universal router
|命令|它有什么作用 |
| ---| ---|
| `/vorcl <goal>` |将任何目标转化为任务并将其路由到正确的子代理，然后运行完整的周期来完成。 |
| `/audit [path] [focus]` |深度只读多角色审计 → 检测到的系统、安全/CVE/弹性结果、目标架构和分阶段 `PROJECT_AUDIT.md`。 |
| `/init-code [path] [--update]` |静态代码库发现→基于证据的`PROJECT_DESCRIPTION.md`；项目代码永远不会被执行。 |

### 🔵 architect — architecture
|命令|它有什么作用 |
| ---| ---|
| `/architect:vorcl <goal>` |目标→任务→周期，范围为架构。 |
| `/architect:analyze <context>` |分析需求和任务的背景。 |
| `/architect:design <problem>` |设计解决方案架构（系统、DB、API）。 |
| `/architect:review <target>` |查看现有架构。 |

### 🏛️ principal-architect — code-grounded architecture package
|命令|它有什么作用 |
| ---| ---|
| `/principal-architect:vorcl <goal>` |通过 Task Master 运行大型架构目标并验证工件。 |
| `/principal-architect:create [options]` |扫描当前存储库并根据代码证据创建 MD、JSON、HTML、PDF、draw.io 和 Mermaid。 |
| `/principal-architect:update [options]` |全面重新扫描现有包，写入证据差异并自动刷新生成的工件。 |

### 🟢 backend — server (Node/TS, Postgres, Redis)
|命令|它有什么作用 |
| ---| ---|
| `/backend:vorcl <goal>` |目标→任务→后端工作的循环。 |
| `/backend:create-api <endpoint>` |在模块化架构上生成 API 端点，由 OpenAPI 完全覆盖。 |
| `/backend:refactor <target>` |重构代码而不改变行为。 |
| `/backend:optimize <target>` |性能优化。 |
| `/backend:test <target>` |为代码生成测试。 |

### 🟣 frontend — React / Next.js
|命令|它有什么作用 |
| ---| ---|
| `/frontend:vorcl <goal>` |目标→任务→前端工作周期。 |
| `/frontend:create-component <spec>` |按照功能结构生成 UI 组件。 |
| `/frontend:refactor <target>` |重构 UI / 钩子而不改变行为。 |
| `/frontend:optimize <target>` |优化渲染/捆绑/核心 Web Vitals。 |
| `/frontend:test <target>` |生成组件测试。 |

### 📱 expo-mobile — React Native / Expo|命令|它有什么作用 |
| ---| ---|
| `/expo-mobile:vorcl <goal>` |目标 → Task Master 循环进行 Expo 移动工作。 |
| `/expo-mobile:create-module <domain>` |创建一个模块化业务切片，仅包含其复杂性所需的层。 |
| `/expo-mobile:create-screen <flow>` |创建一个精简的 Expo Router 路由以及模块拥有的屏幕和状态。 |
| `/expo-mobile:design-screen <flow>` |构建具有共享设计/动作令牌、状态和可访问性的高级屏幕。 |
| `/expo-mobile:motion <interaction>` |设计原生导航、弹簧、手势、触觉和简化运动后备。 |
| `/expo-mobile:add-api <contract>` |添加架构/DTO/映射器/查询键和 TanStack Query 集成。 |
| `/expo-mobile:audit [scope]` |只读架构防护和基于证据的审计。 |
| `/expo-mobile:ui-audit [scope]` |只读设计系统、运动、交互、可访问性和性能审核。 |
| `/expo-mobile:compatibility [app] [change]` |针对版本化官方源进行实时只读 Expo/RN/Node/package/native-runtime 兼容性审核。 |
| `/expo-mobile:test <scope>` |运行域单元、React Native 测试库和 Maestro 检查。 |

### 🟠 analyzer — code audit (read-only)
|命令|它有什么作用 |
| ---| ---|
| `/analyzer:vorcl <goal>` |通过 Task Master 审核目标 — 结果变成任务。 |
| `/analyzer:audit` |全面审核：错误、类型、DB、前端模拟、后端气味。 |
| `/analyzer:bugs` |寻找错误——未处理的错误、竞争条件、边缘情况。 |
| `/analyzer:types` |类型检查 — `tsc`、`any`、不安全类型转换、zod↔类型漂移。 |
| `/analyzer:db` |审核 DB 结构 — 模式、索引、FK、N+1、迁移。 |
| `/analyzer:mocks` |前端和后端模拟/假数据的兼容路线；将深度多语言检查委托给完整性。 |
| `/analyzer:backend` |查找“不良”后端代码 - 架构违规、控制器中的逻辑。 |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)

|命令|它有什么作用 |
| ---| ---|
| `/integrity:vorcl <goal>` |通过 Task Master 运行重要的完整性目标，并将发现结果转化为所有者特定的任务。 |
| `/integrity:audit [path]` |一起扫描硬编码和模拟泄漏，然后证明生产可达性。 |
| `/integrity:hardcode [path]` |查找绕过本地化、配置或记录系统的用户/配置/业务文字。 |
| `/integrity:mocks [path]` |查找模拟框架、假生成器、装置、演示数据和可从生产环境访问的静态响应。 |捆绑的零依赖扫描器支持 TS/JS、Python、Go、Java/Kotlin、C#、PHP、Ruby、Rust、Vue/Svelte/HTML 和 Razor。在后端代码上，它还标记隐藏在常量、静态/最终字段、默认参数、命名参数和静态目录中的业务值；然后，审核员将它们与模式/模型/存储库/查询/管理突变进行比较，以证明数据库（而不是代码或配置）拥有该值。默认情况下会抑制测试、固定装置、故事、示例、种子、生成的代码和供应商根；在可达性和所有权得到证明之前，词汇候选者并不是缺陷。

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
|命令|它有什么作用 |
| ---| ---|
| `/swagger:vorcl <goal>` |通过 Task Master 实现全覆盖目标 — 审核 → 任务 → 覆盖 → 验证。 |
| `/swagger:audit` |只读：查找规范未完全涵盖的路线。 |
| `/swagger:cover <route>` |涵盖路由/模块——参数、响应、描述、安全+验证。 |

### 🔴 firecrawl — web research
|命令|它有什么作用 |
| ---| ---|
| `/firecrawl:vorcl <goal>` |通过 Task Master 的研究目标 - 收集网络数据以获得最终结果。 |
| `/firecrawl:search <query>` |网络搜索问题的来源。 |
| `/firecrawl:scrape <url>` |将一个 URL 抓取到 markdown/JSON 中。 |
| `/firecrawl:map <url>` |映射站点的 URL。 |
| `/firecrawl:crawl <url>` |递归地抓取一个部分/站点。 |
| `/firecrawl:extract <url>` |通过 JSON 模式进行结构化提取。 |
| `/firecrawl:setup` |安装/验证 CLI 以及官方构建和工作流程技能（需确认）。 |
| `/firecrawl:interact <url>` |当抓取不足时，单击、导航或填写表格。 |
| `/firecrawl:parse <file>` |将本地/私有文档解析为 markdown 或 JSON。 |
| `/firecrawl:monitor <action>` |列出检查或管理定期页面更改监视器。 |
| `/firecrawl:agent <goal>` |运行有界的长时间运行的 Firecrawl 代理任务。 |
| `/firecrawl:research <query>` |搜索论文和 GitHub 研究背景。 |
| `/firecrawl:ask <jobId>` |诊断失败的 Firecrawl 作业。 |
| `/firecrawl:docs-search <question>` |搜索当前官方 Firecrawl 文档。 |
| `/firecrawl:integrate <feature>` |通过上游构建技能将 Firecrawl 添加到应用程序代码中。 |
| `/firecrawl:deliverable <artifact>` |生成简报、审核、潜在客户列表或其他工作流程工件。 |`/firecrawl:setup`确认后才运行官方`firecrawl-cli init --all`流程。现有的官方 `firecrawl-*` 技能优先并由 Codex/Cursor 安装程序保留； AVF 为缺失的技能提供兼容的后备方案。现场操作路线通过 CLI → MCP → REST/无钥匙。

### 🟤 render — hosting / deploy (Render)
|命令|它有什么作用 |
| ---| ---|
| `/render:vorcl <goal>` |通过 Task Master 实现基础设施目标 — 部署/诊断/配置完成。 |
| `/render:deploy <service>` |部署/重新部署服务。 |
| `/render:logs <service>` |服务日志和诊断可追溯到根本原因。 |
| `/render:status <service>` |服务状态+部署+指标。 |
| `/render:query <sql>` |针对渲染 Postgres 的只读 SQL。 |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
|命令|它有什么作用 |
| ---| ---|
| `/database:vorcl <goal>` |通过 Task Master 完成数据目标 — 模式/查询/迁移/缓存。 |
| `/database:query <query>` |只读查询/分析。 |
| `/database:schema <target>` |设计/审查架构和数据完整性。 |
| `/database:migrate <change>` |规划安全、可逆的架构/数据迁移。 |
| `/database:optimize <target>` |优化——索引、N+1、查询计划、分页。 |
| `/database:cache <target>` | Redis — TTL、失效、锁定、速率限制、流。 |

### ⚪ resilience — error handling + logging
|命令|它有什么作用 |
| ---| ---|
| `/resilience:vorcl <goal>` |通过 Task Master 实现可靠性目标 — 使用 try/catch + 日志覆盖代码。 |
| `/resilience:harden <target>` |使用可靠的日志记录将代码包装在 try/catch/finally 中，不会出现静默失败。 |
| `/resilience:logging <target>` |添加/修复结构化日志记录 - 级别、上下文、无秘密/PII。 |
| `/resilience:audit` |只读：查找无声故障、空捕获、日志记录间隙。 |

### 🪵 logging — Pino structured logging
| Command | What it does |
| --- | --- |
| `/logging:vorcl <goal>` | Logging goal via Task Master — cover or update the Pino package. |
| `/logging:audit [path]` | Read-only: one root logger, child context, redact, no console/Loki sink. |
| `/logging:cover <target>` | Create `infrastructure/logging` and cover a module/worker/route. |
| `/logging:update <target>` | Bring legacy `pino()`/`console.log` to the canonical package. |


### 🖼️ screenshot — screenshot UI → code
|命令|它有什么作用 |
| ---| ---|
| `/screenshot:vorcl <goal>` |来自 Task Master 屏幕截图的一组屏幕 — 分解 → 代码。 |
| `/screenshot:analyze <image>` |只读细分 - 布局、组件、令牌、状态 → 计划。 |
| `/screenshot:convert <image> [framework]` |从屏幕截图生成完整的可运行代码（默认 React + Tailwind v4）。 |
| `/screenshot:tokens <image>` |将设计标记（OKLCH 颜色、版式、间距）提取到 Tailwind `@theme` 中。 |
| `/screenshot:responsive <target>` |使生成的 UI 具有响应能力 — 断点、流畅、`clamp()`、容器查询。 |

### 🎨 design-studio — product and visual design
|命令|它有什么作用 |
| ---| ---|
| `/design-studio:vorcl <goal>` |通过 Task Master 的完整设计目标 — 上下文 → 变体 → HTML → 预览 → 验证 → 导出。 |
| `/design-studio:create <brief>` |创建精美的独立视觉工件或高保真 UI。 |
| `/design-studio:prototype <flow>` |构建具有状态和转换的交互式网络/移动原型。 |
| `/design-studio:wireframe <flow>` |构建专注于信息架构和用户体验的低保真线框。 |
| `/design-studio:design-system <operation>` |创建、导入、编译、绑定、刷新或检查设计系统。 |
| `/design-studio:import <type> <source>` |导入 Figma `.fig`、GitHub 或 HTML/CSS 及其来源。 |
| `/design-studio:deck <brief>` |构建带有演讲者注释、动画和可选可编辑 PPTX 的 HTML 演示文稿。 |
| `/design-studio:document <brief>` |构建可打印的文档、简历、备忘录、一页纸或报告。 |
| `/design-studio:animation <brief>` |构建运动工件并可选择将其渲染为 MP4。 |
| `/design-studio:research <question>` |创建一个有源支持的视觉研究工件。 |
| `/design-studio:export <project> <format>` |导出为独立的 HTML、PDF、PPTX、MP4 或切换格式。 |
| `/design-studio:review <target>` |只读视觉、UX、响应式、a11y 和设计系统审查。 |

### 🔎 visual-research — screenshot → verified web answer
|命令|它有什么作用 |
| ---| ---|
| `/visual-research:vorcl <goal>` |通过Task Master进行多步截图研究。 |
| `/visual-research:identify <image>` |通过置信证据识别网站、页面和功能。 |
| `/visual-research:search <image> <target>` |从视觉线索中找到真实的页面或官方文档。 |
| `/visual-research:answer <image> <question>` |使用屏幕截图证据、官方文档和当前实时数据来回答。 || `/visual-research:hints <image> <goal>` |为可见界面提供安全的、有文档支持的步骤。 |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
|命令|它有什么作用 |
| ---| ---|
| `/pinpoint:vorcl <goal>` |通过 Task Master 从屏幕截图查找/理解/更改现有的 UI — 地图 → 任务 → 委托。 |
| `/pinpoint:locate <image>` |从屏幕截图中找到现有组件/文件 - `file:line`，没有新代码。 |
| `/pinpoint:route <image>` |识别屏幕所在的路由/页面（Next.js 应用程序/页面路由器、React 路由器）。 |
| `/pinpoint:control <image>` |在代码中精确定位控件（按钮/字段）及其处理程序。 |
| `/pinpoint:trace <target>` |跟踪元素背后的逻辑 — 处理程序 → 状态 → 数据获取 → API。 |
| `/pinpoint:handoff <change>` |针对现有代码构建精确的编辑请求并委托给 `frontend`/`backend`。 |

### 📊 drawio — diagrams (draw.io / diagrams.net)
|命令|它有什么作用 |
| ---| ---|
| `/drawio:vorcl <goal>` |一组来自 Task Master 的图表 — 构建完成。 |
| `/drawio:create <description> [type]` |根据文本描述（有效的本机 XML）构建图表。 |
| `/drawio:pmp <type> <project>` |构建 PMP/PMBOK 图 — WBS、PERT/CPM、甘特图、RACI、风险矩阵、利益相关者网格。 |
| `/drawio:convert <source> [type]` |将源转换为图表 — DB 模式 → ERD、文件夹 → 树、代码 → UML、mermaid/CSV/JSON。 |
| `/drawio:refine <file>` |优化现有的 `.drawio` — 布局、主题、添加/删除节点、对齐网格。 |

### 🗺️ archmap — architecture map from code|命令|它有什么作用 |
| ---| ---|
| `/archmap:vorcl <goal>` |通过 Task Master 的映射目标 — 构建经过验证的工件集。 |
| `/archmap:map [repo]` |完整管道：提取→`architecture.json`→LLM注释→所有格式（HTML、draw.io、Mermaid、ARCHITECTURE.md、PDF）。 |
| `/archmap:extract [repo]` |仅提取 — 每个节点上都有机器可读的 `architecture.json` 和 `source:{file,line}`。 |
| `/archmap:annotate [json]` |现有 `architecture.json` 的 LLM 丰富（代理内存、数据流语义）；未经证实的事实自动降级为 `inferred`。 |
| `/archmap:html [json]` |交互式独立 HTML 地图 — 图层切换、跟踪光束、节点 → `file:line` 面板、搜索、打印 CSS。 |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io（多页：概述/ERD/API/代理）和/或Mermaid视图，已验证。 |

### 🧜 mermaid — Mermaid diagrams (+ real render)
|命令|它有什么作用 |
| ---| ---|
| `/mermaid:vorcl <goal>` |通过 Task Master 生成的一组图表 — 构建完成（渲染验证）。 |
| `/mermaid:create <description> [type]` |根据描述构建图表 - 有效的语法，由真实渲染验证；把文件递给你。 |
| `/mermaid:convert <source> [type]` |将源转换为 Mermaid — DB 架构 → ER、代码 → 类/序列、文件夹 → 流程图、`.drawio`/CSV/JSON。 |
| `/mermaid:validate <file>` |语法+真实渲染测试；查找并修复错误（mmdc / Maid / mcp-mermaid）。 |
| `/mermaid:render <file> [format] [theme]` |导出到 SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink)。 |
| `/mermaid:refine <file>` |优化现有的 `.mmd` — 方向、子图、classDef/样式、可读性。 |

### 🧪 testing — tests & verification
|命令|它有什么作用 |
| ---| ---|
| `/testing:vorcl <goal>` |通过 Task Master 实现测试/验证目标 — 单元 + 集成 + e2e 完成。 |
| `/testing:unit <file\|module>` |单元测试（Vitest/Jest）——快乐路径、边界、错误；运行它们并显示输出。 |
| `/testing:integration <endpoint\|module>` |集成测试（超级测试/注入、真实的 DB 或测试容器）。 |
| `/testing:e2e <scenario>` | Playwright E2E 适用于关键用户路径 — 角色选择器、固定装置、故障跟踪。 |
| `/testing:verify <task\|testStrategy>` |执行任务的 `testStrategy` 并返回带有实际输出的 READY/NOT READY 判断。 |
| `/testing:coverage [path]` |包含调查结果的覆盖率报告——哪些关键代码未经测试；创建任务。 |
| `/testing:flaky <test>` |诊断不稳定的测试（竞赛、计时、共享状态、模拟）并永久修复它。 |

### 🌿 gitflow — git workflow & releases
|命令|它有什么作用 |
| ---| ---|
| `/gitflow:vorcl <goal>` |通过 Task Master 的 git/release 目标（准备发布、清理历史记录、功能分支）。 |
| `/gitflow:commit <files\|scope>` |带有常规提交消息的按名称提交（绝不是 `git add .`）；在未知的 WIP 上停止。 |
| `/gitflow:pr <base> <title>` |分支 → 提交 → 拉取请求 (gh / GitHub MCP) 并验证内容/原因/方式。 |
| `/gitflow:changelog [version]` | CHANGELOG.md（保留变更日志）是根据标签之间的提交生成的。 |
| `/gitflow:release <version\|auto>` | Semver 从提交 → 同步清单版本 → 标签 → GitHub 版本。仅在明确确认后才推送。 |
| `/gitflow:audit [branch]` |只读历史审计：约定违规、转储提交、大斑点、孤立分支。 |

### 🛡️ security — security audit (read-only)
|命令|它有什么作用 |
| ---| ---|
| `/security:vorcl <goal>` |通过 Task Master 实现的安全目标 — 审核→发现→任务→委托修复。 |
| `/security:secrets [path\|branch]` |  |工作树和 git 历史记录中的秘密（所有分支）； `${VAR:-}` 占位符不是秘密。 |
| `/security:owasp [path]` | OWASP 代码中的前 10 名：注入、XSS、身份验证、数据暴露、CORS/cookies — 带 file:line 证明。 |
| `/security:deps` |通过 npm 审核/锁定文件的依赖项 CVE — 严重性、重大更改标志。 |
| `/security:pii [path]` | PII/GDPR 风险：电子邮件、电话、代码卡和日志；开发者的私有路径。 || `/security:pre-push [branch]` |推送前快速组合检查已更改的文件：秘密 + 注入 + PII；绿色/红色判决。 |

### 📝 docs — documentation
|命令|它有什么作用 |
| ---| ---|
| `/docs:vorcl <goal>` |通过 Task Master 的文档目标。 |
| `/docs:readme [path]` |创建/更新自述文件 — 内容/快速入门/用法/配置/故障排除；已验证的例子；语言版本已同步。 |
| `/docs:api [spec]` |从 OpenAPI 规范生成的 API 文档（端点、参数、curl 示例）；如果没有规格，建议使用 `/swagger:audit`。 |
| `/docs:architecture` | ARCHITECTURE.md — 模块、边界、数据流；图表委托给`mermaid`/`drawio`。 |
| `/docs:contributing` | CONTRIBUTING.md — 设置、结构、测试、提交约定（与 `gitflow` 一致）、PR 流程。 |
| `/docs:release-notes <version>` |来自 CHANGELOG/history 的版本的发行说明。 |
| `/docs:audit` |只读文档↔代码漂移检查：损坏的链接、陈旧的示例/计数器、不同步的翻译。 |

### 🐳 devops — containers & CI/CD
|命令|它有什么作用 |
| ---| ---|
| `/devops:vorcl <goal>` |通过 Task Master 的基础设施目标。 |
| `/devops:dockerfile [app-type]` |编写/审查 Dockerfile — 多阶段、精简基础、非 root、HEALTHCHECK；经过真实的`docker build`验证。 |
| `/devops:compose` | docker-compose.yml 用于本地开发（应用程序+数据库）； env变化需要`--force-recreate`，等待健康。 |
| `/devops:ci [type]` | GitHub 操作 — PR 工作流程（lint+typecheck+测试、npm 缓存）、部署工作流程、最小权限。 |
| `/devops:env` | env-变量清单：在哪里读取，需要什么，`.env.example`模板；秘密永远不会存在于图像中。 |
| `/devops:monitoring` |结构化日志 (pino/JSON)、运行状况端点、警报内容；通过 `render` 代理渲染指标。 |

### 📡 liveboard — ephemeral local operations board
|命令|它有什么作用 |
| ---| ---|
| `/liveboard:start [path] [--port N] [--interval ms]` |在免费的本地主机端口上启动精美的 43 种语言仪表板； Task Master 通过 SSE 更改流并每 5 分钟协调一次。 |
| `/liveboard:vorcl <goal>` |通过所需的 Task Master 工作流程开发或更改 Liveboard 本身。 |

Liveboard 读取 Git 工作树、本地 Claude/Codex/Cursor 进程以及每个工作树的 `.taskmaster/tasks/tasks.json`。运行时状态保留在内存中，并在前台进程停止时消失。 UI 检测浏览器语言并提供 43 种语言环境，包括英语、俄语、乌克兰语、德语、法语、西班牙语、葡萄牙语、意大利语、波兰语、土耳其语、中文、日语、阿拉伯语、荷兰语、捷克语、斯洛伐克语、罗马尼亚语、匈牙利语、保加利亚语、塞尔维亚语、克罗地亚语、斯洛文尼亚语、希腊语、希伯来语、波斯语、印地语、孟加拉语、乌尔都语、印度尼西亚语、马来语、越南语、泰语、韩语、瑞典语、挪威语、丹麦语、芬兰语、爱沙尼亚语、拉脱维亚语、立陶宛语、格鲁吉亚语、亚美尼亚语和阿塞拜疆语。阿拉伯语、希伯来语、波斯语和乌尔都语使用 RTL 布局。

直接配置：

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`：扫描其 Git 工作树和 Task Master 文件的项目。
- `--port 0`：自动选择空闲端口。
- `--interval`：完全协调间隔（以毫秒为单位）；文件观看仍然立即流式传输 Task Master 更改。
- 端点：`/health`、`/api/snapshot`、`/api/events` (SSE) 和 `POST /api/refresh`。
- 保留 `--host 127.0.0.1` 除非您明确打算向网络公开项目信息。

---

## Configuration (MCP & keys)该软件包**没有远程后端或数据库**。可选的 liveboard 是一个仅限本地主机的内存进程。 MCP 服务器需要令牌，**每个用户提供自己的**。为了使该功能在 **Claude Code、Codex、Cursor 和 Kimi CLI** 上同样工作，无论您是从终端还是从 Dock/Spotlight/IDE 启动，每个 stdio MCP 服务器都通过一个小型启动器 (`bin/mcp-env.mjs`) 启动，该启动器从 **一个文件** 读取密钥：

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

安装程序从 [`.env.example`](../.env.example) 创建它。打开它并仅填写您使用的密钥：

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

> **为什么使用启动器而不是 `~/.zshrc`？** 每个运行时的环境变量扩展都不同（Claude 中的 `${VAR:-}`，Cursor 中的 `${env:VAR}`，Codex/Kimi 中的文字），并且每个运行时仅读取它**启动的环境。macOS 上的 GUI / IDE 启动不来源 `~/.zshrc`，因此导出的密钥是不可见的，服务器也没有连接到任何东西——典型的“MCP env not set”失败。从一个 `.env` 文件读取可以同时解决这两个问题。

**优先级**（稍后获胜）：共享的 `~/.config/agent-vorcl-flow/.env` → 项目根目录中的 `./.env` → shell 中的真实 `export`。将全局密钥保留在共享文件中，用项目 `.env` 覆盖每个项目（例如不同的 `MONGODB_URI`），并且对于 CLI 运行，真正的 shell 导出仍然会获胜。您可以使用 `AGENT_VORCL_ENV_FILE=/path/.env` 将启动器指向不同的文件。

缺少所需密钥的服务器根本**无法启动** - 您将在运行时的 MCP 日志中看到一行 `[agent-vorcl-flow] MCP «…» is not configured: …`，并且所有其他服务器都保持工作。将密钥添加到`.env`并重新启动。 （您可以保留 `GITHUB_TOKEN`/`MONGODB_URI` 名称 - 启动器将它们映射到服务器期望的 `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING`。）

> ⚠️ **AI 驱动的 Task Master 命令所需：** 配置至少一个选定的提供程序 — 用于 Claude 的 `ANTHROPIC_API_KEY`、用于 GPT 的 `OPENAI_API_KEY` 或 Codex CLI OAuth。如果没有 `.taskmaster/config.json` 中选择的模型的凭据，`/vorcl` 无法生成或扩展任务。

选择实际运行生成的 Task Master 提供商；单独的按键不能选择型号：

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

该命令使用官方`task-master models`流程，仅将模型选择存储在`.taskmaster/config.json`中。 `PERPLEXITY_API_KEY` 是可选的，仅当选择 Perplexity 作为研究模型时才需要。

远程 **vercel** 和 **render** 服务器使用 OAuth（在浏览器中使用 `/mcp` 进行授权）。对于在 headless/CI 中渲染，请在您的环境中设置 `RENDER_API_KEY` 并向该服务器添加一个 Bearer 标头条目以供运行时使用。

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

该存储库现在包含位于 `.codex-plugin/plugin.json` 的本机 Codex 插件清单。 npm 安装程序仍然可用，并安装与 **技能**、**配置文件** 相同的功能，以及适用于 Codex CLI、Cursor 和 Kimi 的 `AGENTS.md` 路由器：

| Claude Code | Codex 等效 |
| ---| ---|
|子代理`@agent-vorcl-flow:frontend` |技能角色`$frontend` + `codex --profile frontend` |
|命令 `/analyzer:audit` |任务技能`$analyzer-audit` |
|命令 `/vorcl` |任务技能`$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` 中的 `config.toml` |
| `SessionStart` 挂钩 | `AGENTS.md` 中的角色路由 |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

有关完整映射，请参阅 [`codex/README.md`](../codex/README.md)。

---

## Cursor

Cursor 使用与 Codex 适配器相同的开放 `SKILL.md` 格式，加上本机自定义子代理和全局 MCP 配置：| Agent-Vorcl-Flow概念| Cursor 等效 |
| ---| ---|
|角色 `backend` | `~/.cursor/agents` 中的自定义子代理 `/avf-backend` |
|任务命令`/backend:create-api` |技能`/backend-create-api` |
|通用`/vorcl` |技能`/vorcl` |
| `.mcp.json` | `~/.cursor/mcp.json` 中合并服务器 |

安装程序将角色定义转换为 Cursor frontmatter，为子代理添加 `avf-` 前缀以避免技能名称冲突，使用 `model: inherit`，并将仅审核代理标记为 `readonly: true`。保留具有相同名称的现有 MCP 服务器条目。参见 [`cursor/README.md`](../cursor/README.md)。

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) 原生加载代理技能、自定义代理文件和生命周期挂钩； AVF 还合并了 Claude 和 Cursor 使用的相同 MCP 服务器：

| Agent-Vorcl-Flow概念| Kimi CLI 等效 |
| ---| ---|
|技能/任务命令| `~/.kimi/skills` 和 `/skill:<name>` |
| Expo定制代理| `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostTool使用守护 |合并为`~/.kimi/config.toml` |
| `.mcp.json` | `~/.kimi/mcp.json` 中合并服务器 |
|每个运行时密钥文件 |共享的 `~/.config/agent-vorcl-flow/.env`（通过启动器）|

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI 在 `mcp.json` 中没有 `${VAR}` 扩展，因此密钥通过启动器来自共享的 `.env` - 与其他运行时完全相同。参见 [`kimi/README.md`](../kimi/README.md)。

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

**如何组合在一起：** `agents/*.md` 声明角色，并在前面的 `skills:` 中附加技能 → `skills/*/SKILL.md` 中的技能通过描述自动加载 → `commands/<agent>/*.md` 提供快速的 `/agent:command` 快捷方式，委托给子代理 → `.mcp.json` 为代理提供工具，每个工具都通过 `bin/mcp-env.mjs` 启动，从共享的 `.env` 加载机密。 `SessionStart` 挂钩告诉 Claude 代理可用。

---

## License

MIT — 免费使用、复制、修改和分发； “按原样”提供，不提供任何保证，也不承担任何责任。参见 [LICENSE](../LICENSE)。

© 2026 Christian Avis (Vorcl)。
