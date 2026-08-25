<div align="center">

# Agent-Vorcl-Flow

**スキル、コマンド、ツールを備えた、[Claude Code](https://claude.com/claude-code)、[GPT Codex](https://developers.openai.com/codex/cli/)、[Cursor](https://cursor.com/)、および [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) に特化した AI サブエージェントのチーム。**
1 つの `npx` コマンドでそれらをインストールします。リモート バックエンドやクラウド ホスティングはありません。コーディング エージェントがすべてをローカルで実行します。

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
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [**日本語**](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 9355589f63c9c6f1864a9546654e99404123446db024ad9e2ddb892517d8b2c1. -->

</div>

---

## What is this?

Agent-Vorcl-Flow は、サポートされているコーディング エージェントを **構造化されたエンジニアリング チーム**に変えます。 1 人の一般的なアシスタントの代わりに、**25 の重点を置いたサブエージェント** (アーキテクト、コードに基づいた主任アーキテクト、バックエンド、フロントエンド、Expo モバイル エンジニア、プロダクトおよびビジュアル デザイン エンジニア、DB エンジニア、言語間整合性監査人、建築地図製作者、ライブボード オペレーターなど) が用意され、それぞれが独自のドメイン ** スキル**、クイック **スラッシュ コマンド**、および必要な **MCP ツール**を備えています。すべての重要なタスクは規律ある **Task Master** ループ (*目標 → タスク → 実装 → 検証 → 完了*) を通じて実行されるため、作業は計画され、追跡され、中断に耐えることができます。

- 🧩 **25 のサブエージェント**、73 のスキル、155 のスラッシュ コマンド
- ⚡ **ワンコマンド インストール** (Claude Code、Codex、Cursor、および/または Kimi CLI) — `npx`
- 🔌 **11 MCP サーバー** 接続 (GitHub、Postgres、MongoDB、Redis、Docker、Firecrawl、Vercel、レンダー、ファイルシステム、Task Master、Mermaid)
- 🔑 **すべてのランタイムに 1 つの `.env` ファイル** — キーは `~/.zshrc` ではなくランチャーによって読み取られるため、GUI/IDE 起動からも機能します。リモート AVF サービスはありません。ライブボードはローカルホストのみで一時的なものです
- 🤝 **同じソースから Claude Code、GPT Codex、Cursor、および Kimi CLI** で実行されます

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**、**[GPT Codex](https://developers.openai.com/codex/cli/)**、**[Cursor](https://cursor.com/)**、および/または **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

フラグを使用して単一のランタイムをターゲットにします。

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

インストーラーの機能:

|ランタイム |アクション |
| --- | --- |
| **共有レイヤー** |ランチャーを `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` にコピーし、テンプレートから `~/.config/agent-vorcl-flow/.env` (ランタイムごとに 1 つのキー ファイルを 1 回) を作成します。 |
| **Claude Code** |このリポジトリをプラグイン **マーケットプレイス** として登録し、プラグインを有効にします (直接 `~/.claude/settings.json` フォールバックを使用して `claude plugin …` 経由)。 |
| **GPT Codex** |スキルを `~/.agents/skills` にマージし、 `config.toml` + `AGENTS.md` ブロックを `~/.codex` にマージします (冪等、マーカー間)。 |
| **Cursor** |スキルを `~/.cursor/skills` にインストールし、ネイティブ カスタム サブエージェントを `~/.cursor/agents` にインストールし、不足しているサーバーを `~/.cursor/mcp.json` にマージします。 |
| **Kimi CLI** |スキルを `~/.kimi/skills` にインストールし、ネイティブ Expo カスタム エージェントを `~/.kimi/agents` にインストールし、Expo アーキテクチャ/UI フックの両方を `~/.kimi/config.toml` にインストールし、MCP サーバーをマージします。 |

> インストーラーはシークレットを入力することはありません。テンプレートから空の `.env` を作成するだけです。そこにキーを追加します ([Configuration](#configuration-mcp--keys)を参照)。

### Update to the latest version

npm `latest` タグを使用してインストーラを再度実行します。

```bash
npx --yes agent-vorcl-flow@latest
```

1 つのランタイムのみを更新するには、インストール時に使用したものと同じランタイム フラグを保持します。

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

この更新により、Agent-Vorcl-Flow が管理するスキル、エージェント、フック、ランチャー、および構成ブロックがオーバーレイされます。既存の `~/.config/agent-vorcl-flow/.env` とその秘密は変更されず、上流の Firecrawl スキルも保持されます。その後、更新されたコーディング クライアントを再起動します (または `/reload-plugins` を Claude Code で実行します)。

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

インストール後、**Claude Code** を再起動して (または開いているセッションで `/reload-plugins` を実行して)、エージェントをロードします。

---

## How to use

このセクションの例では、Claude Code 構文を使用します。ネイティブ構文については、以下の [Cursor](#cursor) および [GPT Codex](#gpt-codex) マッピングを参照してください。 Claude Code では、チームを呼び出すには **3 つの方法**があります。

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` どのサブエージェントが作業を所有すべきかを判断し、Task Master サイクル全体を推進します。 `/audit` バックエンド、フロントエンド、モバイル、データ、インフラストラクチャを自動検出し、関連するすべてのロールを使用して証拠に基づいた `PROJECT_AUDIT.md` を書き込みます。 `/init-code` は、プロジェクト コードを実行せずに、リポジトリを静的に読み取り、証拠に基づいた `PROJECT_DESCRIPTION.md` を作成します。そのファイルが存在すると、すべての変更ロールは、影響を受けるセクションの同期を維持する必要があります。実証済みの説明ドリフトがタスクの完了を妨げます。

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

すべてのエージェントには、そのエージェントをスコープとする Task Master ループを実行する独自の `/<agent>:vorcl` エントリ ポイントもあります。

### The Task Master loop
重要なタスクはすべて **Task Master** (`task-master-ai`) を介して処理されます。

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```これにより、作業が計画され、チェックポイントが設定され、再開可能になります。検証ステップを通過しない限り、何も「完了」とは宣言されません。

---

## The agents|エージェント |役割 |ハイライト |
| --- | --- | --- |
| 🔵 **建築家** |システム&ソリューションアーキテクト |要件分析、システム/DB/API設計、アーキテクチャレビュー |
| 🏛️ **プリンシパルアーキテクト** |プリンシパル ソフトウェア / インフラストラクチャ / AI アーキテクト | 11 の言語で実際のコードをスキャンし、証拠に裏付けられた MD、JSON、HTML、PDF、draw.io、Mermaid を作成します。完全再スキャン更新では注釈が保持されます。
| 🟢 **バックエンド** |バックエンド開発者 |ノード/TS、Postgres、Redis;モジュール式アーキテクチャ。すべてのルートは OpenAPI で完全にカバーされています |
| 🟣 **フロントエンド** |フロントエンド (React 19 / Next.js アプリルーター) |コンポーネント、状態、データフェッチ、レンダリング/バンドルの最適化、テスト |
| 📱 **エクスポモバイル** | React Native + Expo エンジニア |モジュラー アーキテクチャとデザイン/モーション/インタラクション システム、ネイティブ ナビゲーション、トークン、ジェスチャー、ハプティクス、Reduced Motion |
| 🟠 **アナライザー** |コード監査者 (読み取り専用) |バグ、タイプ セーフティ、DB 構造、フロントエンド モック、バックエンドの匂い |
| 🧭 **誠実さ** |言語間のコード整合性監査 (読み取り専用) |フロントエンド/バックエンド/モバイル/共有にわたる本番環境のハードコードとモック/フェイク/デモ/フィクスチャの漏洩 |
| 🟡 **傲慢** | OpenAPI/Swagger カバレッジ (任意のスタック) |完全に文書化されていないルートを見つけて、検証とともにカバーします。
| 🔴 **ファイアクロール** |ウェブリサーチャー |ライブ CLI/MCP/REST、アプリ統合、完成した Web データ ワークフロー |
| 🟤 **レンダリング** |ホスティングとデプロイ (レンダリング) |デプロイ、ログ駆動型診断、メトリクス、環境変数、レンダリング Postgres |
| 🟦 **データベース** | DB エンジニア / DBA |スキーマ、クエリとプラン、インデックス、N+1、安全な可逆移行、キャッシュ |
| ⚪ **回復力** |信頼性: エラー + ロギング |正しい境界でのトライ/キャッチ、型付きエラー、再試行/タイムアウト、構造化ログ |
| 🖼️ **スクリーンショット** |スクリーンショット UI → コード | UI スクリーンショットを本番環境に対応した応答性の高いアクセス可能なコードに変換します。
| 🎨 **デザインスタジオ** |プロダクト＆ビジュアルデザインスタジオ |ローカル HTML アーティファクト、プロトタイプ、ワイヤーフレーム、デッキ/PPTX、ドキュメント、アニメーション、3D、デザイン システム、Figma/GitHub/HTML インポート。 MIT から引用 `JimLiu/baoyu-design` |
| 🔎 **ビジュアルリサーチ** |スクリーンショット → 確認済みの回答 |サイト/ページを特定し、公式ドキュメントを検索し、ライブデータを確認して、URL と信頼性を備えた回答を返します。
| 🎯 **ピンポイント** |スクリーンショット → 既存のプロジェクトに配置 (読み取り専用) |実行中のアプリのスクリーンショットを実際のコードベース (コンポーネント、 🁟、ルート/ページ、正確なコントロール、およびその背後にあるロジック) に統合します。何も作成せず、編集を委任します。
| 📊 **ドローリオ** |ダイアグラム (draw.io/diagrams.net) |フローチャート、BPMN、UML、ERD、ネットワーク/クラウド、PMP/PMBOK (WBS、ガント、RACI…) |
| 🗺️ **アーチマップ** |建築地図製作者 |決定論的コード → `architecture.json` (`source:{file,line}` を持つすべてのノード) → インタラクティブ HTML マップ、draw.io、Mermaid、ARCHITECTURE.md、PDF;証明されていない事実にはマークが付いています `inferred` |
| 🧜 **人魚** | Mermaid ダイアグラム (+ 実際のレンダリング) |フローチャート、シーケンス、クラス、状態、ER、ガント、gitGraph、マインドマップ…; mcp-mermaid/`mmdc` 経由で検証済み。ファイルをお渡しします (`.mmd` + SVG/PNG/PDF) |
| 🧪 **テスト** |テスト＆検証エンジニア |ユニット (Vitest/Jest)、統合 (Supertest)、E2E (Playwright)、カバレッジ、不安定なテストのハンティング。各タスクの `testStrategy` を実行します。緑色の実行がなければ何も「完了」しません。
| 🌿 **gitflow** | Git ワークフローとリリース |従来のコミット、名前によるコミット (`git add .` は使用しない)、PR、Keep-a-Changelog、Semver リリース。明示的な確認がある場合にのみプッシュします。
| 🛡️ **セキュリティ** |セキュリティ監査人 (読み取り専用) |ツリーと git 履歴の秘密、OWASP トップ 10、依存関係 CVE、PII。調査結果がタスクになる - 修正は委任される || 📝 **ドキュメント** |ドキュメンテーションエンジニア | README (多言語パリティ)、API OpenAPI のドキュメント、アーキテクチャ、貢献、リリース ノート。すべての例はコードに対して検証されています。
| 🐳 **devops** |コンテナとCI/CD |マルチステージ Dockerfile、ローカル開発用の docker-compose、GitHub アクション パイプライン、環境/シークレットの衛生状態、モニタリング |
| 📡 **ライブボード** |ローカルオペレーションボード |一時的なローカルホスト ダッシュボード上のライブ Git ワークツリー、エージェント プロセス、および Task Master タスク |

**知っておく価値のあることがいくつかあります:**
- **フロントエンドは常に実際の API と通信します。** バックエンドの OpenAPI 仕様が唯一の信頼できる情報源です。そこから型が生成されます (`openapi-typescript` + `openapi-fetch`)。本番パスにはモックはありません。
- **`database` 変異には明示的な確認が必要です。** 分析は読み取り専用です。スキーマ/データの変更 (DDL/DML/移行) は、ユーザーの承認なしに実行されることはありません。
- **`resilience` には安全フックが同梱されています。** 非ブロッキング `PostToolUse` フック (`catch-guard.js`) は、編集したばかりのファイル内の空の `catch {}` ブロックに優しくフラグを立てます。
- **`archmap` 決して想像力から描画することはありません。** 抽出とレンダリングは厳密に分離されています。依存関係ゼロのスクリプトがリポジトリを `architecture.json` (実際の FK カーディナリティを持つデータベース、API ルート、AI エージェントとそのモデル/ツール/メモリ、インポート グラフ、環境) に移動し、すべての図は JSON からのみレンダリングされます。検証可能な `file:line` なしで LLM が追加するものはすべて、強制的に `inferred:true` とマークされ、破線で描かれます。
- **`principal-architect` は完全なアーキテクチャ公開ワークフローです。** エージェントを起動するリポジトリで動作し、トポロジ証拠として Markdown クレームを無視し、TS/JS、Python、Go、Java、C#、Rust、PHP、Ruby、Kotlin、Swift にバンドルされたオフライン Tree-sitter WASM を使用し、最初に `ARCHITECTURE.md` を書き込み、次に共有 JSON モデル、自己完結型 HTML、PDF、ネイティブを生成します。 draw.io およびコピー可能 Mermaid L0 ～ L4。 `update` は完全な再スキャンを実行し、注釈と管理されていないファイルを保存します。
- **`pinpoint` 検索しますが、決して作成しません。** 実行中のアプリのスクリーンショットが与えられると、画面を実際のコード (コンポーネント、ルート、正確なコントロール、その背後にあるロジック) にマッピングし、編集を `frontend`/`backend` に渡します。すでに存在するものに対して機能します (`screenshot` の逆)。
- **`visual-research` 推測ではなく検証します。** スクリーンショットを証拠として扱い、公式ドメインとドキュメントを確認し、現在のサイト データをチェックし、フィッシングの可能性や古い値にフラグを立てます。
- **`i18n` は「ゼロ言語ハードコーディング」を強制します。** エージェントは最初にプロジェクトが多言語かどうかを検出し、適応します。ユーザーに表示される文字列は、インラインではなく、翻訳レイヤー (next-intl/react-i18next/i18next) を通過します。

---

## Command reference以下のすべてのコマンドはスラッシュ コマンドです。 `<…>` は入力をマークします。

### `/vorcl` — universal router
|コマンド |何をするのか |
| --- | --- |
| `/vorcl <goal>` |あらゆる目標をタスクに変換し、それを適切なサブエージェントにルーティングし、完全なサイクルを実行して完了します。 |
| `/audit [path] [focus]` |読み取り専用の詳細なマルチロール監査 → 検出されたシステム、セキュリティ/CVE/復元力の調査結果、ターゲット アーキテクチャ、段階的な `PROJECT_AUDIT.md`。 |
| `/init-code [path] [--update]` |静的コードベースの発見 → 証拠に基づく `PROJECT_DESCRIPTION.md`;プロジェクト コードは決して実行されません。 |

### 🔵 architect — architecture
|コマンド |何をするのか |
| --- | --- |
| `/architect:vorcl <goal>` |目標→タスク→サイクル、スコープはアーキテクチャに限定されます。 |
| `/architect:analyze <context>` |要件とタスクのコンテキストを分析します。 |
| `/architect:design <problem>` |ソリューション アーキテクチャ (システム、DB、API) を設計します。 |
| `/architect:review <target>` |既存のアーキテクチャをレビューします。 |

### 🏛️ principal-architect — code-grounded architecture package
|コマンド |何をするのか |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Task Master を通じて大規模なアーキテクチャ目標を実行し、成果物を検証します。 |
| `/principal-architect:create [options]` |現在のリポジトリをスキャンし、コード証拠から MD、JSON、HTML、PDF、draw.io、および Mermaid を作成します。 |
| `/principal-architect:update [options]` |既存のパッケージを完全に再スキャンし、証拠の差分を書き込み、生成されたアーティファクトをアトミックに更新します。 |

### 🟢 backend — server (Node/TS, Postgres, Redis)
|コマンド |何をするのか |
| --- | --- |
| `/backend:vorcl <goal>` |バックエンド作業の目標→タスク→サイクル。 |
| `/backend:create-api <endpoint>` | OpenAPI で完全にカバーされるモジュラー アーキテクチャ上で API エンドポイントを生成します。 |
| `/backend:refactor <target>` |動作を変更せずにコードをリファクタリングします。 |
| `/backend:optimize <target>` |パフォーマンスの最適化。 |
| `/backend:test <target>` |コードのテストを生成します。 |

### 🟣 frontend — React / Next.js
|コマンド |何をするのか |
| --- | --- |
| `/frontend:vorcl <goal>` |フロントエンド作業は目標→タスク→サイクル。 |
| `/frontend:create-component <spec>` |特徴構造に従って UI コンポーネントを生成します。 |
| `/frontend:refactor <target>` |動作を変更せずに UI / フックをリファクタリングします。 |
| `/frontend:optimize <target>` |レンダリング / バンドル / Core Web Vitals を最適化します。 |
| `/frontend:test <target>` |コンポーネントテストを生成します。 |

### 📱 expo-mobile — React Native / Expo

|コマンド |何をするのか |
| --- | --- |
| `/expo-mobile:vorcl <goal>` |目標 → Expo モバイル作業の Task Master サイクル。 |
| `/expo-mobile:create-module <domain>` |複雑さに必要なレイヤーのみを含むモジュール式のビジネス スライスを作成します。 |
| `/expo-mobile:create-screen <flow>` |薄い Expo Router ルートとモジュール所有の画面と状態を作成します。 |
| `/expo-mobile:design-screen <flow>` |共有されたデザイン/モーション トークン、状態、アクセシビリティを備えたプレミアム画面を構築します。 |
| `/expo-mobile:motion <interaction>` |ネイティブ ナビゲーション、スプリング、ジェスチャー、ハプティクス、モーションを減らしたフォールバックを設計します。 |
| `/expo-mobile:add-api <contract>` |スキーマ/DTO/マッパー/クエリ キーと TanStack Query 統合を追加します。 |
| `/expo-mobile:audit [scope]` |読み取り専用のアーキテクチャ保護と証拠に基づく監査。 |
| `/expo-mobile:ui-audit [scope]` |読み取り専用のデザイン システム、モーション、インタラクション、アクセシビリティ、およびパフォーマンスの監査。 |
| `/expo-mobile:compatibility [app] [change]` |バージョン管理された公式ソースに対するライブ読み取り専用 Expo/RN/ノード/パッケージ/ネイティブ ランタイム互換性監査。 |
| `/expo-mobile:test <scope>` |ドメインユニット、React Native テストライブラリ、Maestro チェックを実行します。 |

### 🟠 analyzer — code audit (read-only)
|コマンド |何をするのか |
| --- | --- |
| `/analyzer:vorcl <goal>` | Task Master を使用して目標を監査します。結果はタスクになります。 |
| `/analyzer:audit` |完全な監査: バグ、タイプ、DB、フロントエンド モック、バックエンドの匂い。 |
| `/analyzer:bugs` |バグを探す — 未処理のエラー、競合状態、エッジケース。 |
| `/analyzer:types` |型チェック — `tsc`、`any`、安全でないキャスト、zod↔types ドリフト。 |
| `/analyzer:db` |構造の監査 — スキーマ、インデックス、FK、N+1、移行。 |
| `/analyzer:mocks` |フロントエンドとバックエンドのモック/フェイクデータの互換性ルート。整合性に対する詳細な多言語チェックを委任します。 |
| `/analyzer:backend` | 「悪い」バックエンド コード、アーキテクチャ違反、コントローラー内のロジックを見つけます。 |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)|コマンド |何をするのか |
| --- | --- |
| `/integrity:vorcl <goal>` | Task Master を通じて重要な整合性目標を実行し、結果を所有者固有のタスクに変換します。 |
| `/integrity:audit [path]` |ハードコードとモックリークを一緒にスキャンし、本番環境への到達可能性を証明します。 |
| `/integrity:hardcode [path]` |ローカリゼーション、構成、または記録システムをバイパスするユーザー/構成/ビジネス リテラルを検索します。 |
| `/integrity:mocks [path]` |本番環境から到達可能なモック フレームワーク、偽のジェネレーター、フィクスチャ、デモ データ、静的応答を見つけます。 |

バンドルされているゼロ依存性スキャナーは、TS/JS、Python、Go、Java/Kotlin、C#、PHP、Ruby、Rust、Vue/Svelte/HTML、および Razor をサポートします。バックエンド コードでは、定数、静的/最終フィールド、デフォルト パラメーター、名前付き引数、静的カタログに隠されているビジネス値にもフラグを立てます。次に、監査人はそれらをスキーマ/モデル/リポジトリ/クエリ/管理ミューテーションと比較して、コードや構成ではなくデータベースが値を所有していることを証明します。テスト、フィクスチャ、ストーリー、サンプル、シード、生成されたコード、およびベンダー ルートは、デフォルトでは抑制されています。語彙候補は、到達可能性と所有権が証明されるまでは欠陥ではありません。

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
|コマンド |何をするのか |
| --- | --- |
| `/swagger:vorcl <goal>` | Task Master によるフルカバレッジ目標 — 監査 → タスク → カバー → 検証。 |
| `/swagger:audit` |読み取り専用: 仕様で完全にカバーされていないルートを検索します。 |
| `/swagger:cover <route>` |ルート/モジュール (パラメータ、応答、説明、セキュリティ + 検証) をカバーします。 |

### 🔴 firecrawl — web research
|コマンド |何をするのか |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Task Master による調査目標 — 最終的な結果に至るまで Web データを収集します。 |
| `/firecrawl:search <query>` |質問に関する情報源を Web で検索します。 |
| `/firecrawl:scrape <url>` | 1 つの URL を markdown/JSON にスクレイピングします。 |
| `/firecrawl:map <url>` |サイトの URL をマッピングします。 |
| `/firecrawl:crawl <url>` |セクション/サイトを再帰的にクロールします。 |
| `/firecrawl:extract <url>` | JSON スキーマによる構造化抽出。 |
| `/firecrawl:setup` |インストール/検証 CLI に加えて、公式のビルドおよびワークフロー スキル (確認付き)。 |
| `/firecrawl:interact <url>` |スクレイピングが不十分な場合は、フォームをクリック、移動、または入力します。 |
| `/firecrawl:parse <file>` |ローカル/プライベート ドキュメントをマークダウンまたは JSON に解析します。 |
| `/firecrawl:monitor <action>` |チェックをリスト表示したり、定期的なページ変更モニターを管理したりできます。 |
| `/firecrawl:agent <goal>` |制限付きの長時間実行 Firecrawl エージェント タスクを実行します。 |
| `/firecrawl:research <query>` |論文と GitHub 研究コンテキストを検索します。 |
| `/firecrawl:ask <jobId>` |失敗した Firecrawl ジョブを診断します。 |
| `/firecrawl:docs-search <question>` |現在の公式 Firecrawl ドキュメントを検索します。 |
| `/firecrawl:integrate <feature>` |上流のビルド スキルを使用して Firecrawl をアプリケーション コードに追加します。 |
| `/firecrawl:deliverable <artifact>` |概要、監査、リードリスト、またはその他のワークフロー成果物を作成します。 |`/firecrawl:setup` は確認後にのみ正式な `firecrawl-cli init --all` フローを実行します。既存の公式 `firecrawl-*` スキルが優先され、Codex/Cursor インストーラによって保存されます。 AVF は、不足しているスキルに対して互換性のあるフォールバックを提供します。ライブ操作は、CLI → MCP → REST/キーレスを経由します。

### 🟤 render — hosting / deploy (Render)
|コマンド |何をするのか |
| --- | --- |
| `/render:vorcl <goal>` | Task Master 経由のインフラ目標 — 導入/診断/構成を完了します。 |
| `/render:deploy <service>` |サービスをデプロイ/再デプロイします。 |
| `/render:logs <service>` |根本原因までのサービスログと診断。 |
| `/render:status <service>` |サービスのステータス + デプロイ + メトリクス。 |
| `/render:query <sql>` |レンダリング Postgres に対する読み取り専用 SQL。 |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
|コマンド |何をするのか |
| --- | --- |
| `/database:vorcl <goal>` | Task Master によるデータ目標 — スキーマ/クエリ/移行/キャッシュが完了しました。 |
| `/database:query <query>` |読み取り専用のクエリ/分析。 |
| `/database:schema <target>` |スキーマとデータの整合性を設計/レビューします。 |
| `/database:migrate <change>` |安全で可逆的なスキーマ/データの移行を計画します。 |
| `/database:optimize <target>` |最適化 — インデックス、N+1、クエリプラン、ページネーション。 |
| `/database:cache <target>` | Redis — TTL、無効化、ロック、レート制限、ストリーム。 |

### ⚪ resilience — error handling + logging
|コマンド |何をするのか |
| --- | --- |
| `/resilience:vorcl <goal>` | Task Master による信頼性の目標 — try/catch + ログでコードをカバーします。 |
| `/resilience:harden <target>` |コードを try/catch/finally でラップし、確実なログを記録し、サイレントエラーを発生させません。 |
| `/resilience:logging <target>` |構造化ログの追加/修正 — レベル、コンテキスト、シークレット/PII なし。 |
| `/resilience:audit` |読み取り専用: サイレントエラー、空のキャッチ、ロギングギャップを検索します。 |

### 🪵 logging — Pino structured logging
| Command | What it does |
| --- | --- |
| `/logging:vorcl <goal>` | Logging goal via Task Master — cover or update the Pino package. |
| `/logging:audit [path]` | Read-only: one root logger, child context, redact, no console/Loki sink. |
| `/logging:cover <target>` | Create `infrastructure/logging` and cover a module/worker/route. |
| `/logging:update <target>` | Bring legacy `pino()`/`console.log` to the canonical package. |


### 🖼️ screenshot — screenshot UI → code
|コマンド |何をするのか |
| --- | --- |
| `/screenshot:vorcl <goal>` | Task Master 経由のスクリーンショットからの一連の画面 — 内訳 → コード。 |
| `/screenshot:analyze <image>` |読み取り専用の内訳 - レイアウト、コンポーネント、トークン、状態 → 計画。 |
| `/screenshot:convert <image> [framework]` |スクリーンショットから完全な実行可能なコードを生成します (デフォルトは React + Tailwind v4)。 |
| `/screenshot:tokens <image>` |デザイントークン (OKLCH カラー、タイポグラフィー、スペース) を Tailwind `@theme` に抽出します。 |
| `/screenshot:responsive <target>` |生成された UI を応答性のあるものにします — ブレークポイント、流体、`clamp()`、コンテナ クエリ。 |

### 🎨 design-studio — product and visual design
|コマンド |何をするのか |
| --- | --- |
| `/design-studio:vorcl <goal>` | Task Master による完全な設計目標 — コンテキスト → バリアント → HTML → プレビュー → 検証 → エクスポート。 |
| `/design-studio:create <brief>` |洗練された自己完結型の視覚的成果物またはハイファイ UI を作成します。 |
| `/design-studio:prototype <flow>` |状態と遷移を含むインタラクティブな Web/モバイル プロトタイプを構築します。 |
| `/design-studio:wireframe <flow>` |情報アーキテクチャと UX に重点を置いた Low-Fi ワイヤーフレームを構築します。 |
| `/design-studio:design-system <operation>` |デザイン システムを作成、インポート、コンパイル、バインド、リフレッシュ、またはチェックします。 |
| `/design-studio:import <type> <source>` | Figma `.fig`、GitHub、または HTML/CSS を出所付きでインポートします。 |
| `/design-studio:deck <brief>` |スピーカー ノート、アニメーション、およびオプションの編集可能な PPTX を使用して HTML デッキを構築します。 |
| `/design-studio:document <brief>` |印刷可能な文書、履歴書、メモ、概要資料、またはレポートを作成します。 |
| `/design-studio:animation <brief>` |モーション アーティファクトを構築し、必要に応じて MP4 にレンダリングします。 |
| `/design-studio:research <question>` |ソースに裏付けられたビジュアルリサーチ成果物を作成します。 |
| `/design-studio:export <project> <format>` |スタンドアロン HTML、PDF、PPTX、MP4、またはハンドオフ形式にエクスポートします。 |
| `/design-studio:review <target>` |読み取り専用のビジュアル、UX、レスポンシブ、a11y、およびデザインシステムのレビュー。 |

### 🔎 visual-research — screenshot → verified web answer
|コマンド |何をするのか |
| --- | --- |
| `/visual-research:vorcl <goal>` | Task Master による複数ステップのスクリーンショットの調査。 |
| `/visual-research:identify <image>` |信頼できる証拠を持ってサイト、ページ、機能を特定します。 |
| `/visual-research:search <image> <target>` |視覚的な手がかりから実際のページまたは公式ドキュメントを見つけます。 |
| `/visual-research:answer <image> <question>` |スクリーンショットの証拠、公式ドキュメント、現在のライブデータを使用して回答してください。 |
| `/visual-research:hints <image> <goal>` |目に見えるインターフェイスについて、ドキュメントに裏付けられた安全な手順を提供します。 |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
|コマンド |何をするのか |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Task Master — マップ → タスク → デリゲートを介して、スクリーンショットから既存の UI を検索/理解/変更します。 |
| `/pinpoint:locate <image>` |スクリーンショットから既存のコンポーネント/ファイルを見つけます — `file:line`、新しいコードはありません。 |
| `/pinpoint:route <image>` |画面が表示されているルート/ページを特定します (Next.js アプリ/ページ ルーター、React ルーター)。 |
| `/pinpoint:control <image>` |コード内で正確なコントロール (ボタン/フィールド) とそのハンドラーを特定します。 |
| `/pinpoint:trace <target>` |要素の背後にあるロジックをトレースします (ハンドラー → 状態 → データフェッチ → API)。 || `/pinpoint:handoff <change>` |既存のコードに対して正確な編集リクエストを作成し、`frontend`/`backend` に委任します。 |

### 📊 drawio — diagrams (draw.io / diagrams.net)
|コマンド |何をするのか |
| --- | --- |
| `/drawio:vorcl <goal>` | Task Master による一連の図 — 構築して完了。 |
| `/drawio:create <description> [type]` |テキスト記述 (有効なネイティブ XML) から図を構築します。 |
| `/drawio:pmp <type> <project>` | PMP/PMBOK 図を構築します — WBS、PERT/CPM、ガント、RACI、リスク マトリックス、ステークホルダー グリッド。 |
| `/drawio:convert <source> [type]` |ソースを図に変換します — DB スキーマ → ERD、フォルダー → ツリー、コード → UML、mermaid/CSV/JSON。 |
| `/drawio:refine <file>` |既存の `.drawio` を調整します — レイアウト、テーマ、ノードの追加/削除、グリッドへの位置合わせ。 |

### 🗺️ archmap — architecture map from code|コマンド |何をするのか |
| --- | --- |
| `/archmap:vorcl <goal>` | Task Master によるマッピング目標 — 検証済みのアーティファクト セットを構築します。 |
| `/archmap:map [repo]` |完全なパイプライン: 抽出 → `architecture.json` → LLM アノテーション → すべての形式 (HTML、draw.io、Mermaid、ARCHITECTURE.md、PDF)。 |
| `/archmap:extract [repo]` |抽出のみ - すべてのノード上で `source:{file,line}` が付いている機械可読な `architecture.json`。 |
| `/archmap:annotate [json]` |既存の `architecture.json` の LLM エンリッチメント (エージェント メモリ、データフロー セマンティクス)。証明されていない事実は自動的に `inferred` に降格されます。 |
| `/archmap:html [json]` |インタラクティブな自己完結型 HTML マップ — レイヤーの切り替え、ビームのトレース、ノード → `file:line` パネル、検索、CSS の印刷。 |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (複数ページ: 概要 / ERD / API / エージェント) および/または Mermaid ビュー、検証済み。 |

### 🧜 mermaid — Mermaid diagrams (+ real render)
|コマンド |何をするのか |
| --- | --- |
| `/mermaid:vorcl <goal>` | Task Master による一連の図 — ビルドして完了 (レンダリング検証済み)。 |
| `/mermaid:create <description> [type]` |説明からダイアグラムを構築します。有効な構文であり、実際のレンダリングによって検証されます。ファイルを渡します。 |
| `/mermaid:convert <source> [type]` |ソースを Mermaid — DB スキーマ → ER、コード → クラス/シーケンス、フォルダー → フローチャート、`.drawio`/CSV/JSON に変換します。 |
| `/mermaid:validate <file>` |構文 + 実際のレンダリングテスト;エラーを見つけて修正します (mmdc / Maid / mcp-mermaid)。 |
| `/mermaid:render <file> [format] [theme]` | SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink) にエクスポートします。 |
| `/mermaid:refine <file>` |既存の `.mmd` を改良します — 方向、サブグラフ、クラス定義/スタイル、可読性。 |

### 🧪 testing — tests & verification
|コマンド |何をするのか |
| --- | --- |
| `/testing:vorcl <goal>` | Task Master によるテスト/検証目標 — ユニット + 統合 + e2e を完了する。 |
| `/testing:unit <file\|module>` |単体テスト (Vitest/Jest) — 正常なパス、境界、エラー。それらを実行し、出力を表示します。 |
| `/testing:integration <endpoint\|module>` |統合テスト (スーパーテスト/インジェクト、実際の DB またはテストコンテナ)。 |
| `/testing:e2e <scenario>` | Playwright クリティカル ユーザー パスの E2E — ロール セレクター、フィクスチャ、障害時のトレース。 |
| `/testing:verify <task\|testStrategy>` |タスクの `testStrategy` を実行し、実際の出力とともに READY / NOT READY の判定を返します。 |
| `/testing:coverage [path]` |調査結果を含むカバレッジ レポート - どの重要なコードがテストされていないのか。タスクを作成します。 |
| `/testing:flaky <test>` |不安定なテスト (レース、タイミング、共有状態、モック) を診断し、永久に修正します。 |

### 🌿 gitflow — git workflow & releases
|コマンド |何をするのか |
| --- | --- |
| `/gitflow:vorcl <goal>` | Task Master による git/リリース目標 (リリースの準備、履歴のクリーンアップ、機能ブランチ)。 |
| `/gitflow:commit <files\|scope>` |従来のコミットメッセージを伴う名前別コミット (決して `git add .`)。不明な WIP で停止します。 |
| `/gitflow:pr <base> <title>` |ブランチ → コミット → プル リクエスト (gh / GitHub MCP) で、何を/なぜ/どのように検証したか。 |
| `/gitflow:changelog [version]` | CHANGELOG.md (変更ログの保存) はタグ間のコミットから生成されます。 |
| `/gitflow:release <version\|auto>` |コミット → マニフェスト バージョンの同期 → タグ → GitHub リリースの順に進みます。明示的な確認後にのみプッシュしてください。 |
| `/gitflow:audit [branch]` |読み取り専用の履歴監査: 規約違反、ダンプコミット、大きな BLOB、孤立したブランチ。 |

### 🛡️ security — security audit (read-only)
|コマンド |何をするのか |
| --- | --- |
| `/security:vorcl <goal>` | Task Master によるセキュリティ目標 — 監査 → 調査結果 → タスク → 委任された修正。 |
| `/security:secrets [path\|branch]` |作業ツリーと git 履歴 (すべてのブランチ) のシークレット。 `${VAR:-}` プレースホルダーは秘密ではありません。 |
| `/security:owasp [path]` |コード内の OWASP トップ 10: インジェクション、XSS、認証、データ公開、CORS/Cookie — file:line の証明付き。 |
| `/security:deps` | npm 監査 / ロックファイル経由の依存関係 CVE — 重大度、重大な変更フラグ。 |
| `/security:pii [path]` | PII/GDPR リスク: 電子メール、電話、コード内のカードおよびログ。開発者のプライベートパス。 |
| `/security:pre-push [branch]` |プッシュ前の変更ファイルの高速複合チェック: シークレット + インジェクション + PII;緑/赤の評決。 |

### 📝 docs — documentation
|コマンド |何をするのか |
| --- | --- |
| `/docs:vorcl <goal>` | Task Master による文書化の目標。 |
| `/docs:readme [path]` | README の作成/更新 — what/quickstart/usage/config/troubleshooting;検証された例。言語バージョンが同期されました。 |
| `/docs:api [spec]` | OpenAPI 仕様から生成されたAPI ドキュメント (エンドポイント、パラメータ、カールの例)。仕様がない場合は `/swagger:audit` を提案します。 |
| `/docs:architecture` | ARCHITECTURE.md — モジュール、境界、データ フロー。図は `mermaid`/`drawio` に委任されています。 || `/docs:contributing` | CONTRIBUTING.md — セットアップ、構造、テスト、コミット規約 (`gitflow` に合わせて)、PR プロセス。 |
| `/docs:release-notes <version>` | CHANGELOG/history のバージョンのリリース ノート。 |
| `/docs:audit` |読み取り専用のドキュメント↔コード ドリフト チェック: 壊れたリンク、古い例/カウンター、同期されていない翻訳。 |

### 🐳 devops — containers & CI/CD
|コマンド |何をするのか |
| --- | --- |
| `/devops:vorcl <goal>` | Task Master によるインフラストラクチャ目標。 |
| `/devops:dockerfile [app-type]` | Dockerfile の作成/レビュー — マルチステージ、スリムベース、非ルート、HEALTHCHECK。本物の`docker build`によって検証されています。 |
| `/devops:compose` |ローカル開発用の docker-compose.yml (アプリ + DB)。環境変更には `--force-recreate` が必要です。正常になるまで待機します。 |
| `/devops:ci [type]` | GitHub アクション — PR ワークフロー (lint+typecheck+test、npm キャッシュ)、デプロイ ワークフロー、最小限の権限。 |
| `/devops:env` |環境変数インベントリ: どこで読み取られるか、何が必要か、`.env.example` テンプレート。決して映像に残らない秘密。 |
| `/devops:monitoring` |構造化ログ (pino/JSON)、ヘルスエンドポイント、アラート対象。 `render` エージェント経由でメトリクスをレンダリングします。 |

### 📡 liveboard — ephemeral local operations board
|コマンド |何をするのか |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` |無料のローカルホスト ポートで洗練された 43 言語のダッシュボードを開始します。 Task Master 変更は SSE を通じてストリーミングされ、5 分ごとに調整されます。 |
| `/liveboard:vorcl <goal>` |必要な Task Master ワークフローを通じて Liveboard 自体を開発または変更します。 |

Liveboard は、Git ワークツリー、ローカル Claude/Codex/Cursor プロセス、および各ワークツリーの `.taskmaster/tasks/tasks.json` を読み取ります。実行時の状態はメモリ内に残り、フォアグラウンド プロセスが停止すると消えます。 UI はブラウザ言語を検出し、英語、ロシア語、ウクライナ語、ドイツ語、フランス語、スペイン語、ポルトガル語、イタリア語、ポーランド語、トルコ語、中国語、日本語、アラビア語、オランダ語、チェコ語、スロバキア語、ルーマニア語、ハンガリー語、ブルガリア語、セルビア語、クロアチア語、スロベニア語、ギリシャ語、ヘブライ語、ペルシア語、ヒンディー語、ベンガル語、ウルドゥー語、インドネシア語、マレー語、ベトナム語、タイ語、韓国語、スウェーデン語、ノルウェー語、デンマーク語、フィンランド語、エストニア語、ラトビア語、リトアニア語、グルジア語、アルメニア語、アゼルバイジャン語。アラビア語、ヘブライ語、ペルシア語、ウルドゥー語は RTL レイアウトを使用します。

直接設定:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: Git ワークツリーと Task Master ファイルがスキャンされるプロジェクト。
- `--port 0`: 空いているポートを自動的に選択します。
- `--interval`: ミリ秒単位の完全な調整間隔。静止ストリームを視聴しているファイル Task Master はすぐに変更されます。
- エンドポイント: `/health`、`/api/snapshot`、`/api/events` (SSE)、および `POST /api/refresh`。
- プロジェクト情報をネットワークに公開することを明示的に意図しない限り、`--host 127.0.0.1` はそのままにしておきます。

---

## Configuration (MCP & keys)

パッケージには **リモート バックエンドまたはデータベース**はありません。オプションのライブボードは、ローカルホスト専用のメモリ内プロセスです。 MCP サーバーにはトークンが必要であり、**各ユーザーは独自のトークンを提供します**。これを **Claude Code、Codex、Cursor、Kimi CLI** で同じように動作させるため、またターミナルから起動するか Dock/Spotlight/IDE から起動するかに関係なく、すべての stdio MCP サーバーは **1 つのファイル**からキーを読み取る小さなランチャー (`bin/mcp-env.mjs`) を通じて起動されます。

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

インストーラは [`.env.example`](../.env.example) から作成します。それを開いて、使用するキーのみを入力します。

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

> **なぜ `~/.zshrc` ではなくランチャーを使用するのですか?** 環境変数の展開はランタイムごとに異なり (Claude の `${VAR:-}`、Cursor の `${env:VAR}`、Codex/Kimi のリテラル)、各ランタイムは **it** が起動された環境のみを読み取ります。 GUI / IDE は macOS で起動しますが、ソース `~/.zshrc` を使用しないため、エクスポートされたキーは表示されず、サーバーは何も接続しません。セット」失敗。 1 つの `.env` ファイルから読み取ると、両方の問題が同時に解決されます。

**優先** (後の方が優先): 共有 `~/.config/agent-vorcl-flow/.env` → プロジェクト ルート内の `./.env` → シェル内の実際の `export`。共有ファイルにグローバル キーを保持し、プロジェクトごと (例: 別の `MONGODB_URI`) をプロジェクト `.env` でオーバーライドします。また、CLI の実行では、依然として本物のシェル エクスポートが優先されます。 `AGENT_VORCL_ENV_FILE=/path/.env` を使用すると、ランチャーで別のファイルを指定できます。必要なキーが欠落しているサーバーは単純に**起動しません**。ランタイムの MCP ログに 1 行の `[agent-vorcl-flow] MCP «…» is not configured: …` が表示され、他のサーバーは動作し続けます。キーを`.env`に追加して再起動します。 (`GITHUB_TOKEN`/`MONGODB_URI` 名を保持することもできます。ランチャーは、それらをサーバーが予期する `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` にマップします。)

> ⚠️ **AI を利用した Task Master コマンドに必須:** 選択したプロバイダーを少なくとも 1 つ構成します (Claude の場合は `ANTHROPIC_API_KEY`、GPT の場合は `OPENAI_API_KEY`、または Codex CLI OAuth)。 `.taskmaster/config.json` で選択したモデルの認証情報がないと、`/vorcl` はタスクを生成または展開できません。

実際に生成を実行する Task Master プロバイダーを選択します。キーだけではモデルは選択できません。

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

このコマンドは公式の `task-master models` フローを使用し、モデルの選択のみを `.taskmaster/config.json` に保存します。 `PERPLEXITY_API_KEY` はオプションであり、Perplexity が研究モデルとして選択されている場合にのみ必要です。

リモートの **vercel** サーバーと **render** サーバーは OAuth を使用します (ブラウザーで `/mcp` を使用して認証します)。 headless/CI でレンダリングするには、環境で `RENDER_API_KEY` を設定し、ランタイム用にそのサーバーに Bearer ヘッダー エントリを追加します。

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

リポジトリには、`.codex-plugin/plugin.json` にあるネイティブ Codex プラグイン マニフェストが含まれるようになりました。 npm インストーラーは引き続き利用可能で、**スキル**、**プロファイル**、および Codex CLI、Cursor、および Kimi の `AGENTS.md` ルーターと同じ機能をインストールします。

| Claude Code | Codex 同等 |
| --- | --- |
|サブエージェント `@agent-vorcl-flow:frontend` |スキルペルソナ `$frontend` + `codex --profile frontend` |
|コマンド `/analyzer:audit` |タスクスキル `$analyzer-audit` |
|コマンド `/vorcl` |タスクスキル `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` で `config.toml` |
| `SessionStart` フック | `AGENTS.md` でのロール ルーティング |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

完全なマッピングについては、[`codex/README.md`](../codex/README.md) を参照してください。

---

## Cursor

Cursor は、Codex アダプタと同じオープン `SKILL.md` 形式に加えて、ネイティブ カスタム サブエージェントとグローバル MCP 構成を使用します。

| Agent-Vorcl-Flowコンセプト | Cursor 同等 |
| --- | --- |
|役割 `backend` |カスタム サブエージェント `/avf-backend` の `~/.cursor/agents` |
|タスクコマンド `/backend:create-api` |スキル `/backend-create-api` |
|ユニバーサル `/vorcl` |スキル `/vorcl` |
| `.mcp.json` | `~/.cursor/mcp.json` にサーバーを統合しました |

インストーラーは、ロール定義を Cursor フロントマターに変換し、スキル名の衝突を避けるためにサブエージェントに `avf-` という接頭辞を付け、`model: inherit` を使用し、監査専用エージェントを `readonly: true` としてマークします。同じ名前の既存の MCP サーバー エントリは保存されます。 [`cursor/README.md`](../cursor/README.md)を参照してください。

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) は、エージェント スキル、カスタム エージェント ファイル、ライフサイクル フックをネイティブに読み込みます。 AVF は、Claude と Cursor で使用される同じ MCP サーバーもマージします。

| Agent-Vorcl-Flow コンセプト | Kimi CLI 同等 |
| --- | --- |
|スキル/タスクコマンド | `~/.kimi/skills` と `/skill:<name>` |
| Expo カスタムエージェント | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse ガード | `~/.kimi/config.toml` | に統合されました。
| `.mcp.json` | `~/.kimi/mcp.json` のサーバーを統合 |
|ランタイムごとのキー ファイル |共有 `~/.config/agent-vorcl-flow/.env` (ランチャー経由) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI には `mcp.json` に `${VAR}` 拡張がないため、他のランタイムとまったく同様に、キーはランチャーを介して共有 `.env` から取得されます。 [`kimi/README.md`](../kimi/README.md)を参照してください。

---

## Project structure

```text
.claude-plugin/plugin.json      # plugin manifest
.claude-plugin/marketplace.json # local marketplace (for install)
agents/       26 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (75 skills; some ship references, scripts, tests or HTML assets)
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

**どのように組み合わせるか:** `agents/*.md` ロールを宣言し、前付で `skills:` スキルをアタッチ → `skills/*/SKILL.md` のスキルは説明によって自動ロード → `commands/<agent>/*.md` サブエージェントに委任するクイック `/agent:command` ショートカットを提供 → `.mcp.json` エージェントにツールを提供し、各ツールは共有 `.env` からシークレットをロードします。 `SessionStart` フックは、Claude エージェントが対応可能であることを示します。

---

## License

MIT — 自由に使用、コピー、変更、配布できます。 「現状のまま」提供され、保証も責任もありません。 [LICENSE](../LICENSE)を参照してください。

© 2026 Christian Avis (Vorcl)。
