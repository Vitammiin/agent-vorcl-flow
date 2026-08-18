<div align="center">

# Agent-Vorcl-Flow

**기술, 명령 및 MCP 도구를 갖춘 [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) 및 [Kimi CLI](https://github.com/MoonshotAI/kimi-cli)용 전문 AI 하위 에이전트로 구성된 팀**
`npx` 명령 하나로 설치됩니다. 원격 백엔드나 클라우드 호스팅이 필요하지 않습니다. 코딩 에이전트가 모든 것을 로컬에서 실행합니다.

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
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[**한국어**](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 72c33da6cabafc1329d572eb271a485d678403c7f9b5e6a96911fd227cabbc6c. -->

</div>

---

## What is this?

Agent-Vorcl-Flow 지원되는 코딩 에이전트를 **구조화된 엔지니어링 팀**으로 전환합니다. 한 명의 일반 보조자 대신 **25개의 집중 하위 에이전트**(설계자, 코드 기반 수석 설계자, 백엔드, 프런트엔드, Expo 모바일 엔지니어, 제품 및 시각 디자인 엔지니어, DB 엔지니어, 교차 언어 무결성 감사자, 아키텍처 지도 제작자, 라이브보드 운영자 등)가 각각 고유한 도메인 **기술**, 빠른 **슬래시 명령** 및 필요한 **MCP 도구**를 갖습니다. 모든 중요 작업은 엄격한 **Task Master** 루프(*목표 → 작업 → 구현 → 확인 → 완료*)를 통해 실행되므로 작업이 계획되고 추적되며 중단 후에도 살아남습니다.

- 🧩 **25개의 하위 에이전트**, 71개의 스킬, 155개의 슬래시 명령
- ⚡ **한 명령 설치** Claude Code, Codex, Cursor 및/또는 Kimi CLI — `npx`
- 🔌 **11개의 MCP 서버** 유선 연결(GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, 렌더링, 파일 시스템, Task Master, Mermaid)
- 🔑 **모든 런타임에 하나의 `.env` 파일** — `~/.zshrc`가 아닌 실행 프로그램에서 키를 읽으므로 GUI/IDE 실행 시에도 작동합니다. 원격 AVF 서비스가 없습니다. 라이브보드는 로컬호스트 전용이며 일시적입니다.
- 🤝 **동일 소스의 Claude Code, GPT Codex, Cursor 및 Kimi CLI**에서 실행됩니다.

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** 및/또는 **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

플래그를 사용하여 단일 런타임을 타겟팅합니다.

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

설치 프로그램이 하는 일:

| 런타임 | 액션 |
| --- | --- |
| **공유 레이어** | 런처를 `~/.config/agent-vorcl-flow/bin/mcp-env.mjs`에 복사하고 템플릿에서 `~/.config/agent-vorcl-flow/.env`를 생성합니다(한 번). 이는 모든 런타임에 대한 단일 키 파일입니다. |
| **Claude Code** | 이 저장소를 플러그인 **마켓플레이스**로 등록하고 플러그인을 활성화합니다(직접 `~/.claude/settings.json` 대체와 함께 `claude plugin …`를 통해). |
| **GPT Codex** | 스킬을 `~/.agents/skills`로 병합하고 `config.toml` + `AGENTS.md` 블록을 `~/.codex`(멱등성, 마커 사이)로 병합합니다. |
| **Cursor** | `~/.cursor/skills`에 스킬을 설치하고, `~/.cursor/agents`에 기본 사용자 지정 하위 에이전트를 설치하고, 누락된 서버를 `~/.cursor/mcp.json`에 병합합니다. |
| **Kimi CLI** | `~/.kimi/skills`에 스킬을 설치하고, 기본 Expo 사용자 지정 에이전트를 `~/.kimi/agents`에 설치하고, Expo 아키텍처/UI를 모두 `~/.kimi/config.toml`에 연결하고, MCP 서버를 병합합니다. |

> 설치 프로그램은 비밀 정보를 입력하지 않으며 템플릿에서 빈 `.env`만 ​​생성합니다. 여기에 키를 추가합니다([Configuration](#configuration-mcp--keys) 참조).

### Update to the latest version

npm `latest` 태그를 사용하여 설치 프로그램을 다시 실행합니다.

```bash
npx --yes agent-vorcl-flow@latest
```

하나의 런타임만 업데이트하려면 설치 중에 사용한 것과 동일한 런타임 플래그를 유지하십시오.

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

업데이트는 Agent-Vorcl-Flow 관리형 스킬, 에이전트, 후크, 실행 프로그램 및 구성 블록을 오버레이합니다. 기존 `~/.config/agent-vorcl-flow/.env`과 그 비밀을 변경하지 않고 유지하며 업스트림 Firecrawl 기술을 보존합니다. 나중에 업데이트된 코딩 클라이언트를 다시 시작합니다(또는 Claude Code에서 `/reload-plugins` 실행).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

설치 후 **다시 시작 Claude Code**(또는 열려 있는 세션에서 `/reload-plugins` 실행)하여 에이전트를 로드합니다.

---

## How to use

이 섹션의 예에서는 Claude Code 구문을 사용합니다. 기본 구문은 아래의 [Cursor](#cursor) 및 [GPT Codex](#gpt-codex) 매핑을 참조하세요. Claude Code에는 팀을 호출하는 **세 가지 방법**이 있습니다.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` 어떤 하위 에이전트가 작업을 소유해야 하는지 파악하고 전체 Task Master 주기를 구동합니다. `/audit` 백엔드, 프런트엔드, 모바일, 데이터 및 인프라를 자동 감지하고 모든 관련 역할을 사용하여 증거 기반 `PROJECT_AUDIT.md`을 작성합니다. `/init-code`는 저장소를 정적으로 읽고 프로젝트 코드를 실행하지 않고 증거 기반 `PROJECT_DESCRIPTION.md`을 생성합니다. 해당 파일이 존재하면 모든 수정 역할은 영향을 받는 섹션을 동기화된 상태로 유지해야 합니다. 입증된 설명 드리프트가 작업 완료를 차단합니다.

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

또한 모든 에이전트에는 해당 에이전트로 범위가 지정된 Task Master 루프를 실행하는 자체 `/<agent>:vorcl` 진입점이 있습니다.

### The Task Master loop
모든 중요 작업은 **Task Master**(`task-master-ai`)을 통해 진행됩니다.

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```이를 통해 작업을 계속 계획하고, 검사하고, 재개할 수 있습니다. 확인 단계를 통과하지 않으면 아무것도 "완료"라고 선언되지 않습니다.

---

## The agents| 에이전트 | 역할 | 하이라이트 |
| --- | --- | --- |
| 🔵 **건축가** | 시스템 및 솔루션 설계자 | 요구사항 분석, 시스템/DB/API 설계, 아키텍처 검토 |
| 🏛️ **주요 건축가** | 주요 소프트웨어/인프라/AI 아키텍트 | 11개 언어로 실제 코드를 스캔하고 증거 지원 MD, JSON, HTML, PDF, draw.io 및 Mermaid를 생성합니다. 전체 재검색 업데이트로 주석 보존 |
| 🟢 **백엔드** | 백엔드 개발자 | 노드/TS, Postgres, Redis; 모듈식 아키텍처; OpenAPI |
| 🟣 **프런트엔드** | 프런트엔드(React 19 / Next.js 앱 라우터) | 구성 요소, 상태, 데이터 가져오기, 렌더링/번들 최적화, 테스트 |
| 📱 **엑스포-모바일** | React Native + Expo 엔지니어 | 모듈식 아키텍처와 디자인/모션/상호작용 시스템, 기본 탐색, 토큰, 제스처, 햅틱, 모션 감소 |
| 🟠 **분석기** | 코드 감사자(읽기 전용) | 버그, 유형 안전성, DB 구조, 프런트엔드 모의, 백엔드 냄새 |
| 🧭 **무결성** | 언어 간 코드 무결성 감사자(읽기 전용) | 프런트엔드/백엔드/모바일/공유 전반에 걸친 프로덕션 하드코드 및 모의/가짜/데모/픽스처 유출 |
| 🟡 **스웨거** | OpenAPI/Swagger 적용 범위(모든 스택) | 완전히 문서화되지 않은 경로를 찾아서 검증을 통해 포함합니다 |
| 🔴 **폭죽 크롤링** | 웹 연구원 | 라이브 CLI/MCP/REST, 앱 통합 및 완성된 웹 데이터 워크플로우 |
| 🟤 **렌더링** | 호스팅 및 배포(렌더링) | 배포, 로그 기반 진단, 지표, 환경 변수, 렌더링 Postgres |
| 🟦 **데이터베이스** | DB 엔지니어 / DBA | 스키마, 쿼리 및 계획, 인덱스, N+1, 안전한 가역적 마이그레이션, 캐시 |
| ⚪ **탄력성** | 신뢰성: 오류 + 로깅 | 올바른 경계에서 시도/캐치, 입력된 오류, 재시도/시간 초과, 구조화된 로그 |
| 🖼️ **스크린샷** | 스크린샷 UI → 코드 | UI 스크린샷을 프로덕션에 바로 사용할 수 있고 반응성이 뛰어나며 액세스 가능한 코드로 변환 |
| 🎨 **디자인 스튜디오** | 제품 및 시각 디자인 스튜디오 | 로컬 HTML 아티팩트, 프로토타입, 와이어프레임, 데크/PPTX, 문서, 애니메이션, 3D, 디자인 시스템 및 Figma/GitHub/HTML 가져오기; MIT에서 각색됨 👈 |
| 🔎 **시각적 연구** | 스크린샷 → 검증된 답변 | 사이트/페이지를 식별하고, 공식 문서를 찾고, 실시간 데이터를 확인하고 URL과 자신감을 바탕으로 답변 |
| 🎯 **정확히** | 스크린샷 → 기존 프로젝트에 배치(읽기 전용) | 실제 코드베이스(구성 요소, `file:line`, 경로/페이지, 정확한 컨트롤 및 그 뒤에 있는 논리)에서 실행 중인 앱 스크린샷을 기반으로 합니다. 아무것도 생성하지 않고 편집을 위임합니다 |
| 📊 **드로위오** | 다이어그램(draw.io/diagrams.net) | 순서도, BPMN, UML, ERD, 네트워크/클라우드 및 PMP/PMBOK(WBS, Gantt, RACI…) |
| 🗺️ **아치맵** | 건축 지도 제작자 | 결정적 코드 → `architecture.json`(`source:{file,line}`가 있는 모든 노드) → 대화형 HTML map, draw.io, Mermaid, ARCHITECTURE.md, PDF; 입증되지 않은 사실은 `inferred`로 표시 |
| 🧜 **인어** | Mermaid 다이어그램(+ 실제 렌더링) | 순서도, 시퀀스, 클래스, 상태, ER, 간트, gitGraph, 마인드맵… mcp-mermaid/`mmdc`를 통해 검증됨; 파일을 건네줍니다(`.mmd` + SVG/PNG/PDF) |
| 🧪 **테스트** | 테스트 및 검증 엔지니어 | 단위(Vitest/Jest), 통합(Supertest), E2E(Playwright), 적용 범위, 불안정 테스트 헌팅; 각 작업의 `testStrategy`을 실행합니다. 녹색 실행 없이는 아무것도 "완료"되지 않습니다 |
| ❤️ **gitflow** | Git 워크플로 및 릴리스 | 기존 커밋, 이름별 커밋(`git add .` 없음), PR, 변경 로그 유지, semver 릴리스; 명시적인 확인이 있는 경우에만 푸시 |
| 🛡️ **보안** | 보안 감사자(읽기 전용) | 트리 및 Git 기록의 비밀, OWASP 상위 10개, 종속성 CVE, PII; 발견한 내용이 작업이 되며 수정 사항이 위임됩니다 || 📝 **문서** | 문서 엔지니어 | README(다중 언어 패리티), OpenAPI의 API 문서, 아키텍처, 기여, 릴리스 노트; 코드에 대해 확인된 모든 예제 |
| 🐳 **데브옵스** | 컨테이너 및 CI/CD | 다단계 Dockerfile, 로컬 개발을 위한 docker-compose, GitHub 작업 파이프라인, 환경/비밀 위생, 모니터링 |
| 📡 **라이브보드** | 지역운영위원회 | 임시 로컬 호스트 대시보드에서 라이브 Git 작업 트리, 에이전트 프로세스 및 Task Master 작업 |

**알아두어야 할 몇 가지 사항:**
- **프런트엔드는 항상 실제 API와 대화합니다.** 백엔드의 OpenAPI 사양은 정보의 단일 소스입니다. 유형은 여기에서 생성됩니다(`openapi-typescript` + `openapi-fetch`). 생산 경로에 모의가 없습니다.
- **`database` 돌연변이에는 명시적인 확인이 필요합니다.** 분석은 읽기 전용입니다. 스키마/데이터 변경(DDL/DML/마이그레이션)은 사전 승인 없이는 실행되지 않습니다.
- **`resilience` 안전 고리가 함께 제공됩니다.** 비차단 `PostToolUse` 고리(`catch-guard.js`)는 방금 편집한 파일의 빈 `catch {}` 블록에 플래그를 부드럽게 표시합니다.
- **`archmap` 결코 상상에서 나오지 않습니다.** 추출과 렌더링은 엄격하게 분리됩니다. 종속성이 없는 스크립트는 저장소를 `architecture.json`(실제 FK 카디널리티가 있는 데이터베이스, API 경로, 모델/도구/메모리가 있는 AI 에이전트, 가져오기 그래프, 환경)로 이동하고 모든 다이어그램은 해당 JSON에서만 렌더링됩니다. 검증 가능한 `file:line` 없이 LLM이 추가하는 모든 항목에는 강제로 `inferred:true` 표시가 표시되고 점선이 그려집니다.
- **`principal-architect`는 전체 아키텍처 게시 워크플로우입니다.** 에이전트를 실행하는 저장소에서 작동하고, 토폴로지 증거로 Markdown 주장을 무시하고, TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin 및 Swift용 번들 오프라인 Tree-sitter WASM을 사용하고, `ARCHITECTURE.md`를 먼저 쓴 다음, 공유 JSON 모델, 자체 포함 HTML, PDF, 기본 draw.io 및 복사 가능 Mermaid을 생성합니다. L0~L4. `update` 전체 재검색을 수행하고 주석과 관리되지 않는 파일을 보존합니다.
- **`pinpoint` 찾기만 하고 절대 만들지 않습니다.** 실행 중인 앱의 스크린샷이 주어지면 화면을 실제 코드(구성 요소, 경로, 정확한 제어 및 그 뒤에 있는 논리)에 매핑하고 편집 내용을 `frontend`/`backend`에 전달합니다. 이미 존재하는 것(`screenshot`의 반대)에 작동합니다.
- **`visual-research` 추측 대신 확인합니다.** 스크린샷을 증거로 취급하고, 공식 도메인 및 문서를 확인하고, 현재 사이트 데이터를 확인하고, 피싱 가능성이 있거나 오래된 값에 플래그를 지정합니다.
- **`i18n`는 "제로 언어 하드코딩"을 시행합니다.** 에이전트는 먼저 프로젝트가 다국어인지 여부를 감지하고 이에 적응합니다. 사용자가 접하는 문자열은 번역 계층(next-intl/react-i18next/i18next)을 통과하며 인라인으로 전달되지 않습니다.

---

## Command reference아래의 모든 명령은 슬래시 명령입니다. `<…>`는 입력 내용을 표시합니다.

### `/vorcl` — universal router
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/vorcl <goal>` | 모든 목표를 작업으로 전환하고 이를 올바른 하위 에이전트에 라우팅한 다음 전체 주기를 실행하여 완료합니다. |
| `/audit [path] [focus]` | 심층적인 읽기 전용 다중 역할 감사 → 감지된 시스템, 보안/CVE/복원력 조사 결과, 대상 아키텍처 및 단계별 `PROJECT_AUDIT.md`. |
| `/init-code [path] [--update]` | 정적 코드베이스 발견 → 증거 기반 `PROJECT_DESCRIPTION.md`; 프로젝트 코드는 실행되지 않습니다. |

### 🔵 architect — architecture
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/architect:vorcl <goal>` | 목표 → 작업 → 주기, 아키텍처 범위. |
| `/architect:analyze <context>` | 요구 사항과 작업 컨텍스트를 분석합니다. |
| `/architect:design <problem>` | 솔루션 아키텍처(시스템, DB, API)를 설계합니다. |
| `/architect:review <target>` | 기존 아키텍처를 검토합니다. |

### 🏛️ principal-architect — code-grounded architecture package
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Task Master 및 검증된 아티팩트를 통해 대규모 아키텍처 목표를 실행합니다. |
| `/principal-architect:create [options]` | 현재 저장소를 스캔하고 코드 증거에서 MD, JSON, HTML, PDF, draw.io 및 Mermaid를 생성합니다. |
| `/principal-architect:update [options]` | 기존 패키지를 전체 다시 검색하고, 증거 차이점을 작성하고, 생성된 아티팩트를 원자적으로 새로 고칩니다. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/backend:vorcl <goal>` | 목표 → 작업 → 백엔드 작업 주기. |
| `/backend:create-api <endpoint>` | OpenAPI에 완전히 포함되는 모듈식 아키텍처에서 API 끝점을 생성합니다. |
| `/backend:refactor <target>` | 동작을 변경하지 않고 코드를 리팩터링합니다. |
| `/backend:optimize <target>` | 성능 최적화. |
| `/backend:test <target>` | 코드에 대한 테스트를 생성합니다. |

### 🟣 frontend — React / Next.js
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/frontend:vorcl <goal>` | 목표 → 작업 → 프런트엔드 작업 주기입니다. |
| `/frontend:create-component <spec>` | 특징 구조에 따라 UI 성분을 생성합니다. |
| `/frontend:refactor <target>` | 동작을 변경하지 않고 UI / 후크를 리팩터링합니다. |
| `/frontend:optimize <target>` | 렌더링/번들/코어 웹 바이탈을 최적화합니다. |
| `/frontend:test <target>` | 구성 요소 테스트를 생성합니다. |

### 📱 expo-mobile — React Native / Expo

| 명령 | 그것이 하는 일 |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | 목표 → Expo 모바일 작업을 위한 Task Master 주기. |
| `/expo-mobile:create-module <domain>` | 복잡성에 필요한 레이어만으로 모듈식 비즈니스 슬라이스를 생성하세요. |
| `/expo-mobile:create-screen <flow>` | 얇은 Expo Router 경로와 모듈 소유 화면 및 상태를 만듭니다. |
| `/expo-mobile:design-screen <flow>` | 공유된 디자인/모션 토큰, 상태 및 접근성을 갖춘 프리미엄 화면을 구축하세요. |
| `/expo-mobile:motion <interaction>` | 기본 탐색, 스프링, 제스처, 촉각 및 모션 감소 폴백을 디자인합니다. |
| `/expo-mobile:add-api <contract>` | 스키마/DTO/매퍼/쿼리 키 및 TanStack Query 통합을 추가합니다. |
| `/expo-mobile:audit [scope]` | 읽기 전용 아키텍처 보호 및 증거 기반 감사. |
| `/expo-mobile:ui-audit [scope]` | 읽기 전용 디자인 시스템, 모션, 상호 작용, 접근성 및 성능 감사. |
| `/expo-mobile:compatibility [app] [change]` | 버전이 지정된 공식 소스에 대한 실시간 읽기 전용 Expo/RN/노드/패키지/네이티브 런타임 호환성 감사. |
| `/expo-mobile:test <scope>` | 도메인 단위, React Native 테스트 라이브러리 및 Maestro 검사를 실행합니다. |

### 🟠 analyzer — code audit (read-only)
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/analyzer:vorcl <goal>` | Task Master를 통해 목표를 감사합니다. 결과가 작업이 됩니다. |
| `/analyzer:audit` | 전체 감사: 버그, 유형, DB, 프런트엔드 모의, 백엔드 냄새. |
| `/analyzer:bugs` | 버그 사냥 — 처리되지 않은 오류, 경쟁 조건, 극단적인 경우. |
| `/analyzer:types` | 유형 확인 — `tsc`, `any`, 안전하지 않은 캐스트, zod←유형 드리프트. |
| `/analyzer:db` | 감사 DB 구조 — 스키마, 인덱스, FK, N+1, 마이그레이션. |
| `/analyzer:mocks` | 프런트엔드와 백엔드의 모의/가짜 데이터에 대한 호환성 경로 심층적인 다중 언어 검사를 무결성에 위임합니다. |
| `/analyzer:backend` | "잘못된" 백엔드 코드(아키텍처 위반, 컨트롤러의 논리)를 찾습니다. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)| 명령 | 그것이 하는 일 |
| --- | --- |
| `/integrity:vorcl <goal>` | Task Master를 통해 중요한 무결성 목표를 실행하고 결과를 소유자별 작업으로 전환합니다. |
| `/integrity:audit [path]` | 하드코드와 모의 누출을 함께 스캔한 다음 프로덕션 도달성을 입증합니다. |
| `/integrity:hardcode [path]` | 현지화, 구성 또는 기록 시스템을 우회하는 사용자/구성/비즈니스 리터럴을 찾습니다. |
| `/integrity:mocks [path]` | 프로덕션에서 도달할 수 있는 모의 프레임워크, 가짜 생성기, 고정 장치, 데모 데이터 및 정적 응답을 찾습니다. |

번들로 제공되는 종속성 없는 스캐너는 TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML 및 Razor를 지원합니다. 백엔드 코드에서는 상수, 정적/최종 필드, 기본 매개변수, 명명된 인수 및 정적 카탈로그에 숨겨진 비즈니스 가치에 플래그를 지정합니다. 그런 다음 감사자는 이를 스키마/모델/저장소/쿼리/관리 변형과 비교하여 코드나 구성이 아닌 데이터베이스가 값을 소유하고 있음을 증명합니다. 테스트, 픽스처, 스토리, 예제, 시드, 생성된 코드 및 공급업체 루트는 기본적으로 표시되지 않습니다. 어휘 후보는 도달 가능성과 소유권이 입증될 때까지 결함이 아닙니다.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/swagger:vorcl <goal>` | Task Master를 통한 전체 적용 범위 — 감사 → 작업 → 적용 → 확인. |
| `/swagger:audit` | 읽기 전용: 사양에서 완전히 다루지 않는 경로를 찾습니다. |
| `/swagger:cover <route>` | 경로/모듈을 커버합니다 — 매개변수, 응답, 설명, 보안 + 검증. |

### 🔴 firecrawl — web research
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Task Master를 통한 연구 목표 — 웹 데이터를 수집하여 완성된 결과를 얻습니다. |
| `/firecrawl:search <query>` | 질문에 대한 출처를 웹에서 검색합니다. |
| `/firecrawl:scrape <url>` | 하나의 URL을 markdown/JSON로 스크랩하세요. |
| `/firecrawl:map <url>` | 사이트의 URL을 매핑합니다. |
| `/firecrawl:crawl <url>` | 섹션/사이트를 재귀적으로 크롤링합니다. |
| `/firecrawl:extract <url>` | JSON 스키마로 구조화된 추출. |
| `/firecrawl:setup` | 설치/확인 CLI 및 공식 빌드 및 작업 흐름 기술(확인 포함). |
| `/firecrawl:interact <url>` | 스크랩이 충분하지 않은 경우 양식을 클릭하거나 탐색하거나 채웁니다. |
| `/firecrawl:parse <file>` | 로컬/개인 문서를 마크다운 또는 JSON로 구문 분석합니다. |
| `/firecrawl:monitor <action>` | 반복되는 페이지 변경 모니터를 확인하거나 관리합니다. |
| `/firecrawl:agent <goal>` | 제한된 장기 실행 Firecrawl Agent 작업을 실행합니다. |
| `/firecrawl:research <query>` | 논문 및 GitHub 연구 맥락을 검색합니다. |
| `/firecrawl:ask <jobId>` | 실패한 Firecrawl 작업을 진단합니다. |
| `/firecrawl:docs-search <question>` | 현재 공식 Firecrawl 문서를 검색하세요. |
| `/firecrawl:integrate <feature>` | 업스트림 빌드 기술을 통해 애플리케이션 코드에 Firecrawl를 추가합니다. |
| `/firecrawl:deliverable <artifact>` | 개요, 감사, 리드 목록 또는 기타 워크플로 아티팩트를 생성합니다. |`/firecrawl:setup`는 확인 후에만 공식적인 `firecrawl-cli init --all` 흐름을 실행합니다. 기존의 공식 `firecrawl-*` 기술이 우선권을 가지며 Codex/Cursor 설치 프로그램에 의해 보존됩니다. AVF는 누락된 기술에 대해 호환 가능한 대체 기능을 제공합니다. 실시간 운영 경로는 CLI → MCP → REST/keyless를 통해 이루어집니다.

### 🟤 render — hosting / deploy (Render)
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/render:vorcl <goal>` | Task Master를 통한 인프라 목표 — 배포/진단/구성 완료. |
| `/render:deploy <service>` | 서비스를 배포/재배포합니다. |
| `/render:logs <service>` | 근본 원인까지 서비스 로그 및 진단을 수행합니다. |
| `/render:status <service>` | 서비스 상태 + 배포 + 지표. |
| `/render:query <sql>` | Render Postgres에 대한 읽기 전용 SQL. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/database:vorcl <goal>` | Task Master를 통한 데이터 목표 — 스키마/쿼리/마이그레이션/캐시 완료. |
| `/database:query <query>` | 읽기 전용 쿼리/분석. |
| `/database:schema <target>` | 스키마 및 데이터 무결성을 설계/검토합니다. |
| `/database:migrate <change>` | 안전하고 되돌릴 수 있는 스키마/데이터 마이그레이션을 계획합니다. |
| `/database:optimize <target>` | 최적화 — 인덱스, N+1, 쿼리 계획, 페이지 매김. |
| `/database:cache <target>` | Redis — TTL, 무효화, 잠금, 속도 제한, 스트림. |

### ⚪ resilience — error handling + logging
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/resilience:vorcl <goal>` | Task Master를 통한 신뢰성 목표 — try/catch + 로그가 포함된 커버 코드. |
| `/resilience:harden <target>` | 자동 실패 없이 견고한 로깅을 사용하여 try/catch/finally로 코드를 래핑합니다. |
| `/resilience:logging <target>` | 구조화된 로깅을 추가/수정합니다. 수준, 컨텍스트, 비밀/PII 없음. |
| `/resilience:audit` | 읽기 전용: 자동 실패, 빈 캐치, 로깅 간격을 찾습니다. |

### 🖼️ screenshot — screenshot UI → code
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/screenshot:vorcl <goal>` | Task Master — 분석 → 코드를 통한 스크린샷의 화면 세트. |
| `/screenshot:analyze <image>` | 읽기 전용 분석 — 레이아웃, 구성 요소, 토큰, 상태 → 계획. |
| `/screenshot:convert <image> [framework]` | 스크린샷에서 전체 실행 가능한 코드를 생성합니다(기본값 React + Tailwind v4). |
| `/screenshot:tokens <image>` | 디자인 토큰(OKLCH 색상, 타이포그래피, 간격)을 Tailwind `@theme`로 추출합니다. |
| `/screenshot:responsive <target>` | 생성된 UI를 반응형으로 만듭니다(중단점, 유동, `clamp()`, 컨테이너 쿼리). |

### 🎨 design-studio — product and visual design
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/design-studio:vorcl <goal>` | Task Master — 컨텍스트 → 변형 → HTML → 미리보기 → 확인 → 내보내기를 통한 전체 디자인 목표. |
| `/design-studio:create <brief>` | 세련된 독립형 시각적 가공물 또는 하이파이 UI를 만들어 보세요. |
| `/design-studio:prototype <flow>` | 상태와 전환이 포함된 대화형 웹/모바일 프로토타입을 구축합니다. |
| `/design-studio:wireframe <flow>` | 정보 아키텍처와 UX에 초점을 맞춘 low-fi 와이어프레임을 구축하세요. |
| `/design-studio:design-system <operation>` | 디자인 시스템을 생성, 가져오기, 컴파일, 바인딩, 새로 고침 또는 확인합니다. |
| `/design-studio:import <type> <source>` | 출처와 함께 Figma `.fig`, GitHub 또는 HTML/CSS를 가져옵니다. |
| `/design-studio:deck <brief>` | 발표자 노트, 애니메이션 및 편집 가능한 PPTX(선택 사항)를 사용하여 HTML 데크를 만드세요. |
| `/design-studio:document <brief>` | 인쇄 가능한 문서, 이력서, 메모, 한 페이지 분량의 보고서 또는 보고서를 작성하세요. |
| `/design-studio:animation <brief>` | 모션 아티팩트를 구축하고 선택적으로 MP4로 렌더링합니다. |
| `/design-studio:research <question>` | 소스 기반의 시각적 연구 아티팩트를 만듭니다. |
| `/design-studio:export <project> <format>` | 독립형 HTML, PDF, PPTX, MP4 또는 핸드오프 형식으로 내보냅니다. |
| `/design-studio:review <target>` | 읽기 전용 비주얼, UX, 반응형, a11y 및 디자인 시스템 검토. |

### 🔎 visual-research — screenshot → verified web answer
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/visual-research:vorcl <goal>` | Task Master를 통한 다단계 스크린샷 조사. |
| `/visual-research:identify <image>` | 신뢰할 수 있는 증거로 사이트, 페이지 및 기능을 식별합니다. |
| `/visual-research:search <image> <target>` | 시각적 단서에서 실제 페이지나 공식 문서를 찾으세요. |
| `/visual-research:answer <image> <question>` | 스크린샷 증거, 공식 문서 및 현재 라이브 데이터를 사용하여 답변하세요. |
| `/visual-research:hints <image> <goal>` | 눈에 보이는 인터페이스를 위해 안전하고 문서로 뒷받침되는 단계를 제공하세요. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Task Master를 통해 스크린샷에서 기존 UI 찾기/이해/변경 — 지도 → 작업 → 위임. |
| `/pinpoint:locate <image>` | 스크린샷에서 기존 구성 요소/파일을 찾습니다 — `file:line`, 새 코드는 없습니다. |
| `/pinpoint:route <image>` | 화면이 있는 경로/페이지를 식별합니다(Next.js 앱/페이지 라우터, React 라우터). |
| `/pinpoint:control <image>` | 코드에서 정확한 컨트롤(버튼/필드)과 해당 핸들러를 찾아냅니다. |
| `/pinpoint:trace <target>` | 핸들러 → 상태 → 데이터 가져오기 → API 요소 뒤에 있는 논리를 추적합니다. || `/pinpoint:handoff <change>` | 기존 코드에 대해 정확한 편집 요청을 작성하고 `frontend`/`backend`에 위임합니다. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/drawio:vorcl <goal>` | Task Master를 통한 다이어그램 세트 — 빌드 완료. |
| `/drawio:create <description> [type]` | 텍스트 설명(유효한 기본 XML)에서 다이어그램을 작성합니다. |
| `/drawio:pmp <type> <project>` | PMP/PMBOK 다이어그램(WBS, PERT/CPM, Gantt, RACI, 위험 매트릭스, 이해관계자 그리드)을 구축합니다. |
| `/drawio:convert <source> [type]` | 소스를 다이어그램으로 변환 — DB 스키마 → ERD, 폴더 → 트리, 코드 → UML, mermaid/CSV/JSON. |
| `/drawio:refine <file>` | 기존 `.drawio` 수정 — 레이아웃, 테마, 노드 추가/제거, 그리드에 정렬. |

### 🗺️ archmap — architecture map from code| 명령 | 그것이 하는 일 |
| --- | --- |
| `/archmap:vorcl <goal>` | Task Master를 통한 매핑 목표 — 검증된 아티팩트 세트로 빌드합니다. |
| `/archmap:map [repo]` | 전체 파이프라인: 추출 → `architecture.json` → LLM 주석 → 모든 형식(HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | 추출만 — 모든 노드에서 `source:{file,line}`를 사용하여 기계 판독 가능한 `architecture.json`입니다. |
| `/archmap:annotate [json]` | 기존 `architecture.json`(에이전트 메모리, 데이터 흐름 의미론)의 LLM 강화 입증되지 않은 사실은 자동으로 `inferred`로 강등됩니다. |
| `/archmap:html [json]` | 독립적인 대화형 HTML 맵 — 레이어 토글, 트레이스 빔, 노드 → `file:line` 패널, 검색, CSS 인쇄. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io(다중 페이지: 개요 / ERD / API / 에이전트) 및/또는 Mermaid 보기가 검증되었습니다. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/mermaid:vorcl <goal>` | Task Master를 통한 다이어그램 세트 - 완료까지 빌드(렌더링 확인). |
| `/mermaid:create <description> [type]` | 설명을 바탕으로 다이어그램을 작성합니다. 실제 렌더링으로 검증된 유효한 구문입니다. 파일을 건네줍니다. |
| `/mermaid:convert <source> [type]` | 소스를 Mermaid — DB 스키마 → ER, 코드 → 클래스/시퀀스, 폴더 → 흐름도, `.drawio`/CSV/JSON로 변환합니다. |
| `/mermaid:validate <file>` | 구문 + 실제 렌더링 테스트; 오류(mmdc / Maid / mcp-mermaid)를 찾아서 수정하세요. |
| `/mermaid:render <file> [format] [theme]` | SVG/PNG/PDF(mermaid-cli / Kroki / Mermaid.ink)로 내보냅니다. |
| `/mermaid:refine <file>` | 방향, 하위 그래프, 클래스 정의/스타일, 가독성 등 기존 `.mmd`를 개선합니다. |

### 🧪 testing — tests & verification
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/testing:vorcl <goal>` | Task Master — 단위 + 통합 + e2e를 통한 테스트/검증 목표가 완료되었습니다. |
| `/testing:unit <file\|module>` | 단위 테스트(Vitest/Jest) — 행복한 경로, 경계, 오류; 실행하고 출력을 보여줍니다. |
| `/testing:integration <endpoint\|module>` | 통합 테스트(Supertest/inject, real DB 또는 testcontainers). |
| `/testing:e2e <scenario>` | Playwright 중요한 사용자 경로를 위한 E2E - 역할 선택기, 고정 장치, 실패 추적. |
| `/testing:verify <task\|testStrategy>` | 작업의 `testStrategy`을 실행하고 실제 출력과 함께 READY/NOT READY 결과를 반환합니다. |
| `/testing:coverage [path]` | 조사 결과가 포함된 적용 범위 보고서 - 테스트되지 않은 중요한 코드는 무엇입니까? 작업을 생성합니다. |
| `/testing:flaky <test>` | 불안정한 테스트(인종, 타이밍, 공유 상태, 모의)를 진단하고 영구적으로 수정합니다. |

### 🌿 gitflow — git workflow & releases
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/gitflow:vorcl <goal>` | Task Master를 통한 git/release 목표(릴리스 준비, 기록 정리, 기능 분기). |
| `/gitflow:commit <files\|scope>` | Conventional Commits 메시지가 포함된 이름별 커밋(`git add .`은 안 됨) 알 수 없는 WIP에서 중지됩니다. |
| `/gitflow:pr <base> <title>` | 무엇을/왜/어떻게 검증했는지 분기 → 커밋 → 풀 요청(gh / GitHub MCP). |
| `/gitflow:changelog [version]` | 태그 간 커밋에서 생성된 CHANGELOG.md(변경 로그 유지) |
| `/gitflow:release <version\|auto>` | 커밋의 Semver → 매니페스트 버전 동기화 → 태그 → GitHub 릴리스. 명시적으로 확인한 후에만 푸시하세요. |
| `/gitflow:audit [branch]` | 읽기 전용 기록 감사: 규칙 위반, 덤프 커밋, 큰 덩어리, 고아 분기. |

### 🛡️ security — security audit (read-only)
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/security:vorcl <goal>` | Task Master를 통한 보안 목표 — 감사 → 발견 사항 → 작업 → 수정 위임. |
| `/security:secrets [path\|branch]` | 작업 트리 및 git 기록(모든 분기)의 비밀 `${VAR:-}` 자리 표시자는 비밀이 아닙니다. |
| `/security:owasp [path]` | 코드의 OWASP 상위 10개: 삽입, XSS, 인증, 데이터 노출, CORS/쿠키 — 파일:라인 증명 포함. |
| `/security:deps` | npm 감사/잠금 파일을 통한 종속성 CVE — 심각도, 주요 변경 플래그. |
| `/security:pii [path]` | PII/GDPR 위험: 이메일, 전화, 코드 및 로그에 포함된 카드 개발자의 개인 경로. |
| `/security:pre-push [branch]` | 푸시 전에 변경된 파일을 빠르게 결합하여 확인: 비밀 + 주입 + PII; 녹색/빨간색 평결. |

### 📝 docs — documentation
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/docs:vorcl <goal>` | Task Master를 통한 문서화 목표. |
| `/docs:readme [path]` | README 생성/업데이트 — what/quickstart/usage/config/troubleshooting; 검증된 사례; 언어 버전이 동기화되었습니다. |
| `/docs:api [spec]` | API 사양에서 생성된  문서(엔드포인트, 매개변수, 컬 예제) 사양이 없으면 `/swagger:audit`를 제안합니다. |
| `/docs:architecture` | ARCHITECTURE.md — 모듈, 경계, 데이터 흐름; `mermaid`/`drawio`에 위임된 다이어그램. || `/docs:contributing` | CONTRIBUTING.md — 설정, 구조, 테스트, 커밋 규칙(`gitflow`에 맞춰 정렬), PR 프로세스. |
| `/docs:release-notes <version>` | CHANGELOG/history의 버전에 대한 릴리스 노트입니다. |
| `/docs:audit` | 읽기 전용 문서⇔코드 드리프트 검사: 끊어진 링크, 오래된 예제/카운터, 동기화되지 않은 번역. |

### 🐳 devops — containers & CI/CD
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/devops:vorcl <goal>` | Task Master를 통한 인프라 목표. |
| `/devops:dockerfile [app-type]` | Dockerfile 작성/검토 — 다단계, 슬림 베이스, 비루트, HEALTHCHECK; 실제 `docker build`로 확인되었습니다. |
| `/devops:compose` | 로컬 개발(앱 + DB)용 docker-compose.yml; 환경 변경에는 `--force-recreate`이 필요하며 정상 상태가 될 때까지 기다립니다. |
| `/devops:ci [type]` | GitHub 작업 — PR 워크플로(lint+typecheck+test, npm 캐시), 배포 워크플로, 최소 권한. |
| `/devops:env` | Env-변수 인벤토리: 읽은 위치, 필요한 내용, `.env.example` 템플릿; 이미지에는 절대 없는 비밀입니다. |
| `/devops:monitoring` | 구조화된 로그(pino/JSON), 상태 엔드포인트, 경고 대상 `render` 에이전트를 통해 측정항목을 렌더링합니다. |

### 📡 liveboard — ephemeral local operations board
| 명령 | 그것이 하는 일 |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | 무료 로컬 호스트 포트에서 세련된 43개 언어 대시보드를 시작하세요. Task Master SSE를 통해 스트림을 변경하고 5분마다 조정합니다. |
| `/liveboard:vorcl <goal>` | 필수 Task Master 워크플로를 통해 라이브보드 자체를 개발하거나 변경합니다. |

Liveboard는 Git 작업 트리, 로컬 Claude/Codex/Cursor 프로세스 및 각 작업 트리의 `.taskmaster/tasks/tasks.json`를 읽습니다. 런타임 상태는 메모리에 유지되며 포그라운드 프로세스가 중지되면 사라집니다. UI는 브라우저 언어를 감지하고 영어, 러시아어, 우크라이나어, 독일어, 프랑스어, 스페인어, 포르투갈어, 이탈리아어, 폴란드어, 터키어, 중국어, 일본어, 아랍어, 네덜란드어, 체코어, 슬로바키아어, 루마니아어, 헝가리어, 불가리아어, 세르비아어, 크로아티아어, 슬로베니아어, 그리스어, 히브리어, 페르시아어, 힌디어, 벵골어, 우르두어, 인도네시아어, 말레이어, 베트남어, 태국어, 한국어, 스웨덴어, 노르웨이어, 덴마크어, 핀란드어, 에스토니아어, 라트비아어, 리투아니아어, 그루지야어, 아르메니아어, 아제르바이잔어. 아랍어, 히브리어, 페르시아어, 우르두어는 RTL 레이아웃을 사용합니다.

직접 구성:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: Git 작업 트리와 Task Master 파일이 스캔되는 프로젝트입니다.
- `--port 0`: 사용 가능한 포트를 자동으로 선택합니다.
- `--interval`: 전체 조정 간격(밀리초) 스틸 스트림을 보는 파일 Task Master은 즉시 변경됩니다.
- 끝점: `/health`, `/api/snapshot`, `/api/events`(SSE) 및 `POST /api/refresh`.
- 프로젝트 정보를 네트워크에 명시적으로 노출하려는 의도가 아니라면 `--host 127.0.0.1`를 유지하세요.

---

## Configuration (MCP & keys)

패키지에 **원격 백엔드 또는 데이터베이스가 없습니다**. 선택적 라이브보드는 로컬호스트 전용 인메모리 프로세스입니다. MCP 서버에는 토큰이 필요하며 **각 사용자는 자신의 토큰을 제공**합니다. **Claude Code, Codex, Cursor 및 Kimi CLI**에서 이 작업을 동일하게 수행하려면 터미널에서 시작하든 Dock/Spotlight/IDE에서 시작하든 관계없이 모든 stdio MCP 서버는 **하나의 파일**에서 키를 읽는 작은 실행 프로그램(`bin/mcp-env.mjs`)을 통해 시작됩니다.

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

설치 프로그램이 [`.env.example`](../.env.example)에서 이를 생성합니다. 그것을 열고 사용하는 키만 입력하십시오:

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

> **`~/.zshrc` 대신 런처가 필요한 이유는 무엇입니까?** Env-var 확장은 런타임마다 다르며(`${VAR:-}`는 Claude, `${env:VAR}`는 Cursor, 리터럴은 Codex/Kimi) 각 런타임은 **실행된** 환경만 읽습니다. macOS에서 GUI/IDE 실행은 `~/.zshrc`을 소스하지 않으므로 내보낸 키는 보이지 않으며 서버는 아무데도 연결되지 않습니다. 이는 전형적인 "MCP 환경이 설정되지 않음" 오류입니다. 하나의 `.env` 파일을 읽으면 두 가지 문제가 동시에 제거됩니다.

**우선순위**(나중에 우선): 공유 `~/.config/agent-vorcl-flow/.env` → 프로젝트 루트의 `./.env` → 셸의 실제 `export`. 공유 파일에 전역 키를 유지하고 프로젝트별(예: 다른 `MONGODB_URI`)을 프로젝트 `.env`로 재정의하면 실제 쉘 내보내기가 CLI 실행에서 여전히 승리합니다. `AGENT_VORCL_ENV_FILE=/path/.env`를 사용하여 실행 프로그램이 다른 파일을 가리키도록 할 수 있습니다.필요한 키가 누락된 서버는 단순히 **시작되지 않습니다**. 런타임의 MCP 로그에 한 줄의 `[agent-vorcl-flow] MCP «…» is not configured: …`가 표시되고 다른 모든 서버는 계속 작동합니다. `.env`에 키를 추가하고 다시 시작하세요. (`GITHUB_TOKEN`/`MONGODB_URI` 이름을 유지할 수 있습니다. 런처는 해당 이름을 서버가 예상하는 `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING`에 매핑합니다.)

> ⚠️ **AI 기반 Task Master 명령에 필요:** 선택한 공급자를 하나 이상 구성합니다( Claude의 경우 `ANTHROPIC_API_KEY`, GPT의 경우 `OPENAI_API_KEY` 또는 Codex CLI OAuth). `.taskmaster/config.json`에서 선택한 모델에 대한 자격 증명이 없으면 `/vorcl`는 작업을 생성하거나 확장할 수 없습니다.

실제로 생성을 실행하는 Task Master 공급자를 선택하세요. 키만으로는 모델을 선택할 수 없습니다.

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

이 명령은 공식 `task-master models` 흐름을 사용하고 `.taskmaster/config.json`에 모델 선택만 저장합니다. `PERPLEXITY_API_KEY`는 선택 사항이며 Perplexity가 연구 모델로 선택된 경우에만 필요합니다.

원격 **vercel** 및 **렌더링** 서버는 OAuth를 사용합니다(브라우저에서 `/mcp`로 승인). Headless/CI의 렌더링의 경우 환경에서 `RENDER_API_KEY`를 설정하고 런타임을 위해 해당 서버에 Bearer 헤더 항목을 추가합니다.

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

이제 저장소에는 `.codex-plugin/plugin.json`에 기본 Codex 플러그인 매니페스트가 포함되어 있습니다. npm 설치 프로그램은 계속 사용 가능하며 **기술**, **프로필** 및 Codex CLI, Cursor 및 Kimi에 대한 `AGENTS.md` 라우터와 동일한 기능을 설치합니다.

| Claude Code | Codex 상당 |
| --- | --- |
| 하위 에이전트 `@agent-vorcl-flow:frontend` | 스킬 페르소나 `$frontend` + `codex --profile frontend` |
| 명령 `/analyzer:audit` | 작업 스킬 `$analyzer-audit` |
| 명령 `/vorcl` | 작업 기술 `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` `config.toml` |
| `SessionStart` 후크 | `AGENTS.md`의 역할 라우팅 |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

전체 매핑은 [`codex/README.md`](../codex/README.md)를 참조하세요.

---

## Cursor

Cursor는 Codex 어댑터와 동일한 개방형 `SKILL.md` 형식과 기본 사용자 정의 하위 에이전트 및 전역 MCP 구성을 사용합니다.

| Agent-Vorcl-Flow 컨셉 | Cursor 상당 |
| --- | --- |
| 역할 `backend` | `~/.cursor/agents`의 사용자 정의 하위 에이전트 `/avf-backend` |
| 작업 명령 `/backend:create-api` | 스킬 `/backend-create-api` |
| 만능 `/vorcl` | 스킬 `/vorcl` |
| `.mcp.json` | `~/.cursor/mcp.json`의 병합된 서버 |

설치 프로그램은 역할 정의를 Cursor 머리말로 변환하고, 스킬 이름 충돌을 방지하기 위해 하위 에이전트 앞에 `avf-`를 붙이고, `model: inherit`를 사용하고, 감사 전용 에이전트를 `readonly: true`로 표시합니다. 동일한 이름을 가진 기존 MCP 서버 항목은 유지됩니다. [`cursor/README.md`](../cursor/README.md)를 참조하세요.

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)(MoonshotAI)는 기본적으로 에이전트 기술, 사용자 지정 에이전트 파일 및 수명 주기 후크를 로드합니다. AVF는 또한 Claude 및 Cursor에서 사용하는 것과 동일한 MCP 서버를 병합합니다.

| Agent-Vorcl-Flow 컨셉 | Kimi CLI 상당 |
| --- | --- |
| 기술/작업 명령 | `~/.kimi/skills` 및 `/skill:<name>` |
| Expo 맞춤형 에이전트 | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostTool 가드 사용 | `~/.kimi/config.toml` |
| `.mcp.json` | `~/.kimi/mcp.json`에 병합된 서버 |
| 런타임별 키 파일 | 공유 `~/.config/agent-vorcl-flow/.env`(런처를 통해) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI에는 `mcp.json`에 `${VAR}` 확장이 없으므로 키는 다른 런타임과 마찬가지로 런처를 통해 공유된 `.env`에서 나옵니다. [`kimi/README.md`](../kimi/README.md)를 참조하세요.

---

## Project structure

```text
.claude-plugin/plugin.json      # plugin manifest
.claude-plugin/marketplace.json # local marketplace (for install)
agents/       25 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (71 skills; some ship references, scripts, tests or HTML assets)
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

**함께 맞추는 방법:** `agents/*.md` 역할 선언 및 서문 `skills:`에서 기술 연결 → `skills/*/SKILL.md`의 기술은 설명에 의해 자동 로드됩니다. → `commands/<agent>/*.md` 하위 에이전트에 위임하는 빠른 `/agent:command` 단축키 제공 → `.mcp.json`는 에이전트에게 도구를 제공하며, 각각은 공유 `.env`에서 비밀을 로드하는 `bin/mcp-env.mjs`를 통해 시작됩니다. `SessionStart` 후크는 Claude 상담원이 통화 가능함을 알려줍니다.

---

## License

MIT — 무료로 사용, 복사, 수정 및 배포할 수 있습니다. "있는 그대로" 제공되며 어떠한 보증이나 책임도 없습니다. [LICENSE](../LICENSE)를 참조하세요.

© 2026 크리스티안 아비스(Vorcl).
