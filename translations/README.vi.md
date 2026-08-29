<div align="center">

# Agent-Vorcl-Flow

**Một nhóm gồm các tác nhân phụ AI chuyên biệt cho [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) và [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — với các kỹ năng, lệnh và công cụ MCP.**
Một lệnh `npx` sẽ cài đặt chúng. Không có phụ trợ từ xa hoặc lưu trữ đám mây: tác nhân mã hóa của bạn chạy mọi thứ cục bộ.

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
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [**Tiếng Việt**](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 83d6d9acc986bc985e4ad946e5d40538d51bf4d6cafa9623e93e5244c4da8b5e. -->

</div>

---

## What is this?

Agent-Vorcl-Flow biến tác nhân mã hóa được hỗ trợ thành **nhóm kỹ thuật có cấu trúc**. Thay vì một trợ lý chung, bạn có **25 tác nhân phụ tập trung** (kiến trúc sư, kiến ​​trúc sư chính dựa trên mã, phần phụ trợ, giao diện người dùng, Expo kỹ sư di động, kỹ sư thiết kế sản phẩm và hình ảnh, DB kỹ sư, người kiểm tra tính toàn vẹn ngôn ngữ chéo, người vẽ bản đồ kiến ​​trúc, người vận hành liveboard, v.v.), mỗi người có **kỹ năng** miền riêng, **lệnh gạch chéo** nhanh và **MCP công cụ** mà nó cần. Mọi nhiệm vụ không hề tầm thường đều chạy qua một vòng lặp **Task Master** có kỷ luật — *mục tiêu → nhiệm vụ → thực hiện → xác minh → hoàn thành* — vì vậy công việc được lên kế hoạch, theo dõi và không bị gián đoạn.

- 🧩 **25 đặc vụ phụ**, 73 kỹ năng, 155 lệnh gạch chéo
- ⚡ **Cài đặt bằng một lệnh** cho Claude Code, Codex, Cursor, và/hoặc Kimi CLI — `npx`
- 🔌 **11 MCP máy chủ** được nối dây vào (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Kết xuất, hệ thống tập tin, Task Master, Mermaid)
- 🔑 **Một tệp `.env` cho tất cả thời gian chạy** — các khóa được đọc bởi trình khởi chạy chứ không phải `~/.zshrc`, vì vậy chúng hoạt động ngay cả khi khởi chạy GUI/IDE; không có dịch vụ AVF từ xa; liveboard chỉ dành cho localhost và phù du
- 🤝 **Chạy trên Claude Code, GPT Codex, Cursor và Kimi CLI** từ cùng một nguồn

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)**, và/hoặc **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Nhắm mục tiêu một thời gian chạy bằng cờ:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Trình cài đặt làm gì:

| Thời gian chạy | Hành động |
| --- | --- |
| **Lớp chia sẻ** | Sao chép trình khởi chạy sang `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` và tạo `~/.config/agent-vorcl-flow/.env` từ mẫu (một lần) — tệp khóa duy nhất cho mỗi lần chạy. |
| **Claude Code** | Đăng ký kho lưu trữ này dưới dạng plugin **marketplace** và kích hoạt plugin (thông qua `claude plugin …`, với dự phòng `~/.claude/settings.json` trực tiếp). |
| **GPT Codex** | Hợp nhất các kỹ năng thành `~/.agents/skills` và các khối `config.toml` + `AGENTS.md` thành `~/.codex` (bình thường, giữa các điểm đánh dấu). |
| **Cursor** | Cài đặt các kỹ năng vào `~/.cursor/skills`, các tác nhân phụ tùy chỉnh gốc vào `~/.cursor/agents` và hợp nhất các máy chủ còn thiếu vào `~/.cursor/mcp.json`. |
| **Kimi CLI** | Cài đặt các kỹ năng vào `~/.kimi/skills`, tác nhân tùy chỉnh Expo gốc vào `~/.kimi/agents`, cả kiến ​​trúc/UI Expo đều nối vào `~/.kimi/config.toml` và hợp nhất các máy chủ MCP. |

> Trình cài đặt không bao giờ điền các bí mật của bạn — nó chỉ tạo một `.env` trống từ mẫu. Bạn thêm khóa vào đó (xem [Configuration](#configuration-mcp--keys)).

### Update to the latest version

Chạy lại trình cài đặt với thẻ npm `latest`:

```bash
npx --yes agent-vorcl-flow@latest
```

Để chỉ cập nhật một thời gian chạy, hãy giữ nguyên cờ thời gian chạy mà bạn đã sử dụng trong quá trình cài đặt:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

Bản cập nhật bao gồm các kỹ năng, tác nhân, hook, trình khởi chạy và khối cấu hình do Agent-Vorcl-Flow quản lý. Nó giữ cho `~/.config/agent-vorcl-flow/.env` hiện có của bạn và các bí mật của nó không thay đổi, đồng thời duy trì các kỹ năng Firecrawl ngược dòng. Sau đó khởi động lại máy khách mã hóa đã cập nhật (hoặc chạy `/reload-plugins` trong Claude Code).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Sau khi cài đặt, **khởi động lại Claude Code** (hoặc chạy `/reload-plugins` trong phiên mở) để tải các tác nhân.

---

## How to use

Các ví dụ trong phần này sử dụng cú pháp Claude Code; xem ánh xạ [Cursor](#cursor) và [GPT Codex](#gpt-codex) bên dưới để biết cú pháp gốc của chúng. Trong Claude Code có **ba cách** để triệu tập nhóm.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` tìm ra tác nhân phụ nào sẽ sở hữu công việc và điều khiển toàn bộ chu trình Task Master. `/audit` tự động phát hiện phần phụ trợ, giao diện người dùng, thiết bị di động, dữ liệu và cơ sở hạ tầng và viết `PROJECT_AUDIT.md` dựa trên bằng chứng bằng cách sử dụng tất cả các vai trò có liên quan. `/init-code` đọc kho lưu trữ một cách tĩnh và tạo ra một `PROJECT_DESCRIPTION.md` dựa trên bằng chứng mà không cần thực thi mã dự án. Khi tệp đó tồn tại, mọi vai trò sửa đổi phải giữ cho các phần bị ảnh hưởng của nó được đồng bộ hóa; mô tả đã được chứng minh khối trôi dạt hoàn thành nhiệm vụ.

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

Mỗi tác nhân cũng có điểm vào `/<agent>:vorcl` riêng để chạy vòng lặp Task Master trong phạm vi tác nhân đó.

### The Task Master loop
Mọi tác vụ không hề nhỏ đều được thực hiện thông qua **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```Điều này giúp công việc được lên kế hoạch, kiểm tra và có thể tiếp tục — không có gì được tuyên bố là "hoàn thành" mà không vượt qua bước xác minh.

---

## The agents| Đại lý | Vai trò | Điểm nổi bật |
| --- | --- | --- |
| 🔵 **kiến trúc sư** | Kiến trúc sư hệ thống & giải pháp | Phân tích yêu cầu, thiết kế hệ thống/DB/API, đánh giá kiến ​​trúc |
| 🏛️ **hiệu trưởng-kiến trúc sư** | Phần mềm chính/cơ sở hạ tầng/kiến trúc sư AI | Quét mã thực bằng 11 ngôn ngữ và tạo MD, JSON, HTML, PDF, draw.io và Mermaid; cập nhật quét toàn bộ giữ lại chú thích |
| 🟢 **phụ trợ** | Nhà phát triển phụ trợ | Nút/TS, Postgres, Redis; kiến trúc mô-đun; mọi tuyến đường được bao phủ hoàn toàn bởi OpenAPI |
| 🟣 **giao diện** | Giao diện người dùng (React 19 / Next.js Bộ định tuyến ứng dụng) | Thành phần, trạng thái, tìm nạp dữ liệu, tối ưu hóa kết xuất/gói, kiểm tra |
| 📱 **expo-mobile** | React Native + Expo kỹ sư | Kiến trúc mô-đun cộng với Hệ thống Thiết kế/Chuyển động/Tương tác, điều hướng gốc, mã thông báo, cử chỉ, xúc giác, Giảm chuyển động |
| 🟠 **máy phân tích** | Trình kiểm tra mã (chỉ đọc) | Lỗi, an toàn kiểu, DB cấu trúc, mô phỏng giao diện người dùng, mùi phụ trợ |
| 🧭 **chính trực** | Trình kiểm tra tính toàn vẹn mã đa ngôn ngữ (chỉ đọc) | Sản xuất mã cứng và rò rỉ giả/giả/demo/cố định trên giao diện người dùng/phụ trợ/di động/chia sẻ |
| 🟡 **vênh vang** | OpenAPI/Swagger bảo hiểm (bất kỳ ngăn xếp nào) | Tìm các tuyến đường không được ghi lại đầy đủ và bao gồm chúng, với xác minh |
| 🔴 **bắn pháo** | Nhà nghiên cứu web | CLI/MCP/REST trực tiếp, tích hợp ứng dụng và quy trình làm việc dữ liệu web đã hoàn thiện |
| 🟤 **kết xuất** | Lưu trữ & triển khai (Render) | Triển khai, chẩn đoán dựa trên nhật ký, số liệu, vars env, Kết xuất Postgres |
| 🟦 **cơ sở dữ liệu** | DB kỹ sư / DBA | Lược đồ, truy vấn & kế hoạch, chỉ mục, N+1, di chuyển có thể đảo ngược an toàn, bộ đệm |
| ⚪ **khả năng phục hồi** | Độ tin cậy: lỗi + ghi nhật ký | thử/bắt ở đúng ranh giới, lỗi đánh máy, thử lại/hết thời gian, nhật ký có cấu trúc |
| 🖼️ **ảnh chụp màn hình** | Ảnh chụp màn hình UI → mã | Biến ảnh chụp màn hình UI thành mã sẵn sàng sản xuất, phản hồi nhanh, dễ truy cập |
| 🎨 **studio-thiết kế** | Studio thiết kế sản phẩm và hình ảnh | HTML hiện vật cục bộ, nguyên mẫu, wireframe, deck/PPTX, tài liệu, hoạt hình, 3D, hệ thống thiết kế và nhập Figma/GitHub/HTML; chuyển thể từ MIT `JimLiu/baoyu-design` |
| 🔎 **nghiên cứu trực quan** | Ảnh chụp màn hình → câu trả lời đã được xác minh | Xác định trang/trang, tìm tài liệu chính thức, kiểm tra dữ liệu trực tiếp và câu trả lời bằng URL và độ tin cậy |
| 🎯 **chính xác** | Ảnh chụp màn hình → đặt vào dự án hiện có (chỉ đọc) | Tạo ảnh chụp màn hình ứng dụng đang chạy trong cơ sở mã thực — thành phần, `file:line`, tuyến/trang, điều khiển chính xác và logic đằng sau nó; không tạo ra gì, ủy quyền chỉnh sửa |
| 📊 **vẽ** | Sơ đồ (draw.io/sơ đồ.net) | Lưu đồ, BPMN, UML, ERD, mạng/đám mây và PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **sơ đồ cổ** | Người vẽ bản đồ kiến ​​trúc | Mã xác định → `architecture.json` (mọi nút có `source:{file,line}`) → bản đồ HTML tương tác, draw.io, Mermaid, ARCHITECTURE.md, PDF; sự thật chưa được chứng minh được đánh dấu `inferred` |
| 🧜 **nàng tiên cá** | Mermaid sơ đồ (+ kết xuất thực) | sơ đồ, trình tự, lớp, trạng thái, ER, gantt, gitGraph, mindmap…; được xác nhận thông qua mcp-mermaid/`mmdc`; đưa cho bạn tập tin (`.mmd` + SVG/PNG/PDF) |
| 🧪 **thử nghiệm** | Kỹ sư kiểm tra và xác minh | Đơn vị (Vitest/Jest), tích hợp (Supertest), E2E (Playwright), phạm vi bao phủ, săn tìm thử nghiệm không ổn định; thực thi `testStrategy` của mỗi nhiệm vụ — không có gì được "hoàn thành" nếu không có lần chạy màu xanh lục |
| 🌿 **gitflow** | Git quy trình làm việc & phát hành | Cam kết thông thường, cam kết theo tên (không bao giờ `git add .`), PR, Keep-a-Changelog, phát hành học kỳ; chỉ đẩy khi có xác nhận rõ ràng |
| 🛡️ **bảo mật** | Kiểm toán viên bảo mật (chỉ đọc) | Bí mật trong lịch sử cây & git, Top 10 OWASP, CVE phụ thuộc, PII; những phát hiện trở thành nhiệm vụ — việc sửa lỗi được ủy quyền || 📝 **tài liệu** | Kỹ sư tài liệu | README (tương đương đa ngôn ngữ), API tài liệu từ OpenAPI, KIẾN TRÚC, ĐÓNG GÓP, ghi chú phát hành; mọi ví dụ được xác minh theo mã |
| 🐳 **devops** | Thùng chứa & CI/CD | Dockerfiles đa tầng, docker-compose dành cho nhà phát triển cục bộ, GitHub Đường ống hành động, vệ sinh môi trường/bí mật, giám sát |
| 📡 **bảng trực tiếp** | Ban điều hành địa phương | Git sơ đồ công việc trực tiếp, quy trình tác nhân và Task Master nhiệm vụ trên bảng điều khiển localhost tạm thời |

**Một số điều đáng biết:**
- **Frontend luôn nói chuyện với một API thực sự.** Thông số OpenAPI của phần phụ trợ là nguồn sự thật duy nhất; các loại được tạo ra từ nó (`openapi-typescript` + `openapi-fetch`). Không có mô hình nào trong quá trình sản xuất.
- **`database` đột biến yêu cầu xác nhận rõ ràng.** Phân tích ở chế độ chỉ đọc; các thay đổi lược đồ/dữ liệu (DDL/DML/di chuyển) không bao giờ chạy nếu không có sự đồng ý của bạn.
- **`resilience` gửi một móc an toàn.** Một móc `PostToolUse` (`catch-guard.js`) không chặn nhẹ nhàng gắn cờ các khối `catch {}` trống trong các tệp bạn vừa chỉnh sửa.
- **`archmap` không bao giờ dựa trên trí tưởng tượng.** Quá trình trích xuất và hiển thị được tách biệt hoàn toàn: các tập lệnh không phụ thuộc đưa kho lưu trữ vào `architecture.json` (cơ sở dữ liệu với số lượng FK thực, API tuyến đường, tác nhân AI với mô hình/công cụ/bộ nhớ của chúng, biểu đồ nhập, env) và mọi sơ đồ chỉ được hiển thị từ JSON đó. Bất cứ điều gì LLM thêm vào mà không có `file:line` có thể kiểm chứng đều được đánh dấu bắt buộc `inferred:true` và được vẽ nét đứt.
- **`principal-architect` là quy trình xuất bản kiến trúc đầy đủ.** Nó hoạt động trong bất kỳ kho lưu trữ nào khởi chạy tác nhân, bỏ qua các tuyên bố Markdown làm bằng chứng cấu trúc liên kết, sử dụng WASM Tree-sitter ngoại tuyến đi kèm cho TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin và Swift, viết `ARCHITECTURE.md` trước, sau đó tạo mô hình JSON dùng chung, HTML độc lập, PDF, draw.io gốc và có thể sao chép Mermaid L0–L4. `update` thực hiện quét lại toàn bộ và giữ lại các chú thích cũng như các tệp không được quản lý.
- **`pinpoint` tìm thấy, không bao giờ tạo.** Đưa ra một ảnh chụp màn hình của một ứng dụng đang chạy, nó ánh xạ màn hình tới mã thực — thành phần, tuyến đường, điều khiển chính xác và logic đằng sau nó — và chuyển quyền chỉnh sửa cho `frontend`/`backend`. Nó hoạt động trên những gì đã tồn tại (nghịch đảo của `screenshot`).
- **`visual-research` xác minh thay vì đoán.** Nó coi ảnh chụp màn hình làm bằng chứng, xác nhận tên miền và tài liệu chính thức, kiểm tra dữ liệu trang web hiện tại và gắn cờ các giá trị lừa đảo hoặc cũ có thể có.
- **`i18n` thực thi "mã hóa cứng ngôn ngữ bằng 0."** Trước tiên, các tác nhân sẽ phát hiện xem một dự án có đa ngôn ngữ hay không và điều chỉnh — các chuỗi giao diện người dùng đi qua một lớp dịch (next-intl / Reac-i18next / i18next), không bao giờ nội tuyến.

---

## Command referenceMọi lệnh dưới đây đều là lệnh gạch chéo. `<…>` đánh dấu đầu vào của bạn.

### `/vorcl` — universal router
| Lệnh | Nó làm gì |
| --- | --- |
| `/vorcl <goal>` | Biến bất kỳ mục tiêu nào thành nhiệm vụ và định tuyến mục tiêu đó đến tác nhân phụ phù hợp, sau đó thực hiện toàn bộ chu trình để hoàn thành. |
| `/audit [path] [focus]` | Kiểm tra đa vai trò chỉ đọc sâu → hệ thống được phát hiện, phát hiện về bảo mật/CVE/khả năng phục hồi, kiến ​​trúc mục tiêu và `PROJECT_AUDIT.md` theo từng giai đoạn. |
| `/init-code [path] [--update]` | Khám phá cơ sở mã tĩnh → dựa trên bằng chứng `PROJECT_DESCRIPTION.md`; mã dự án không bao giờ được thực thi. |

### 🔵 architect — architecture
| Lệnh | Nó làm gì |
| --- | --- |
| `/architect:vorcl <goal>` | Mục tiêu → nhiệm vụ → chu trình, trong phạm vi kiến ​​trúc. |
| `/architect:analyze <context>` | Phân tích các yêu cầu và bối cảnh của nhiệm vụ. |
| `/architect:design <problem>` | Thiết kế kiến ​​trúc giải pháp (hệ thống, DB, API). |
| `/architect:review <target>` | Xem lại một kiến ​​trúc hiện có. |

### 🏛️ principal-architect — code-grounded architecture package
| Lệnh | Nó làm gì |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Chạy một mục tiêu kiến ​​trúc lớn thông qua Task Master và các tạo phẩm đã được xác minh. |
| `/principal-architect:create [options]` | Quét kho lưu trữ hiện tại và tạo MD, JSON, HTML, PDF, draw.io và Mermaid từ bằng chứng mã. |
| `/principal-architect:update [options]` | Quét lại toàn bộ gói hiện có, viết một bằng chứng khác biệt và làm mới một cách nguyên tử các tạo phẩm được tạo ra. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| Lệnh | Nó làm gì |
| --- | --- |
| `/backend:vorcl <goal>` | Mục tiêu → nhiệm vụ → chu trình cho công việc phụ trợ. |
| `/backend:create-api <endpoint>` | Tạo điểm cuối API trên kiến ​​trúc mô-đun, được bao phủ hoàn toàn bởi OpenAPI. |
| `/backend:refactor <target>` | Mã tái cấu trúc mà không thay đổi hành vi. |
| `/backend:optimize <target>` | Tối ưu hóa hiệu suất. |
| `/backend:test <target>` | Tạo các bài kiểm tra cho mã. |

### 🟣 frontend — React / Next.js
| Lệnh | Nó làm gì |
| --- | --- |
| `/frontend:vorcl <goal>` | Mục tiêu → nhiệm vụ → chu trình cho công việc giao diện người dùng. |
| `/frontend:create-component <spec>` | Tạo thành phần UI theo cấu trúc tính năng. |
| `/frontend:refactor <target>` | Tái cấu trúc UI / hook mà không thay đổi hành vi. |
| `/frontend:optimize <target>` | Tối ưu hóa kết xuất/gói/Core Web Vitals. |
| `/frontend:test <target>` | Tạo các bài kiểm tra thành phần. |

### 📱 expo-mobile — React Native / Expo

| Lệnh | Nó làm gì |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Mục tiêu → Task Master chu trình cho Expo công việc di động. |
| `/expo-mobile:create-module <domain>` | Tạo một lát cắt kinh doanh theo mô-đun chỉ với các lớp mà độ phức tạp của nó cần. |
| `/expo-mobile:create-screen <flow>` | Tạo một tuyến Expo Router mỏng cùng với màn hình và trạng thái do mô-đun sở hữu. |
| `/expo-mobile:design-screen <flow>` | Xây dựng màn hình cao cấp với các mã thông báo chuyển động/thiết kế được chia sẻ, trạng thái và khả năng truy cập. |
| `/expo-mobile:motion <interaction>` | Thiết kế điều hướng gốc, lò xo, cử chỉ, xúc giác và dự phòng giảm chuyển động. |
| `/expo-mobile:add-api <contract>` | Thêm khóa lược đồ/DTO/mapper/truy vấn và tích hợp TanStack Query. |
| `/expo-mobile:audit [scope]` | Bảo vệ kiến ​​trúc chỉ đọc và kiểm tra dựa trên bằng chứng. |
| `/expo-mobile:ui-audit [scope]` | Hệ thống thiết kế chỉ đọc, chuyển động, tương tác, khả năng truy cập và kiểm tra hiệu suất. |
| `/expo-mobile:compatibility [app] [change]` | Kiểm tra khả năng tương thích trực tiếp Expo/RN/Node/gói/thời gian chạy gốc chỉ đọc trực tiếp với các nguồn chính thức đã được phiên bản. |
| `/expo-mobile:test <scope>` | Chạy đơn vị miền, React Native Thư viện kiểm tra và Maestro kiểm tra. |

### 🟠 analyzer — code audit (read-only)
| Lệnh | Nó làm gì |
| --- | --- |
| `/analyzer:vorcl <goal>` | Kiểm tra mục tiêu thông qua Task Master — các phát hiện trở thành nhiệm vụ. |
| `/analyzer:audit` | Kiểm tra đầy đủ: lỗi, loại, DB, mô phỏng giao diện người dùng, mùi phụ trợ. |
| `/analyzer:bugs` | Săn lỗi - lỗi chưa được xử lý, điều kiện chạy đua, trường hợp khó khăn. |
| `/analyzer:types` | Kiểm tra kiểu — `tsc`, `any`, diễn xuất không an toàn, trôi dạt kiểu zod↔. |
| `/analyzer:db` | Kiểm tra cấu trúc DB — lược đồ, chỉ mục, FK, N+1, di chuyển. |
| `/analyzer:mocks` | Lộ trình tương thích cho dữ liệu giả/giả trên giao diện người dùng và phụ trợ; đại biểu kiểm tra đa ngôn ngữ sâu về tính toàn vẹn. |
| `/analyzer:backend` | Tìm mã phụ trợ "xấu" — vi phạm kiến ​​trúc, logic trong bộ điều khiển. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)| Lệnh | Nó làm gì |
| --- | --- |
| `/integrity:vorcl <goal>` | Thực hiện mục tiêu toàn vẹn không tầm thường thông qua Task Master và biến các phát hiện thành nhiệm vụ dành riêng cho chủ sở hữu. |
| `/integrity:audit [path]` | Quét mã cứng và mô phỏng rò rỉ cùng nhau, sau đó chứng minh khả năng tiếp cận sản xuất. |
| `/integrity:hardcode [path]` | Tìm các ký tự người dùng/config/doanh nghiệp bỏ qua quá trình bản địa hóa, cấu hình hoặc hệ thống bản ghi. |
| `/integrity:mocks [path]` | Tìm các khung mô phỏng, trình tạo giả, đồ đạc, dữ liệu demo và phản hồi tĩnh có thể truy cập được từ quá trình sản xuất. |

Trình quét không phụ thuộc đi kèm hỗ trợ TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML và Razor. Trên mã phụ trợ, nó cũng gắn cờ các giá trị nghiệp vụ ẩn trong các hằng số, trường tĩnh/cuối cùng, tham số mặc định, đối số được đặt tên và danh mục tĩnh; Sau đó, kiểm toán viên so sánh chúng với các đột biến lược đồ/mô hình/kho/truy vấn/quản trị viên để chứng minh rằng cơ sở dữ liệu—không phải mã hay cấu hình—sở hữu giá trị. Các bài kiểm tra, đồ đạc, câu chuyện, ví dụ, hạt giống, mã được tạo và nguồn gốc của nhà cung cấp bị chặn theo mặc định; các ứng cử viên từ vựng không phải là khiếm khuyết cho đến khi khả năng tiếp cận và quyền sở hữu được chứng minh.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| Lệnh | Nó làm gì |
| --- | --- |
| `/swagger:vorcl <goal>` | Mục tiêu bao quát toàn diện thông qua Task Master — kiểm tra → nhiệm vụ → bao quát → xác minh. |
| `/swagger:audit` | Chỉ đọc: tìm các tuyến đường không được bao gồm đầy đủ trong thông số kỹ thuật. |
| `/swagger:cover <route>` | Bao gồm một lộ trình/mô-đun - thông số, phản hồi, mô tả, bảo mật + xác minh. |

### 🔴 firecrawl — web research
| Lệnh | Nó làm gì |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Mục tiêu nghiên cứu thông qua Task Master — thu thập dữ liệu web để có được kết quả cuối cùng. |
| `/firecrawl:search <query>` | Tìm kiếm trên web các nguồn về một câu hỏi. |
| `/firecrawl:scrape <url>` | Quét một URL vào markdown/JSON. |
| `/firecrawl:map <url>` | Ánh xạ các URL của trang web. |
| `/firecrawl:crawl <url>` | Thu thập dữ liệu đệ quy một phần/trang web. |
| `/firecrawl:extract <url>` | Trích xuất có cấu trúc bằng lược đồ JSON. |
| `/firecrawl:setup` | Cài đặt/xác minh CLI cộng với các kỹ năng xây dựng và quy trình làm việc chính thức (có xác nhận). |
| `/firecrawl:interact <url>` | Nhấp, điều hướng hoặc điền vào biểu mẫu khi việc cạo không đủ. |
| `/firecrawl:parse <file>` | Phân tích tài liệu cục bộ/riêng tư thành markdown hoặc JSON. |
| `/firecrawl:monitor <action>` | Liệt kê các lần kiểm tra hoặc quản lý các màn hình thay đổi trang định kỳ. |
| `/firecrawl:agent <goal>` | Chạy một tác vụ Firecrawl Tác nhân dài hạn có giới hạn. |
| `/firecrawl:research <query>` | Tìm kiếm tài liệu và GitHub bối cảnh nghiên cứu. |
| `/firecrawl:ask <jobId>` | Chẩn đoán công việc Firecrawl thất bại. |
| `/firecrawl:docs-search <question>` | Tìm kiếm tài liệu Firecrawl chính thức hiện tại. |
| `/firecrawl:integrate <feature>` | Thêm Firecrawl vào mã ứng dụng thông qua các kỹ năng xây dựng ngược dòng. |
| `/firecrawl:deliverable <artifact>` | Tạo một bản tóm tắt, kiểm tra, danh sách khách hàng tiềm năng hoặc tạo phẩm quy trình công việc khác. |`/firecrawl:setup` chỉ chạy luồng `firecrawl-cli init --all` chính thức sau khi được xác nhận. Các kỹ năng `firecrawl-*` chính thức hiện có được ưu tiên và được giữ nguyên bởi trình cài đặt Codex/Cursor; AVF cung cấp các phương án dự phòng tương thích cho các kỹ năng còn thiếu. Định tuyến hoạt động trực tiếp thông qua CLI → MCP → REST/không cần chìa khóa.

### 🟤 render — hosting / deploy (Render)
| Lệnh | Nó làm gì |
| --- | --- |
| `/render:vorcl <goal>` | Mục tiêu hồng ngoại thông qua Task Master — triển khai/chẩn đoán/cấu hình là xong. |
| `/render:deploy <service>` | Triển khai/triển khai lại một dịch vụ. |
| `/render:logs <service>` | Nhật ký dịch vụ và chẩn đoán về nguyên nhân gốc rễ. |
| `/render:status <service>` | Trạng thái dịch vụ + triển khai + số liệu. |
| `/render:query <sql>` | SQL chỉ đọc đối với Kết xuất Postgres. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| Lệnh | Nó làm gì |
| --- | --- |
| `/database:vorcl <goal>` | Mục tiêu dữ liệu thông qua Task Master — lược đồ/truy vấn/di chuyển/bộ đệm cần thực hiện. |
| `/database:query <query>` | Truy vấn/phân tích chỉ đọc. |
| `/database:schema <target>` | Thiết kế/xem xét lược đồ và tính toàn vẹn dữ liệu. |
| `/database:migrate <change>` | Lập kế hoạch di chuyển lược đồ/dữ liệu an toàn, có thể đảo ngược. |
| `/database:optimize <target>` | Tối ưu hóa — chỉ mục, N+1, kế hoạch truy vấn, phân trang. |
| `/database:cache <target>` | Redis — TTL, vô hiệu, khóa, giới hạn tốc độ, Luồng. |

### ⚪ resilience — error handling + logging
| Lệnh | Nó làm gì |
| --- | --- |
| `/resilience:vorcl <goal>` | Mục tiêu về độ tin cậy thông qua Task Master — mã bao gồm nhật ký thử/bắt +. |
| `/resilience:harden <target>` | Gói mã trong thử/bắt/cuối cùng bằng tính năng ghi nhật ký chắc chắn, không có lỗi thầm lặng. |
| `/resilience:logging <target>` | Thêm/sửa ghi nhật ký có cấu trúc — cấp độ, ngữ cảnh, không có bí mật/PII. |
| `/resilience:audit` | Chỉ đọc: tìm những lỗi thất bại thầm lặng, sản phẩm đánh bắt trống, khoảng trống ghi nhật ký. |

### 🪵 logging — Pino structured logging
| Command | What it does |
| --- | --- |
| `/logging:vorcl <goal>` | Logging goal via Task Master — cover or update the Pino package. |
| `/logging:audit [path]` | Read-only: one root logger, child context, redact, no console/Loki sink. |
| `/logging:cover <target>` | Create `infrastructure/logging` and cover a module/worker/route. |
| `/logging:update <target>` | Bring legacy `pino()`/`console.log` to the canonical package. |


### 🖼️ screenshot — screenshot UI → code
| Lệnh | Nó làm gì |
| --- | --- |
| `/screenshot:vorcl <goal>` | Một tập hợp các màn hình từ ảnh chụp màn hình thông qua Task Master — phân tích → mã. |
| `/screenshot:analyze <image>` | Phân tích chỉ đọc - bố cục, thành phần, mã thông báo, trạng thái → kế hoạch. |
| `/screenshot:convert <image> [framework]` | Tạo mã có thể chạy đầy đủ từ ảnh chụp màn hình (mặc định React + Tailwind v4). |
| `/screenshot:tokens <image>` | Trích xuất mã thông báo thiết kế (màu OKLCH, kiểu chữ, khoảng cách) vào Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Làm cho UI được tạo đáp ứng — các truy vấn điểm ngắt, linh hoạt, `clamp()`, vùng chứa. |

### 🎨 design-studio — product and visual design
| Lệnh | Nó làm gì |
| --- | --- |
| `/design-studio:vorcl <goal>` | Mục tiêu thiết kế đầy đủ thông qua Task Master — bối cảnh → các biến thể → HTML → xem trước → xác minh → xuất. |
| `/design-studio:create <brief>` | Tạo tạo tác trực quan khép kín được đánh bóng hoặc hi-fi UI. |
| `/design-studio:prototype <flow>` | Xây dựng nguyên mẫu web/di động tương tác với các trạng thái và chuyển tiếp. |
| `/design-studio:wireframe <flow>` | Xây dựng wireframe low-fi tập trung vào kiến ​​trúc thông tin và UX. |
| `/design-studio:design-system <operation>` | Tạo, nhập, biên dịch, liên kết, làm mới hoặc kiểm tra hệ thống thiết kế. |
| `/design-studio:import <type> <source>` | Nhập Figma `.fig`, GitHub hoặc HTML/CSS có xuất xứ. |
| `/design-studio:deck <brief>` | Xây dựng một bản HTML với ghi chú của diễn giả, hình động và PPTX có thể chỉnh sửa tùy chọn. |
| `/design-studio:document <brief>` | Xây dựng một tài liệu, sơ yếu lý lịch, bản ghi nhớ, một trang hoặc báo cáo sẵn sàng để in. |
| `/design-studio:animation <brief>` | Xây dựng một tạo phẩm chuyển động và tùy ý hiển thị nó thành MP4. |
| `/design-studio:research <question>` | Tạo một tạo phẩm nghiên cứu trực quan dựa trên nguồn. |
| `/design-studio:export <project> <format>` | Xuất sang định dạng HTML, PDF, PPTX, MP4 độc lập hoặc định dạng chuyển giao. |
| `/design-studio:review <target>` | Đánh giá trực quan chỉ đọc, UX, phản hồi, a11y và hệ thống thiết kế. |

### 🔎 visual-research — screenshot → verified web answer
| Lệnh | Nó làm gì |
| --- | --- |
| `/visual-research:vorcl <goal>` | Nghiên cứu ảnh chụp màn hình nhiều bước thông qua Task Master. |
| `/visual-research:identify <image>` | Xác định trang web, trang và tính năng bằng bằng chứng đáng tin cậy. |
| `/visual-research:search <image> <target>` | Tìm trang thật hoặc tài liệu chính thức từ manh mối trực quan. |
| `/visual-research:answer <image> <question>` | Trả lời bằng bằng chứng ảnh chụp màn hình, tài liệu chính thức và dữ liệu trực tiếp hiện tại. |
| `/visual-research:hints <image> <goal>` | Đưa ra các bước an toàn, có tài liệu hỗ trợ cho giao diện hiển thị. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| Lệnh | Nó làm gì |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Tìm/hiểu/thay đổi UI hiện có từ ảnh chụp màn hình thông qua Task Master — bản đồ → nhiệm vụ → đại biểu. |
| `/pinpoint:locate <image>` | Xác định (các) thành phần/tệp hiện có từ ảnh chụp màn hình — `file:line`, không có mã mới. |
| `/pinpoint:route <image>` | Xác định tuyến đường/trang mà màn hình đang bật (Next.js Bộ định tuyến ứng dụng/trang, React Bộ định tuyến). |
| `/pinpoint:control <image>` | Xác định chính xác điều khiển (nút/trường) và trình xử lý của nó trong mã. |
| `/pinpoint:trace <target>` | Theo dõi logic đằng sau một phần tử — trình xử lý → trạng thái → tìm nạp dữ liệu → API. || `/pinpoint:handoff <change>` | Xây dựng yêu cầu chỉnh sửa chính xác dựa trên mã hiện có và ủy quyền cho `frontend`/`backend`. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| Lệnh | Nó làm gì |
| --- | --- |
| `/drawio:vorcl <goal>` | Một tập hợp các sơ đồ thông qua Task Master — xây dựng để hoàn thành. |
| `/drawio:create <description> [type]` | Xây dựng sơ đồ từ mô tả văn bản (XML gốc hợp lệ). |
| `/drawio:pmp <type> <project>` | Xây dựng sơ đồ PMP/PMBOK - WBS, PERT/CPM, Gantt, RACI, ma trận rủi ro, lưới các bên liên quan. |
| `/drawio:convert <source> [type]` | Chuyển đổi nguồn thành sơ đồ — DB lược đồ → ERD, thư mục → cây, mã → UML, nàng tiên cá/CSV/JSON. |
| `/drawio:refine <file>` | Tinh chỉnh `.drawio` hiện có — bố cục, chủ đề, thêm/xóa nút, căn chỉnh theo lưới. |

### 🗺️ archmap — architecture map from code| Lệnh | Nó làm gì |
| --- | --- |
| `/archmap:vorcl <goal>` | Mục tiêu ánh xạ thông qua Task Master — xây dựng một tập hợp tạo phẩm đã được xác minh. |
| `/archmap:map [repo]` | Quy trình đầy đủ: trích xuất → `architecture.json` → Chú thích LLM → tất cả các định dạng (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Chỉ trích xuất — `architecture.json` có thể đọc được bằng máy với `source:{file,line}` trên mỗi nút. |
| `/archmap:annotate [json]` | Làm phong phú LLM của một `architecture.json` hiện có (bộ nhớ tác nhân, ngữ nghĩa luồng dữ liệu); sự thật chưa được chứng minh tự động bị giáng cấp xuống `inferred`. |
| `/archmap:html [json]` | Bản đồ HTML khép kín mang tính tương tác — chuyển đổi lớp, chùm dấu vết, nút → bảng điều khiển, tìm kiếm, in CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (nhiều trang: Tổng quan / ERD / API / Đại lý) và/hoặc chế độ xem Mermaid, đã được xác thực. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| Lệnh | Nó làm gì |
| --- | --- |
| `/mermaid:vorcl <goal>` | Một tập hợp các sơ đồ thông qua Task Master — xây dựng để hoàn thành (xác minh kết xuất). |
| `/mermaid:create <description> [type]` | Xây dựng sơ đồ từ mô tả — cú pháp hợp lệ, được xác minh bằng kết xuất thực; đưa cho bạn tập tin. |
| `/mermaid:convert <source> [type]` | Chuyển đổi nguồn thành Mermaid — lược đồ DB → ER, mã → lớp/trình tự, thư mục → sơ đồ, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Cú pháp + kiểm tra kết xuất thực; tìm và sửa lỗi (mmdc/Maid/mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Xuất sang SVG/PNG/PDF (nàng tiên cá-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Tinh chỉnh một `.mmd` hiện có — hướng, sơ đồ con, classDef/styles, khả năng đọc. |

### 🧪 testing — tests & verification
| Lệnh | Nó làm gì |
| --- | --- |
| `/testing:vorcl <goal>` | Mục tiêu kiểm tra/xác minh thông qua Task Master — đơn vị + tích hợp + e2e đã hoàn thành. |
| `/testing:unit <file\|module>` | Kiểm tra đơn vị (Vitest/Jest) - con đường hạnh phúc, ranh giới, lỗi; chạy chúng và hiển thị đầu ra. |
| `/testing:integration <endpoint\|module>` | Kiểm tra tích hợp (Supertest/tiêm, DB thực hoặc bộ chứa thử nghiệm). |
| `/testing:e2e <scenario>` | Playwright E2E dành cho đường dẫn người dùng quan trọng — bộ chọn vai trò, cố định, theo dõi lỗi. |
| `/testing:verify <task\|testStrategy>` | Thực thi `testStrategy` của tác vụ và trả về kết quả SẴN SÀNG / KHÔNG SẴN SÀNG với đầu ra thực. |
| `/testing:coverage [path]` | Báo cáo đưa tin với các phát hiện - mã quan trọng nào chưa được kiểm tra; tạo ra các nhiệm vụ. |
| `/testing:flaky <test>` | Chẩn đoán bài kiểm tra không ổn định (cuộc đua, thời gian, trạng thái chia sẻ, mô hình) và khắc phục nó vĩnh viễn. |

### 🌿 gitflow — git workflow & releases
| Lệnh | Nó làm gì |
| --- | --- |
| `/gitflow:vorcl <goal>` | Mục tiêu git/phát hành thông qua Task Master (chuẩn bị một bản phát hành, dọn dẹp lịch sử, nhánh tính năng). |
| `/gitflow:commit <files\|scope>` | Cam kết theo tên (không bao giờ `git add .`) với thông báo Cam kết thông thường; dừng trên WIP không xác định. |
| `/gitflow:pr <base> <title>` | Nhánh → cam kết → kéo yêu cầu (gh / GitHub MCP) với cái gì/tại sao/xác minh như thế nào. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Giữ nhật ký thay đổi) được tạo từ các lần xác nhận giữa các thẻ. |
| `/gitflow:release <version\|auto>` | Phân đoạn từ các lần xác nhận → đồng bộ hóa các phiên bản bảng kê khai → thẻ → GitHub phát hành. Chỉ đẩy sau khi xác nhận rõ ràng. |
| `/gitflow:audit [branch]` | Kiểm tra lịch sử chỉ đọc: vi phạm quy ước, cam kết kết xuất, các đốm màu lớn, các nhánh mồ côi. |

### 🛡️ security — security audit (read-only)
| Lệnh | Nó làm gì |
| --- | --- |
| `/security:vorcl <goal>` | Mục tiêu bảo mật thông qua Task Master — kiểm tra → phát hiện → nhiệm vụ → sửa lỗi được ủy quyền. |
| `/security:secrets [path\|branch]` | Bí mật trong cây làm việc VÀ lịch sử git (tất cả các nhánh); `${VAR:-}` phần giữ chỗ không phải là bí mật. |
| `/security:owasp [path]` | OWASP Top 10 trong mã: tiêm, XSS, xác thực, hiển thị dữ liệu, CORS/cookie - với tệp:bằng chứng dòng. |
| `/security:deps` | CVE phụ thuộc thông qua npm kiểm tra / tệp khóa — mức độ nghiêm trọng, cờ phá vỡ thay đổi. |
| `/security:pii [path]` | Rủi ro PII/GDPR: email, điện thoại, thẻ dưới dạng mã và nhật ký; đường dẫn riêng của nhà phát triển. |
| `/security:pre-push [branch]` | Kiểm tra kết hợp nhanh các tệp đã thay đổi trước khi đẩy: bí mật + tiêm + PII; phán quyết xanh/đỏ. |

### 📝 docs — documentation
| Lệnh | Nó làm gì |
| --- | --- |
| `/docs:vorcl <goal>` | Mục tiêu tài liệu thông qua Task Master. |
| `/docs:readme [path]` | Tạo/cập nhật README — what/quickstart/usage/config/khắc phục sự cố; ví dụ đã được xác minh; phiên bản ngôn ngữ được đồng bộ hóa. |
| `/docs:api [spec]` | API tài liệu được tạo từ thông số OpenAPI (điểm cuối, thông số, ví dụ về đường cong); gợi ý `/swagger:audit` nếu không có thông số kỹ thuật. |
| `/docs:architecture` | ARCHITECTURE.md — mô-đun, ranh giới, luồng dữ liệu; sơ đồ được ủy quyền cho `mermaid`/`drawio`. || `/docs:contributing` | CONTRIBUTING.md — thiết lập, cấu trúc, kiểm tra, quy ước cam kết (liên kết với `gitflow`), quy trình PR. |
| `/docs:release-notes <version>` | Ghi chú phát hành cho một phiên bản từ CHANGELOG/history. |
| `/docs:audit` | Kiểm tra độ trôi mã của tài liệu chỉ đọc: liên kết bị hỏng, ví dụ/bộ đếm cũ, bản dịch không được đồng bộ hóa. |

### 🐳 devops — containers & CI/CD
| Lệnh | Nó làm gì |
| --- | --- |
| `/devops:vorcl <goal>` | Mục tiêu cơ sở hạ tầng thông qua Task Master. |
| `/devops:dockerfile [app-type]` | Viết/đánh giá Dockerfile — đa tầng, cơ sở mỏng, không root, KIỂM TRA SỨC KHỎE; được xác minh bởi `docker build` thực. |
| `/devops:compose` | docker-compose.yml dành cho nhà phát triển cục bộ (ứng dụng + DB); Thay đổi env cần `--force-recreate`, chờ sức khỏe. |
| `/devops:ci [type]` | GitHub Hành động — Quy trình PR (lint+typecheck+test, npm cache), quy trình triển khai, quyền tối thiểu. |
| `/devops:env` | Khoảng không quảng cáo biến Env: nơi đọc, những gì được yêu cầu, `.env.example` mẫu; bí mật không bao giờ có trong hình ảnh. |
| `/devops:monitoring` | Nhật ký có cấu trúc (pino/JSON), điểm cuối sức khỏe, nội dung cần cảnh báo; Kết xuất số liệu thông qua tác nhân `render`. |

### 📡 liveboard — ephemeral local operations board
| Lệnh | Nó làm gì |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Bắt đầu bảng điều khiển 43 ngôn ngữ tinh tế trên cổng localhost miễn phí; Task Master các thay đổi được truyền qua SSE và điều chỉnh sau mỗi 5 phút. |
| `/liveboard:vorcl <goal>` | Phát triển hoặc thay đổi liveboard thông qua quy trình làm việc Task Master cần thiết. |

Liveboard đọc Git cây làm việc, các tiến trình Claude/Codex/Cursor cục bộ và `.taskmaster/tasks/tasks.json` của mỗi cây làm việc. Trạng thái thời gian chạy vẫn còn trong bộ nhớ và biến mất khi quá trình tiền cảnh dừng lại. UI phát hiện ngôn ngữ trình duyệt và cung cấp 43 ngôn ngữ, bao gồm tiếng Anh, tiếng Nga, tiếng Ukraina, tiếng Đức, tiếng Pháp, tiếng Tây Ban Nha, tiếng Bồ Đào Nha, tiếng Ý, tiếng Ba Lan, tiếng Thổ Nhĩ Kỳ, tiếng Trung, tiếng Nhật, tiếng Ả Rập, tiếng Hà Lan, tiếng Séc, tiếng Slovak, tiếng Rumani, tiếng Hungary, tiếng Bungari, tiếng Serbia, tiếng Croatia, tiếng Slovenia, tiếng Hy Lạp, tiếng Do Thái, tiếng Ba Tư, tiếng Hindi, tiếng Bengali, tiếng Urdu, tiếng Indonesia, tiếng Mã Lai, tiếng Việt, tiếng Thái, tiếng Hàn, tiếng Thụy Điển, tiếng Na Uy, tiếng Đan Mạch, tiếng Phần Lan, tiếng Estonia, tiếng Latvia, tiếng Litva, tiếng Georgia, tiếng Armenia và Tiếng Azerbaijan. Tiếng Ả Rập, tiếng Do Thái, tiếng Ba Tư và tiếng Urdu sử dụng bố cục RTL.

Cấu hình trực tiếp:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: dự án có Git cây công việc và các tập tin Task Master được quét.
- `--port 0`: tự động chọn cổng còn trống.
- `--interval`: khoảng thời gian đối chiếu đầy đủ tính bằng mili giây; tập tin đang xem các luồng tĩnh Task Master thay đổi ngay lập tức.
- Điểm cuối: `/health`, `/api/snapshot`, `/api/events` (SSE), và `POST /api/refresh`.
- Giữ `--host 127.0.0.1` trừ khi bạn có ý định rõ ràng tiết lộ thông tin dự án trên mạng.

---

## Configuration (MCP & keys)

Gói này không có phần phụ trợ hoặc cơ sở dữ liệu từ xa**. Liveboard tùy chọn là một quy trình trong bộ nhớ chỉ dành cho localhost. MCP máy chủ cần mã thông báo và **mỗi người dùng cung cấp mã thông báo của riêng họ**. Để làm cho tính năng này hoạt động giống hệt nhau trên **Claude Code, Codex, Cursor và Kimi CLI** — và cho dù bạn khởi chạy từ thiết bị đầu cuối hay từ Dock / Spotlight / IDE — mọi máy chủ stdio MCP đều được khởi động thông qua một trình khởi chạy nhỏ (`bin/mcp-env.mjs`) đọc khóa của bạn từ **một tệp**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Trình cài đặt tạo nó từ [`.env.example`](../.env.example). Mở nó và chỉ điền vào các phím bạn sử dụng:

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

> **Tại sao trình khởi chạy thay vì `~/.zshrc`?** Bản mở rộng Env-var khác nhau theo thời gian chạy (`${VAR:-}` trong Claude, `${env:VAR}` trong Cursor, chữ trong Codex/Kimi) và mỗi thời gian chạy chỉ đọc môi trường **it** được khởi chạy. GUI / IDE khởi chạy trên macOS không lấy nguồn `~/.zshrc`, do đó, các khóa được xuất sẽ ẩn và máy chủ không kết nối với gì — lỗi "MCP env not set" cổ điển. Việc đọc từ một tệp `.env` sẽ loại bỏ cả hai vấn đề cùng một lúc.

**Ưu tiên** (sau này sẽ thắng): `~/.config/agent-vorcl-flow/.env` → a `./.env` được chia sẻ trong thư mục gốc của dự án → một `export` thực trong shell của bạn. Giữ các khóa chung trong tệp được chia sẻ, ghi đè lên từng dự án (ví dụ: một `MONGODB_URI` khác) bằng một dự án `.env` và việc xuất shell chính hãng vẫn thắng trong CLI lần chạy. Bạn có thể trỏ trình khởi chạy tới một tệp khác bằng `AGENT_VORCL_ENV_FILE=/path/.env`.Một máy chủ bị thiếu khóa yêu cầu chỉ **không khởi động** — bạn sẽ thấy một dòng `[agent-vorcl-flow] MCP «…» is not configured: …` trong nhật ký MCP của thời gian chạy và mọi máy chủ khác vẫn tiếp tục hoạt động. Thêm khóa vào `.env` và khởi động lại. (Bạn có thể giữ lại tên `GITHUB_TOKEN`/`MONGODB_URI` — trình khởi chạy ánh xạ chúng tới `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` mà máy chủ mong đợi.)

> ⚠️ **Bắt buộc đối với các lệnh Task Master được hỗ trợ bởi AI:** định cấu hình ít nhất một nhà cung cấp đã chọn — `ANTHROPIC_API_KEY` cho Claude, `OPENAI_API_KEY` cho GPT hoặc Codex CLI OAuth. Nếu không có thông tin xác thực cho mô hình được chọn trong `.taskmaster/config.json`, `/vorcl` không thể tạo hoặc mở rộng tác vụ.

Chọn nhà cung cấp Task Master nào thực sự điều hành việc tạo; riêng các phím không chọn kiểu máy:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

Lệnh sử dụng luồng `task-master models` chính thức và chỉ lưu trữ lựa chọn mô hình trong `.taskmaster/config.json`. `PERPLEXITY_API_KEY` là tùy chọn và chỉ cần thiết khi Perplexity được chọn làm mô hình nghiên cứu.

Các máy chủ **vercel** và **render** từ xa sử dụng OAuth (ủy quyền bằng `/mcp` trong trình duyệt). Đối với Kết xuất ở dạng không có đầu/CI, hãy đặt `RENDER_API_KEY` trong môi trường của bạn và thêm mục nhập tiêu đề Bearer vào máy chủ đó cho thời gian chạy của bạn.

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

Kho bây giờ bao gồm một bản kê khai plugin Codex gốc tại `.codex-plugin/plugin.json`. Trình cài đặt npm vẫn có sẵn và cài đặt các khả năng tương tự như **skills**, **profiles** và bộ định tuyến `AGENTS.md` cho Codex CLI, Cursor và Kimi:

| Claude Code | Codex tương đương |
| --- | --- |
| đại lý phụ `@agent-vorcl-flow:frontend` | nhân cách kỹ năng `$frontend` + `codex --profile frontend` |
| lệnh `/analyzer:audit` | kỹ năng làm nhiệm vụ `$analyzer-audit` |
| lệnh `/vorcl` | kỹ năng làm nhiệm vụ `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` trong `config.toml` |
| `SessionStart` móc | định tuyến vai trò trong `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Xem [`codex/README.md`](../codex/README.md) để có bản đồ đầy đủ.

---

## Cursor

Cursor sử dụng cùng định dạng `SKILL.md` mở như bộ chuyển đổi Codex, cộng với các tác nhân phụ tùy chỉnh riêng và cấu hình MCP toàn cầu:

| Agent-Vorcl-Flow khái niệm | Cursor tương đương |
| --- | --- |
| vai trò `backend` | đại lý phụ tùy chỉnh `/avf-backend` trong `~/.cursor/agents` |
| lệnh nhiệm vụ `/backend:create-api` | kỹ năng `/backend-create-api` |
| phổ quát `/vorcl` | kỹ năng `/vorcl` |
| `.mcp.json` | máy chủ được hợp nhất trong `~/.cursor/mcp.json` |

Trình cài đặt chuyển đổi các định nghĩa vai trò thành Cursor frontmatter, đặt tiền tố cho các tác nhân phụ bằng `avf-` để tránh xung đột tên kỹ năng, sử dụng `model: inherit` và đánh dấu các tác nhân chỉ kiểm tra là `readonly: true`. MCP mục nhập máy chủ hiện có có cùng tên sẽ được giữ nguyên. Xem [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) tải nguyên bản các Kỹ năng của tác nhân, tệp tác nhân tùy chỉnh và móc vòng đời; AVF cũng hợp nhất các máy chủ MCP tương tự được sử dụng bởi Claude và Cursor:

| Agent-Vorcl-Flow khái niệm | Kimi CLI tương đương |
| --- | --- |
| kỹ năng/lệnh nhiệm vụ | `~/.kimi/skills` và `/skill:<name>` |
| Expo đại lý tùy chỉnh | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo Bảo vệ PostToolUse | sáp nhập vào `~/.kimi/config.toml` |
| `.mcp.json` | máy chủ được hợp nhất trong `~/.kimi/mcp.json` |
| tệp khóa mỗi lần chạy | được chia sẻ `~/.config/agent-vorcl-flow/.env` (thông qua trình khởi chạy) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI không có `${VAR}` mở rộng trong `mcp.json`, do đó, các khóa được lấy từ `.env` được chia sẻ thông qua trình khởi chạy — giống hệt như các thời gian chạy khác. Xem [`kimi/README.md`](../kimi/README.md).

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

**Làm thế nào nó khớp với nhau:** `agents/*.md` khai báo một vai trò và, trong vấn đề chính `skills:`, đính kèm các kỹ năng → kỹ năng trong `skills/*/SKILL.md` được tải tự động theo mô tả → `commands/<agent>/*.md` cung cấp `/agent:command` phím tắt nhanh chóng ủy quyền cho đại lý phụ → `.mcp.json` cung cấp cho các đại lý các công cụ của họ, mỗi công cụ bắt đầu thông qua `bin/mcp-env.mjs` tải các bí mật từ `.env` được chia sẻ. Một cái móc `SessionStart` cho Claude biết các tác nhân đang sẵn sàng.

---

## License

MIT — miễn phí sử dụng, sao chép, sửa đổi và phân phối; được cung cấp "nguyên trạng", không có bảo hành và không có trách nhiệm pháp lý. Xem [LICENSE](../LICENSE).

© 2026 Christian Avis (Vorcl).
