<div align="center">

# Agent-Vorcl-Flow

**فريق من الوكلاء الفرعيين المتخصصين في الذكاء الاصطناعي لـ [Claude Code](https://claude.com/claude-code) و [GPT Codex](https://developers.openai.com/codex/cli/) و [Cursor](https://cursor.com/) و [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — ذوي المهارات والأوامر والأدوات MCP.**
أمر واحد يقوم بتثبيتها. لا توجد واجهة خلفية عن بعد أو استضافة سحابية: يقوم وكيل البرمجة الخاص بك بتشغيل كل شيء محليًا.

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
[한국어](./README.ko.md) · [**العربية**](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 72c33da6cabafc1329d572eb271a485d678403c7f9b5e6a96911fd227cabbc6c. -->
<p dir="rtl">هذه ترجمة عربية محفوظة داخل المستودع.</p>

</div>

---

## What is this?

Agent-Vorcl-Flow يحول وكيل الترميز المدعوم إلى **فريق هندسي منظم**. بدلاً من مساعد عام واحد، تحصل على **25 وكيلًا فرعيًا مركّزًا** (مهندس معماري، مهندس رئيسي قائم على التعليمات البرمجية، واجهة خلفية، واجهة أمامية، مهندس متنقل، مهندس منتج وتصميم مرئي، مهندس، مدقق سلامة عبر اللغات، رسام خرائط معماري، مشغل لوحة حية، والمزيد)، كل منهم له مجاله الخاص **المهارات**، **أوامر الشرطة المائلة** السريعة، و**MCPالأدوات** التي يحتاجها. يتم تشغيل كل مهمة غير تافهة من خلال حلقة **Task Master** منضبطة — *الهدف ← المهام ← التنفيذ ← التحقق ← إنجاز* - بحيث يتم تخطيط العمل وتتبعه والتغلب على الانقطاعات.

- 🧩 **25 وكيلًا فرعيًا**، 71 مهارة، 155 أمر شرطة مائلة
- ⚡ **التثبيت بأمر واحد** لـ Claude Code، Codex، Cursor، و/أو Kimi CLI — `npx`
- 🔌 **11 MCP خادمًا** متصلين (GitHub، Postgres، MongoDB، Redis، Docker، Firecrawl، Vercel، Render، نظام الملفات، Task Master، Mermaid)
- 🔑 **ملف `.env` واحد لجميع أوقات التشغيل** — تتم قراءة المفاتيح بواسطة المشغل، وليس `~/.zshrc`، لذا فهي تعمل حتى من عمليات تشغيل GUI/IDE؛ لا توجد خدمة AVF عن بعد؛ Liveboard هو مضيف محلي فقط وسريع الزوال
- 🤝 ** يعمل على Claude Code و GPT Codex و Cursor و Kimi CLI** من نفس المصدر

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**، **[GPT Codex](https://developers.openai.com/codex/cli/)**، **[Cursor](https://cursor.com/)**، و/أو **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

استهدف وقت تشغيل واحدًا بعلامة:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

ما يفعله المثبت:

| وقت التشغيل | العمل |
| --- | --- |
| **الطبقة المشتركة** | ينسخ المشغل إلى `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` وينشئ `~/.config/agent-vorcl-flow/.env` من القالب (مرة واحدة) - ملف المفتاح الفردي لكل وقت تشغيل. |
| **Claude Code** | يسجل هذا الريبو كمكون إضافي **سوق** ويمكّن المكون الإضافي (عبر `claude plugin …`، مع تراجع `~/.claude/settings.json` مباشر). |
| **GPT Codex** | يدمج المهارات في `~/.agents/skills` وكتل `config.toml` + `AGENTS.md` في `~/.codex` (عاجزة، بين العلامات). |
| **Cursor** | تثبيت المهارات في `~/.cursor/skills`، والوكلاء الفرعيين المخصصين الأصليين في `~/.cursor/agents`، ودمج الخوادم المفقودة في `~/.cursor/mcp.json`. |
| **Kimi CLI** | تثبيت المهارات في `~/.kimi/skills`، والعامل المخصص Expo الأصلي في `~/.kimi/agents`، وكلا من Expo البنية/UI الخطافات في `~/.kimi/config.toml`، ودمج خوادم MCP. |

> لا يقوم المثبت بملء أسرارك أبدًا - فهو يقوم فقط بإنشاء `.env` فارغًا من القالب. يمكنك إضافة مفاتيح هناك (انظر [Configuration](#configuration-mcp--keys)).

### Update to the latest version

قم بتشغيل برنامج التثبيت مرة أخرى باستخدام العلامة npm `latest`:

```bash
npx --yes agent-vorcl-flow@latest
```

لتحديث وقت تشغيل واحد فقط، احتفظ بنفس علامة وقت التشغيل التي استخدمتها أثناء التثبيت:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

يغطي التحديث المهارات المُدارة والوكلاء والخطافات والمشغل وكتل التكوين. فهو يحافظ على موجودك وأسراره دون تغيير، ويحافظ على مهاراتك الأولية. أعد تشغيل عميل الترميز المحدث بعد ذلك (أو قم بتشغيل `/reload-plugins` في Claude Code).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

بعد التثبيت، **أعد تشغيل Claude Code** (أو قم بتشغيل `/reload-plugins` في جلسة مفتوحة) لتحميل الوكلاء.

---

## How to use

تستخدم الأمثلة الموجودة في هذا القسم بناء الجملة Claude Code؛ راجع تعيينات [Cursor](#cursor) و[GPT Codex](#gpt-codex) أدناه لمعرفة بناء الجملة الأصلي الخاص بها. في Claude Code هناك **ثلاث طرق** لاستدعاء الفريق.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` يحدد الوكيل الفرعي الذي يجب أن يمتلك العمل ويقود الدورة Task Master الكاملة. `/audit` يكتشف تلقائيًا الواجهة الخلفية والواجهة الأمامية والجوال والبيانات والبنية التحتية ويكتب مستندًا قائمًا على الأدلة `PROJECT_AUDIT.md` باستخدام جميع الأدوار ذات الصلة. `/init-code` يقرأ المستودع بشكل ثابت وينشئ مستندًا قائمًا على الأدلة `PROJECT_DESCRIPTION.md` دون تنفيذ كود المشروع. بمجرد وجود هذا الملف، يجب على كل دور تعديل أن يحافظ على مزامنة الأقسام المتأثرة به؛ وصف مثبت لإنجاز كتل الانجراف المهمة.

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

لدى كل وكيل أيضًا نقطة دخول خاصة به تقوم بتشغيل الحلقة Task Master المخصصة لذلك الوكيل.

### The Task Master loop
كل مهمة غير تافهة تتدفق عبر **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```يؤدي هذا إلى إبقاء العمل مخططًا ومحددًا وقابلاً للاستئناف - لا يتم الإعلان عن "إنجاز" أي شيء دون اجتياز خطوة التحقق الخاصة به.

---

## The agents| الوكيل | الدور | أبرز الأحداث |
| --- | --- | --- |
| 🔵 **مهندس معماري** | مهندس النظم والحلول | تحليل المتطلبات، تصميم النظام/DB/API، مراجعات الهندسة المعمارية |
| 🏛️ **مهندس معماري رئيسي** | البرمجيات الرئيسية / البنية التحتية / مهندس الذكاء الاصطناعي | يقوم بمسح الكود الحقيقي بـ 11 لغة وينشئ MD و JSON و HTML و PDF و draw.io و Mermaid مدعومًا بالأدلة؛ تحديثات إعادة الفحص الكامل تحافظ على التعليقات التوضيحية |
| 🟢 **الواجهة الخلفية** | مطور الواجهة الخلفية | العقدة/TS، Postgres، Redis؛ العمارة المعيارية كل طريق مغطى بالكامل بـ OpenAPI |
| 🟣 **الواجهة الأمامية** | الواجهة الأمامية (React 19 / Next.js جهاز توجيه التطبيقات) | المكونات، الحالة، جلب البيانات، تحسين العرض/الحزمة، الاختبارات |
| 📱 **اكسبو موبايل** | React Native + Expo مهندس | بنية معيارية بالإضافة إلى نظام التصميم/الحركة/التفاعل، والملاحة الأصلية، والرموز، والإيماءات، واللمس، والحركة المنخفضة |
| 🟠 **المحلل** | مدقق الكود (للقراءة فقط) | الأخطاء، نوع الأمان، DB الهيكل، نماذج الواجهة الأمامية، روائح الواجهة الخلفية |
| 🧭 **النزاهة** | مدقق تكامل التعليمات البرمجية عبر اللغات (للقراءة فقط) | إنتاج الكود الثابت والتسريب الوهمي/المزيف/العرضي/التركيبات عبر الواجهة الأمامية/الخلفية/الجوال/المشتركة |
| 🟡 **التباهي** | OpenAPI/Swagger التغطية (أي مكدس) | يجد الطرق غير الموثقة بالكامل ويغطيها مع التحقق |
| 🔴 **الزحف الناري** | باحث ويب | البث المباشر CLI/MCP/REST، وتكامل التطبيق وسير عمل بيانات الويب النهائية |
| 🟤 **رندر** | الاستضافة والنشر (رندر) | عمليات النشر، والتشخيصات المستندة إلى السجل، والمقاييس، وenv vars، والعرض Postgres |
| 🟦 **قاعدة البيانات** | DB مهندس/ ديسيبل | المخطط، الاستعلامات والخطط، الفهارس، N+1، عمليات الترحيل الآمنة القابلة للعكس، ذاكرة التخزين المؤقت |
| ⚪ **المرونة** | الموثوقية: الأخطاء + التسجيل | حاول/التقط الحدود الصحيحة، والأخطاء المكتوبة، وعمليات إعادة المحاولة/المهلات، والسجلات المنظمة |
| 🖼️ **لقطة شاشة** | لقطة الشاشة UI → الكود | يحول لقطة الشاشة UI إلى رمز جاهز للإنتاج وسريع الاستجابة ويمكن الوصول إليه |
| 🎨 **استديو التصميم** | استوديو المنتجات والتصميم المرئي | المصنوعات اليدوية المحلية، والنماذج الأولية، والإطارات السلكية، والطوابق/PPTX، والمستندات، والرسوم المتحركة، وثلاثية الأبعاد، وأنظمة التصميم واستيراد Figma/GitHub/HTML؛ مقتبس من معهد ماساتشوستس للتكنولوجيا 😉 |
| 🔎 **البحث البصري** | لقطة الشاشة → إجابة تم التحقق منها | يحدد الموقع/الصفحة، ويبحث عن المستندات الرسمية، ويتحقق من البيانات المباشرة والإجابات باستخدام عناوين URL والثقة |
| 🎯 **تحديد** | لقطة الشاشة → وضعها في مشروع موجود (للقراءة فقط) | إنشاء لقطة شاشة للتطبيق قيد التشغيل في قاعدة التعليمات البرمجية الحقيقية - المكون، `file:line`، والمسار/الصفحة، والتحكم الدقيق، والمنطق الكامن وراءها؛ لا ينشئ شيئًا، ويفوض التحرير |
| 📊 **رسمو** | الرسوم البيانية (draw.io/diagrams.net) | مخطط انسيابي، BPMN، UML، ERD، الشبكة/السحابة، وPMP/PMBOK (WBS، Gantt، RACI...) |
| 🗺️ **الخريطة الرئيسية** | رسام الخرائط المعماري | الكود الحتمي → `architecture.json` (كل عقدة مع `source:{file,line}`) → خريطة HTML تفاعلية، draw.io، Mermaid، ARCHITECTURE.md، PDF؛ يتم وضع علامة على الحقائق غير المثبتة `inferred` |
| 🧜 **حورية البحر** | Mermaid الرسوم البيانية (+ تقديم حقيقي) | مخطط انسيابي، تسلسل، فئة، حالة، ER، جانت، gitGraph، خريطة ذهنية...؛ تم التحقق من صحتها عبر mcp-mermaid/`mmdc`؛ يسلمك الملف (`.mmd` + SVG/PNG/PDF) |
| 🧪 **الاختبار** | مهندس اختبار وتحقق | الوحدة (Vitest/Jest)، التكامل (Supertest)، E2E (Playwright)، التغطية، صيد الاختبار غير المستقر؛ ينفذ كل مهمة `testStrategy` - لا يتم "فعل" أي شيء بدون التشغيل الأخضر |
| 🌿 **جيت فلو** | Git سير العمل والإصدارات | الالتزامات التقليدية، الالتزامات بالاسم (أبدًا `git add .`)، العلاقات العامة، الاحتفاظ بسجل التغيير، الإصدارات المنتظمة؛ ادفع فقط بتأكيد صريح |
| 🛡️ **الأمن** | مدقق الأمن (للقراءة فقط) | الأسرار في تاريخ الشجرة والبوابة، OWASP Top 10، التبعية CVEs، PII؛ النتائج تصبح مهام — يتم تفويض الإصلاحات || 📝 **مستندات** | مهندس توثيق | README (تكافؤ متعدد اللغات)، API مستندات من OpenAPI، الهندسة المعمارية، المساهمة، ملاحظات الإصدار؛ تم التحقق من كل مثال مقابل الكود |
| 🐳 **ديفوبس** | الحاويات و CI/CD | ملفات Dockerfiles متعددة المراحل، إنشاء عامل إرساء للتطوير المحلي، GitHub خطوط أنابيب الإجراءات، نظافة البيئة/أسرار النظافة، المراقبة |
| 📡 **لوحة الحياة** | مجلس العمليات المحلية | أشجار العمل المباشرة وعمليات الوكيل والمهام Task Master على لوحة معلومات المضيف المحلي سريعة الزوال |

** بعض الأشياء التي تستحق المعرفة: **
- **الواجهة الأمامية تتحدث دائمًا إلى API حقيقي.** مواصفات الواجهة الخلفية OpenAPI هي المصدر الوحيد للحقيقة؛ ويتولد منه أنواع (`openapi-typescript` + `openapi-fetch`). لا يوجد سخرية في مسار الإنتاج.
- **`database` تتطلب الطفرات تأكيدًا صريحًا.** التحليلات للقراءة فقط؛ لا يتم تشغيل تغييرات المخطط/البيانات (DDL/DML/الترحيلات) بدون الحصول على الضوء الأخضر.
- **`resilience` يشحن خطاف أمان.** يقوم الخطاف `PostToolUse` غير المحظور (`catch-guard.js`) بوضع علامة بلطف على الكتل `catch {}` الفارغة في الملفات التي قمت بتحريرها للتو.
- **`archmap` لا يستمد أبدًا من الخيال.** يتم الفصل بين الاستخراج والعرض بشكل صارم: تعمل البرامج النصية ذات التبعية الصفرية على نقل الريبو إلى `architecture.json` (قواعد البيانات ذات أصل FK الحقيقي، والمسارات، ووكلاء الذكاء الاصطناعي مع نماذجهم/أدواتهم/ذاكرتهم، ورسمهم البياني للاستيراد، والبيئة)، ويتم عرض كل رسم تخطيطي من ذلك JSON فقط. أي شيء يضيفه LLM بدون `file:line` يمكن التحقق منه يتم وضع علامة عليه بقوة `inferred:true` ومرسوم متقطع.
- **`principal-architect` هو سير عمل نشر البنية الكاملة.** يعمل في أي مستودع يقوم بتشغيل الوكيل، ويتجاهل مطالبات Markdown كدليل طوبولوجي، ويستخدم Tree-sitter WASM المجمع دون اتصال لـ TS/JS، وPython، وGo، وJava، وC#، وRust، وPHP، وRuby، وKotlin، وSwift، ويكتب `ARCHITECTURE.md` أولاً، ثم ينتج نموذج JSON مشترك، ومكتفي بذاته، HTML، PDF، وdraw.io أصلي وقابل للنسخ Mermaid من L0 إلى L4. `update` يقوم بإجراء إعادة فحص كاملة ويحافظ على التعليقات التوضيحية والملفات غير المُدارة.
- **`pinpoint` يجد، لا ينشئ أبدًا.** بالنظر إلى لقطة شاشة لتطبيق قيد التشغيل، فإنه يعين الشاشة إلى الكود الحقيقي - المكون والمسار والتحكم الدقيق والمنطق الكامن وراءه - ويسلم التحرير إلى `frontend`/`backend`. إنه يعمل على ما هو موجود بالفعل (عكس `screenshot`).
- **`visual-research` يتم التحقق بدلاً من التخمين.** فهو يتعامل مع لقطة الشاشة كدليل، ويؤكد النطاق الرسمي والمستندات، ويتحقق من بيانات الموقع الحالية، ويضع علامة على القيم المحتملة للتصيد الاحتيالي أو القديمة.
- **`i18n` يفرض "ترميزًا ثابتًا للغة صفر."** يكتشف الوكلاء أولاً ما إذا كان المشروع متعدد اللغات ويتكيف - تمر السلاسل التي تواجه المستخدم عبر طبقة ترجمة (next-intl / React-i18next / i18next)، ولا تكون مضمّنة أبدًا.

---

## Command referenceكل أمر أدناه هو أمر شرطة مائلة. `<…>` يحدد المدخلات الخاصة بك.

### `/vorcl` — universal router
| الأمر | ماذا يفعل |
| --- | --- |
| `/vorcl <goal>` | يحول أي هدف إلى مهام ويوجهه إلى الوكيل الفرعي المناسب، ثم يقوم بتشغيل الدورة الكاملة لإنجازه. |
| `/audit [path] [focus]` | تدقيق عميق متعدد الأدوار للقراءة فقط ← الأنظمة المكتشفة، ونتائج الأمان/مكافحة التطرف العنيف/المرونة، والبنية المستهدفة والمراحل `PROJECT_AUDIT.md`. |
| `/init-code [path] [--update]` | اكتشاف قاعدة التعليمات البرمجية الثابتة → المبني على الأدلة `PROJECT_DESCRIPTION.md`؛ لا يتم تنفيذ رمز المشروع أبدًا. |

### 🔵 architect — architecture
| الأمر | ماذا يفعل |
| --- | --- |
| `/architect:vorcl <goal>` | الهدف ← المهام ← دورة، مخصصة للهندسة المعمارية. |
| `/architect:analyze <context>` | تحليل المتطلبات وسياق المهمة. |
| `/architect:design <problem>` | تصميم بنية الحل (النظام، DB، API). |
| `/architect:review <target>` | مراجعة بنية موجودة. |

### 🏛️ principal-architect — code-grounded architecture package
| الأمر | ماذا يفعل |
| --- | --- |
| `/principal-architect:vorcl <goal>` | يدير هدفًا معماريًا كبيرًا من خلال القطع الأثرية Task Master والتحقق منها. |
| `/principal-architect:create [options]` | يقوم بمسح المستودع الحالي وإنشاء MD، JSON، HTML، PDF، draw.io و Mermaid من دليل التعليمات البرمجية. |
| `/principal-architect:update [options]` | إعادة فحص حزمة موجودة بالكامل، وكتابة دليل متباين، وتحديث العناصر التي تم إنشاؤها ذريًا. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| الأمر | ماذا يفعل |
| --- | --- |
| `/backend:vorcl <goal>` | الهدف → المهام → دورة العمل الخلفي. |
| `/backend:create-api <endpoint>` | قم بإنشاء نقطة نهاية API على البنية المعيارية، مغطاة بالكامل بـ OpenAPI. |
| `/backend:refactor <target>` | كود إعادة البناء دون تغيير السلوك. |
| `/backend:optimize <target>` | تحسين الأداء. |
| `/backend:test <target>` | إنشاء اختبارات للكود. |

### 🟣 frontend — React / Next.js
| الأمر | ماذا يفعل |
| --- | --- |
| `/frontend:vorcl <goal>` | الهدف → المهام → دورة عمل الواجهة الأمامية. |
| `/frontend:create-component <spec>` | قم بإنشاء مكون UI يتبع بنية الميزة. |
| `/frontend:refactor <target>` | Refactor UI / الخطافات دون تغيير السلوك. |
| `/frontend:optimize <target>` | تحسين العرض / الحزمة / مؤشرات أداء الويب الأساسية. |
| `/frontend:test <target>` | إنشاء اختبارات المكونات. |

### 📱 expo-mobile — React Native / Expo

| الأمر | ماذا يفعل |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | الهدف → Task Master دورة Expo للعمل المتنقل. |
| `/expo-mobile:create-module <domain>` | قم بإنشاء شريحة أعمال معيارية تحتوي فقط على الطبقات التي تحتاجها من حيث التعقيد. |
| `/expo-mobile:create-screen <flow>` | قم بإنشاء مسار Expo Router رفيع بالإضافة إلى شاشة وحالات مملوكة للوحدة النمطية. |
| `/expo-mobile:design-screen <flow>` | أنشئ شاشة مميزة تتضمن رموزًا وحالات وإمكانية وصول مشتركة للتصميم/الحركة. |
| `/expo-mobile:motion <interaction>` | صمم نظام الملاحة الأصلي، والينابيع، والإيماءات، واللمسات، والحركات الاحتياطية ذات الحركة المنخفضة. |
| `/expo-mobile:add-api <contract>` | أضف مفاتيح المخطط/DTO/مخطط/الاستعلام والتكامل. |
| `/expo-mobile:audit [scope]` | حارس الهندسة المعمارية للقراءة فقط والتدقيق المبني على الأدلة. |
| `/expo-mobile:ui-audit [scope]` | نظام التصميم للقراءة فقط، والحركة، والتفاعل، وإمكانية الوصول، وتدقيق الأداء. |
| `/expo-mobile:compatibility [app] [change]` | تدقيق مباشر للقراءة فقط Expo/RN/Node/package/وقت التشغيل الأصلي مقابل المصادر الرسمية ذات الإصدار. |
| `/expo-mobile:test <scope>` | قم بتشغيل وحدة المجال ومكتبة الاختبار والفحوصات. |

### 🟠 analyzer — code audit (read-only)
| الأمر | ماذا يفعل |
| --- | --- |
| `/analyzer:vorcl <goal>` | قم بمراجعة الهدف عبر Task Master — تصبح النتائج مهامًا. |
| `/analyzer:audit` | التدقيق الكامل: الأخطاء، الأنواع، DB، نماذج الواجهة الأمامية، روائح الواجهة الخلفية. |
| `/analyzer:bugs` | اصطياد الأخطاء - الأخطاء التي لم تتم معالجتها، وظروف السباق، وحالات الحافة. |
| `/analyzer:types` | التحقق من النوع — `tsc`، `any`، قوالب غير آمنة، انحراف أنواع zod↔. |
| `/analyzer:db` | هيكل التدقيق - المخطط، والفهارس، وFKs، وN+1، والترحيلات. |
| `/analyzer:mocks` | مسار التوافق للبيانات الوهمية/المزيفة على الواجهة الأمامية والخلفية؛ تفويض فحوصات متعددة اللغات العميقة للنزاهة. |
| `/analyzer:backend` | ابحث عن التعليمات البرمجية الخلفية "السيئة" - انتهاكات البنية والمنطق في وحدات التحكم. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)| الأمر | ماذا يفعل |
| --- | --- |
| `/integrity:vorcl <goal>` | يقوم بتشغيل هدف نزاهة غير تافه من خلال Task Master ويحول النتائج إلى مهام خاصة بالمالك. |
| `/integrity:audit [path]` | يقوم بمسح الكود الثابت والتسرب الوهمي معًا، ثم إثبات إمكانية الوصول إلى الإنتاج. |
| `/integrity:hardcode [path]` | يبحث عن القيم الحرفية للمستخدم/التكوين/الأعمال التي تتجاوز الترجمة أو التكوين أو نظام التسجيل. |
| `/integrity:mocks [path]` | يعثر على أطر عمل وهمية ومولدات وهمية وتركيبات وبيانات تجريبية واستجابات ثابتة يمكن الوصول إليها من الإنتاج. |

يدعم الماسح الضوئي ذو التبعية الصفرية TS/JS وPython وGo وJava/Kotlin وC# وPHP وRuby وRust وVue/Svelte/HTML وRazor. في كود الواجهة الخلفية، يقوم أيضًا بوضع علامات على قيم الأعمال المخفية في الثوابت، والحقول الثابتة/النهائية، والمعلمات الافتراضية، والوسائط المسماة، والكتالوجات الثابتة؛ ثم يقارنها المدقق بالمخططات/النماذج/المستودعات/الاستعلامات/طفرات المسؤول لإثبات أن قاعدة البيانات - وليس التعليمات البرمجية أو التكوين - تمتلك القيمة. يتم منع الاختبارات والتركيبات والقصص والأمثلة والبذور والتعليمات البرمجية التي تم إنشاؤها وجذور البائعين بشكل افتراضي؛ المرشحات المعجمية ليست عيوبًا حتى يتم إثبات إمكانية الوصول والملكية.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| الأمر | ماذا يفعل |
| --- | --- |
| `/swagger:vorcl <goal>` | هدف التغطية الكاملة عبر Task Master - التدقيق ← المهام ← التغطية ← التحقق. |
| `/swagger:audit` | للقراءة فقط: ابحث عن الطرق التي لم تغطيها المواصفات بالكامل. |
| `/swagger:cover <route>` | قم بتغطية المسار/الوحدة النمطية - المعلمات والاستجابات والأوصاف والأمان + التحقق. |

### 🔴 firecrawl — web research
| الأمر | ماذا يفعل |
| --- | --- |
| `/firecrawl:vorcl <goal>` | هدف البحث عبر Task Master — جمع بيانات الويب للحصول على نتيجة نهائية. |
| `/firecrawl:search <query>` | البحث في الويب عن مصادر حول سؤال ما. |
| `/firecrawl:scrape <url>` | قم بكشط عنوان URL واحد في تخفيض السعر/JSON. |
| `/firecrawl:map <url>` | قم بتعيين عناوين URL الخاصة بالموقع. |
| `/firecrawl:crawl <url>` | الزحف بشكل متكرر إلى قسم/موقع. |
| `/firecrawl:extract <url>` | الاستخراج المنظم بواسطة مخطط JSON. |
| `/firecrawl:setup` | التثبيت/التحقق CLI بالإضافة إلى مهارات البناء وسير العمل الرسمية (مع التأكيد). |
| `/firecrawl:interact <url>` | انقر على النماذج أو تصفحها أو املأها عندما لا يكون المسح كافيًا. |
| `/firecrawl:parse <file>` | قم بتحليل مستند محلي/خاص إلى تخفيض السعر أو JSON. |
| `/firecrawl:monitor <action>` | قم بإدراج عمليات التحقق أو إدارة أجهزة مراقبة تغيير الصفحة المتكررة. |
| `/firecrawl:agent <goal>` | قم بتشغيل مهمة وكيل Firecrawl محدودة المدى وطويلة الأمد. |
| `/firecrawl:research <query>` | أوراق البحث وGitHub سياق البحث. |
| `/firecrawl:ask <jobId>` | تشخيص مهمة Firecrawl فاشلة. |
| `/firecrawl:docs-search <question>` | ابحث في الوثائق الرسمية الحالية. |
| `/firecrawl:integrate <feature>` | أضف Firecrawl إلى رمز التطبيق عبر مهارات البناء الأولية. |
| `/firecrawl:deliverable <artifact>` | أنتج ملخصًا أو تدقيقًا أو قائمة رئيسية أو أي عنصر آخر لسير العمل. |`/firecrawl:setup` يقوم بتشغيل التدفق الرسمي `firecrawl-cli init --all` فقط بعد التأكيد. المهارات الرسمية الموجودة لها الأسبقية ويتم الحفاظ عليها بواسطة برنامج التثبيت Codex/Cursor؛ يوفر AVF إجراءات احتياطية متوافقة للمهارات المفقودة. مسار العمليات المباشرة من خلال CLI → MCP → REST/بدون مفتاح.

### 🟤 render — hosting / deploy (Render)
| الأمر | ماذا يفعل |
| --- | --- |
| `/render:vorcl <goal>` | هدف الأشعة تحت الحمراء عبر Task Master — النشر/التشخيص/التكوين ليتم تنفيذه. |
| `/render:deploy <service>` | نشر/إعادة نشر الخدمة. |
| `/render:logs <service>` | سجلات الخدمة والتشخيصات وصولاً إلى السبب الجذري. |
| `/render:status <service>` | حالة الخدمة + النشر + المقاييس. |
| `/render:query <sql>` | SQL للقراءة فقط مقابل التقديم Postgres. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| الأمر | ماذا يفعل |
| --- | --- |
| `/database:vorcl <goal>` | هدف البيانات عبر Task Master — المخطط/الاستعلامات/الترحيل/ذاكرة التخزين المؤقت التي سيتم تنفيذها. |
| `/database:query <query>` | الاستعلام/التحليلات للقراءة فقط. |
| `/database:schema <target>` | تصميم / مراجعة المخطط وسلامة البيانات. |
| `/database:migrate <change>` | التخطيط لعملية ترحيل آمنة وقابلة للعكس للمخطط/البيانات. |
| `/database:optimize <target>` | التحسين — الفهارس، N+1، خطط الاستعلام، ترقيم الصفحات. |
| `/database:cache <target>` | Redis — TTL، الإبطال، الأقفال، تحديد المعدل، التدفقات. |

### ⚪ resilience — error handling + logging
| الأمر | ماذا يفعل |
| --- | --- |
| `/resilience:vorcl <goal>` | هدف الموثوقية عبر Task Master — رمز الغلاف مع سجلات حاول/قبض +. |
| `/resilience:harden <target>` | قم بلف التعليمات البرمجية في محاولة/التقاط/أخيرًا باستخدام التسجيل المستمر، دون حدوث أي فشل صامت. |
| `/resilience:logging <target>` | إضافة/إصلاح التسجيل المنظم - المستويات والسياق وعدم وجود أسرار/معلومات تحديد الهوية الشخصية. |
| `/resilience:audit` | للقراءة فقط: ابحث عن حالات الفشل الصامتة، وعناصر الصيد الفارغة، وفجوات التسجيل. |

### 🖼️ screenshot — screenshot UI → code
| الأمر | ماذا يفعل |
| --- | --- |
| `/screenshot:vorcl <goal>` | مجموعة من الشاشات من لقطات الشاشة عبر رمز Task Master — تفصيل →. |
| `/screenshot:analyze <image>` | تفاصيل القراءة فقط - التخطيط، المكونات، الرموز المميزة، الحالات → الخطة. |
| `/screenshot:convert <image> [framework]` | قم بإنشاء كود كامل قابل للتشغيل من لقطة الشاشة (الافتراضي React + Tailwind v4). |
| `/screenshot:tokens <image>` | قم باستخراج رموز التصميم المميزة (ألوان OKLCH، والطباعة، والتباعد) إلى Tailwind `@theme`. |
| `/screenshot:responsive <target>` | اجعل UI الاستجابة التي تم إنشاؤها — نقاط التوقف، السوائل، `clamp()`، استعلامات الحاوية. |

### 🎨 design-studio — product and visual design
| الأمر | ماذا يفعل |
| --- | --- |
| `/design-studio:vorcl <goal>` | هدف التصميم الكامل من خلال Task Master - السياق ← المتغيرات ← HTML ← المعاينة ← التحقق ← التصدير. |
| `/design-studio:create <brief>` | قم بإنشاء قطعة أثرية مرئية مصقولة ومكتفية ذاتيًا أو hi-fi UI. |
| `/design-studio:prototype <flow>` | قم ببناء نموذج أولي تفاعلي للويب/الجوال مع الحالات والانتقالات. |
| `/design-studio:wireframe <flow>` | أنشئ إطارًا سلكيًا منخفض الدقة يركز على هندسة المعلومات وتجربة المستخدم. |
| `/design-studio:design-system <operation>` | إنشاء نظام تصميم أو استيراده أو تجميعه أو ربطه أو تحديثه أو التحقق منه. |
| `/design-studio:import <type> <source>` | قم باستيراد Figma `.fig` أو GitHub أو HTML/CSS مع المصدر. |
| `/design-studio:deck <brief>` | أنشئ مجموعة تحتوي على ملاحظات المتحدث والرسوم المتحركة وPPTX الاختيارية القابلة للتحرير. |
| `/design-studio:document <brief>` | أنشئ مستندًا أو سيرة ذاتية أو مذكرة أو صفحة واحدة أو تقريرًا جاهزًا للطباعة. |
| `/design-studio:animation <brief>` | أنشئ قطعة أثرية متحركة وقم بتحويلها اختياريًا إلى MP4. |
| `/design-studio:research <question>` | قم بإنشاء قطعة أثرية بحثية مرئية مدعومة بالمصدر. |
| `/design-studio:export <project> <format>` | قم بالتصدير إلى تنسيق مستقل HTML أو PDF أو PPTX أو MP4 أو تنسيق تسليم. |
| `/design-studio:review <target>` | مراجعة مرئية للقراءة فقط، وتجربة المستخدم، وسريعة الاستجابة، وa11y، ونظام التصميم. |

### 🔎 visual-research — screenshot → verified web answer
| الأمر | ماذا يفعل |
| --- | --- |
| `/visual-research:vorcl <goal>` | بحث متعدد الخطوات عن لقطة الشاشة من خلال Task Master. |
| `/visual-research:identify <image>` | تحديد الموقع والصفحة والميزة بأدلة الثقة. |
| `/visual-research:search <image> <target>` | ابحث عن الصفحة الحقيقية أو الوثائق الرسمية من القرائن المرئية. |
| `/visual-research:answer <image> <question>` | أجب باستخدام أدلة لقطة الشاشة والمستندات الرسمية والبيانات المباشرة الحالية. |
| `/visual-research:hints <image> <goal>` | قدم خطوات آمنة ومدعومة بالوثائق للواجهة المرئية. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| الأمر | ماذا يفعل |
| --- | --- |
| `/pinpoint:vorcl <goal>` | ابحث عن/فهم/تغيير الموجود UI من لقطة الشاشة عبر Task Master — خريطة ← المهام ← التفويض. |
| `/pinpoint:locate <image>` | حدد موقع المكون/الملف (الملفات) الموجود من لقطة الشاشة — `file:line`، لا يوجد رمز جديد. |
| `/pinpoint:route <image>` | حدد المسار/الصفحة التي تعمل عليها الشاشة (Next.js جهاز توجيه التطبيقات/الصفحات، React جهاز التوجيه). |
| `/pinpoint:control <image>` | حدد عنصر التحكم الدقيق (الزر/الحقل) ومعالجه في الكود. |
| `/pinpoint:trace <target>` | تتبع المنطق وراء عنصر ما - المعالج ← الحالة ← جلب البيانات ← API. || `/pinpoint:handoff <change>` | أنشئ طلب تحرير دقيق مقابل التعليمات البرمجية الموجودة وقم بتفويض `frontend`/`backend`. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| الأمر | ماذا يفعل |
| --- | --- |
| `/drawio:vorcl <goal>` | مجموعة من الرسوم البيانية عبر Task Master — إنشاء لإنجازه. |
| `/drawio:create <description> [type]` | أنشئ رسمًا تخطيطيًا من وصف نصي (XML أصلي صالح). |
| `/drawio:pmp <type> <project>` | أنشئ مخطط PMP/PMBOK — WBS، وPERT/CPM، وGantt، وRACI، ومصفوفة المخاطر، وشبكة أصحاب المصلحة. |
| `/drawio:convert <source> [type]` | تحويل مصدر إلى رسم تخطيطي — DB المخطط ← ERD، المجلدات ← شجرة، الكود ← UML، حورية البحر/CSV/JSON. |
| `/drawio:refine <file>` | قم بتحسين `.drawio` موجود — التخطيط، السمة، إضافة/إزالة العقد، المحاذاة إلى الشبكة. |

### 🗺️ archmap — architecture map from code| الأمر | ماذا يفعل |
| --- | --- |
| `/archmap:vorcl <goal>` | هدف التعيين عبر Task Master — إنشاء مجموعة أثرية تم التحقق منها. |
| `/archmap:map [repo]` | خط الأنابيب الكامل: الاستخراج → `architecture.json` → شرح LLM → جميع التنسيقات (HTML، draw.io، Mermaid، ARCHITECTURE.md، PDF). |
| `/archmap:extract [repo]` | الاستخراج فقط — يمكن قراءته آليًا مع وجود `source:{file,line}` على كل عقدة. |
| `/archmap:annotate [json]` | إثراء LLM لـ `architecture.json` موجود (ذاكرة الوكيل، دلالات تدفق البيانات)؛ حقائق غير مثبتة تم تخفيض رتبتها تلقائيًا إلى `inferred`. |
| `/archmap:html [json]` | خريطة HTML تفاعلية مستقلة - تبديل الطبقة، وحزم التتبع، والعقدة → `file:line` اللوحة، والبحث، وطباعة CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (متعدد الصفحات: نظرة عامة / ERD / API / الوكلاء) و/أو مشاهدات Mermaid، تم التحقق من صحتها. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| الأمر | ماذا يفعل |
| --- | --- |
| `/mermaid:vorcl <goal>` | مجموعة من المخططات عبر Task Master — تم البناء عليها (تم التحقق من العرض). |
| `/mermaid:create <description> [type]` | أنشئ رسمًا تخطيطيًا من الوصف — بناء جملة صالح، تم التحقق منه بواسطة عرض حقيقي؛ يسلمك الملف. |
| `/mermaid:convert <source> [type]` | تحويل مصدر إلى Mermaid — DB مخطط ← ER، رمز ← فئة/تسلسل، مجلدات ← مخطط انسيابي، `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | بناء الجملة + اختبار العرض الحقيقي؛ البحث عن الأخطاء وإصلاحها (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | تصدير إلى SVG/PNG/PDF (حورية البحر-cli / كروكي / Mermaid.ink). |
| `/mermaid:refine <file>` | قم بتحسين `.mmd` موجود - الاتجاه، الرسم البياني الفرعي، classDef/styles، سهولة القراءة. |

### 🧪 testing — tests & verification
| الأمر | ماذا يفعل |
| --- | --- |
| `/testing:vorcl <goal>` | هدف الاختبار/التحقق عبر Task Master — وحدة + تكامل + e2e ليتم تنفيذه. |
| `/testing:unit <file\|module>` | اختبارات الوحدة (Vitest/Jest) - المسار السعيد، الحدود، الأخطاء؛ يديرها ويظهر الإخراج. |
| `/testing:integration <endpoint\|module>` | اختبارات التكامل (Supertest/inject، DB الحقيقي، أو حاويات الاختبار). |
| `/testing:e2e <scenario>` | Playwright E2E لمسار المستخدم المهم — محددات الأدوار، والتركيبات، وتتبع الفشل. |
| `/testing:verify <task\|testStrategy>` | ينفذ `testStrategy` المهمة ويعيد حكم جاهز / غير جاهز بمخرجات حقيقية. |
| `/testing:coverage [path]` | تقرير التغطية بالنتائج - ما هي التعليمات البرمجية المهمة التي لم يتم اختبارها؛ يخلق المهام. |
| `/testing:flaky <test>` | تشخيص اختبار غير مستقر (العرق، التوقيت، الحالة المشتركة، السخرية) وإصلاحه للأبد. |

### 🌿 gitflow — git workflow & releases
| الأمر | ماذا يفعل |
| --- | --- |
| `/gitflow:vorcl <goal>` | هدف git/الإصدار عبر Task Master (تحضير الإصدار، تنظيف السجل، فرع الميزات). |
| `/gitflow:commit <files\|scope>` | التزام بالاسم (أبدًا `git add .`) مع رسالة التزامات تقليدية؛ توقف على WIP غير معروف. |
| `/gitflow:pr <base> <title>` | الفرع → الالتزام → طلب السحب (gh / GitHub MCP) مع ماذا/لماذا/كيف تم التحقق منه. |
| `/gitflow:changelog [version]` | CHANGELOG.md (الاحتفاظ بسجل التغيير) تم إنشاؤه من عمليات الالتزام بين العلامات. |
| `/gitflow:release <version\|auto>` | قطع من الالتزامات → مزامنة إصدارات البيان → العلامة → GitHub الإصدار. ادفع فقط بعد التأكيد الصريح. |
| `/gitflow:audit [branch]` | تدقيق التاريخ للقراءة فقط: انتهاكات الاتفاقية، ومخالفات التفريغ، والنقط الكبيرة، والفروع اليتيمة. |

### 🛡️ security — security audit (read-only)
| الأمر | ماذا يفعل |
| --- | --- |
| `/security:vorcl <goal>` | هدف أمني عبر Task Master — التدقيق ← النتائج ← المهام ← الإصلاحات المفوضة. |
| `/security:secrets [path\|branch]` | الأسرار في شجرة العمل وتاريخ البوابة (جميع الفروع)؛ `${VAR:-}` العناصر النائبة ليست أسرار. |
| `/security:owasp [path]` | OWASP أعلى 10 في الكود: الحقن، XSS، المصادقة، عرض البيانات، CORS/ملفات تعريف الارتباط - مع الملف: دليل السطر. |
| `/security:deps` | التبعية CVEs عبر npm التدقيق / lockfiles - الخطورة، وكسر علامات التغيير. |
| `/security:pii [path]` | مخاطر تحديد الهوية الشخصية/اللائحة العامة لحماية البيانات: رسائل البريد الإلكتروني والهواتف والبطاقات المشفرة والسجلات؛ المسارات الخاصة للمطور. |
| `/security:pre-push [branch]` | فحص سريع ومدمج للملفات التي تم تغييرها قبل الدفع: الأسرار + الحقن + معلومات تحديد الهوية الشخصية؛ الحكم الأخضر / الأحمر. |

### 📝 docs — documentation
| الأمر | ماذا يفعل |
| --- | --- |
| `/docs:vorcl <goal>` | هدف التوثيق عبر Task Master. |
| `/docs:readme [path]` | إنشاء/تحديث الملف التمهيدي — What/quickstart/usage/config/troubleshooting؛ تم التحقق من الأمثلة؛ تمت مزامنة إصدارات اللغة. |
| `/docs:api [spec]` | API المستندات التي تم إنشاؤها من المواصفات OpenAPI (نقاط النهاية، المعلمات، أمثلة التجعيد)؛ يقترح `/swagger:audit` إذا لم يكن هناك المواصفات. |
| `/docs:architecture` | ARCHITECTURE.md - الوحدات النمطية، والحدود، وتدفق البيانات؛ الرسوم البيانية المفوضة إلى `mermaid`/`drawio`. || `/docs:contributing` | CONTRIBUTING.md — الإعداد، والهيكل، والاختبارات، واتفاقيات الالتزام (المتوافقة مع `gitflow`)، وعملية العلاقات العامة. |
| `/docs:release-notes <version>` | ملاحظات الإصدار لإصدار من CHANGELOG/history. |
| `/docs:audit` | مستندات للقراءة فقط↔ التحقق من انحراف التعليمات البرمجية: الروابط المعطلة، والأمثلة/العدادات التي لا معنى لها، والترجمات غير المتزامنة. |

### 🐳 devops — containers & CI/CD
| الأمر | ماذا يفعل |
| --- | --- |
| `/devops:vorcl <goal>` | هدف البنية التحتية عبر Task Master. |
| `/devops:dockerfile [app-type]` | كتابة/مراجعة ملف Dockerfile - متعدد المراحل، وقاعدة رفيعة، وغير جذر، وفحص صحي؛ تم التحقق منها بواسطة `docker build` حقيقي. |
| `/devops:compose` | docker-compose.yml للتطوير المحلي (التطبيق + قواعد البيانات)؛ تغييرات البيئة تحتاج إلى `--force-recreate`، وينتظر صحية. |
| `/devops:ci [type]` | GitHub الإجراءات — سير عمل العلاقات العامة (الوبر + فحص النوع + الاختبار، npm ذاكرة التخزين المؤقت)، نشر سير العمل، الحد الأدنى من الأذونات. |
| `/devops:env` | المخزون المتغير بيئيًا: حيث تمت القراءة، وما هو مطلوب، والقالب `.env.example`؛ أسرار أبدا في الصور. |
| `/devops:monitoring` | السجلات المنظمة (pino/JSON)، ونقطة النهاية الصحية، وما يجب التنبيه عليه؛ تقديم المقاييس عبر الوكيل `render`. |

### 📡 liveboard — ephemeral local operations board
| الأمر | ماذا يفعل |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | ابدأ لوحة تحكم مصقولة بـ 43 لغة على منفذ مضيف محلي مجاني؛ Task Master يغير التدفق عبر SSE ويتم التوفيق بينه كل 5 دقائق. |
| `/liveboard:vorcl <goal>` | تطوير أو تغيير لوحة الحياة نفسها من خلال سير العمل Task Master المطلوب. |

Liveboard يقرأ Git أشجار العمل والعمليات Claude/Codex/Cursor المحلية وكل شجرة عمل `.taskmaster/tasks/tasks.json`. تظل حالة وقت التشغيل في الذاكرة وتختفي عندما تتوقف عملية المقدمة. يكتشف UI لغة المتصفح ويقدم 43 لغة محلية، بما في ذلك الإنجليزية، الروسية، الأوكرانية، الألمانية، الفرنسية، الإسبانية، البرتغالية، الإيطالية، البولندية، التركية، الصينية، اليابانية، العربية، الهولندية، التشيكية، السلوفاكية، الرومانية، المجرية، البلغارية، الصربية، الكرواتية، السلوفينية، اليونانية، العبرية، الفارسية، الهندية، البنغالية، الأردية، الإندونيسية، الماليزية، الفيتنامية، التايلاندية، الكورية، السويدية، النرويجية، الدنماركية، الفنلندية، الإستونية، اللاتفية، الليتوانية، الجورجية، الأرمينية، والأذربيجانية. تستخدم العربية والعبرية والفارسية والأردية تخطيط RTL.

التكوين المباشر:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: المشروع الذي تم فحص أشجار العمل والملفات Task Master الخاصة به.
- `--port 0`: تحديد منفذ مجاني تلقائيًا.
- `--interval`: الفاصل الزمني للتسوية الكاملة بالمللي ثانية؛ مشاهدة الملفات لا تزال تتدفق Task Master تتغير على الفور.
- نقاط النهاية: `/health`، `/api/snapshot`، `/api/events` (SSE)، و `POST /api/refresh`.
- احتفظ بـ `--host 127.0.0.1` إلا إذا كنت تنوي بشكل صريح كشف معلومات المشروع للشبكة.

---

## Configuration (MCP & keys)

لا تحتوي الحزمة على ** لا توجد واجهة خلفية أو قاعدة بيانات بعيدة **. اللوحة الحية الاختيارية هي عملية في الذاكرة للمضيف المحلي فقط. MCP تحتاج الخوادم إلى الرموز المميزة، و**يوفر كل مستخدم الرموز المميزة الخاصة به**. لجعل هذا العمل يعمل بشكل متطابق عبر **Claude Code، Codex، Cursor وKimi CLI** - وسواء كنت تقوم بالتشغيل من محطة طرفية أو من Dock / Spotlight / IDE - يتم تشغيل كل خادم stdio MCP من خلال مشغل صغير (`bin/mcp-env.mjs`) يقرأ مفاتيحك من **ملف واحد**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

يقوم المثبت بإنشائه من [`.env.example`](../.env.example). افتحه واملأ المفاتيح التي تستخدمها فقط:

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

> **لماذا المشغل بدلاً من `~/.zshrc`؟** يختلف توسيع Env-var حسب وقت التشغيل (`${VAR:-}` في Claude، `${env:VAR}` في Cursor، الأحرف الحرفية في Codex/Kimi) وكل وقت تشغيل يقرأ فقط البيئة **التي تم إطلاقها فيها**. لا يتم تشغيل واجهة المستخدم الرسومية / IDE على نظام التشغيل macOS `~/.zshrc`، لذا تكون المفاتيح المصدرة غير مرئية ولا تتصل الخوادم بأي شيء - العبارة الكلاسيكية "MCP env not set" الفشل. القراءة من ملف `.env` واحد تزيل المشكلتين في وقت واحد.

**الأسبقية** (تفوز لاحقًا): المشاركة `~/.config/agent-vorcl-flow/.env` → a `./.env` في جذر المشروع → `export` الحقيقي في الصدفة الخاصة بك. احتفظ بالمفاتيح العامة في الملف المشترك، وتجاوز كل مشروع (على سبيل المثال، `MONGODB_URI` مختلف) مع مشروع `.env`، وسيظل تصدير Shell الأصلي يفوز بعمليات التشغيل CLI. يمكنك توجيه المشغل إلى ملف مختلف باستخدام `AGENT_VORCL_ENV_FILE=/path/.env`.الخادم الذي يكون مفتاحه المطلوب مفقودًا **لا يبدأ** — سترى سطرًا واحدًا `[agent-vorcl-flow] MCP «…» is not configured: …` في سجل وقت التشغيل، ويستمر كل خادم آخر في العمل. أضف المفتاح إلى `.env` وأعد التشغيل. (يمكنك الاحتفاظ بأسماء `GITHUB_TOKEN`/`MONGODB_URI` — يقوم المشغل بتعيينها على `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` التي تتوقعها الخوادم.)

> ⚠️ **مطلوب للأوامر Task Master التي تعمل بالذكاء الاصطناعي:** قم بتكوين موفر واحد محدد على الأقل — `ANTHROPIC_API_KEY` لـ Claude، أو `OPENAI_API_KEY` لـ GPT، أو Codex CLI OAuth. بدون بيانات اعتماد النموذج المحدد في `.taskmaster/config.json`، لا يمكن لـ `/vorcl` إنشاء المهام أو توسيعها.

اختر الموفر الذي يقوم بالفعل بتشغيل عملية التوليد؛ المفاتيح وحدها لا تحدد النموذج:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

يستخدم الأمر التدفق الرسمي `task-master models` ويخزن تحديد النموذج فقط في `.taskmaster/config.json`. `PERPLEXITY_API_KEY` اختياري ومطلوب فقط عند تحديد الحيرة كنموذج بحث.

تستخدم خوادم **vercel** و**render** البعيدة OAuth (التفويض باستخدام `/mcp` في المتصفح). بالنسبة إلى العرض بدون رأس/CI، قم بتعيين `RENDER_API_KEY` في بيئتك وأضف إدخال رأس Bearer إلى هذا الخادم لوقت التشغيل الخاص بك.

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

يتضمن المستودع الآن بيان البرنامج المساعد الأصلي Codex في `.codex-plugin/plugin.json`. يظل برنامج التثبيت npm متاحًا ويقوم بتثبيت نفس الإمكانات مثل **المهارات** و **ملفات التعريف** وجهاز التوجيه `AGENTS.md` لـ Codex CLI و Cursor و Kimi:

| Claude Code | Codex يعادل |
| --- | --- |
| الوكيل الفرعي `@agent-vorcl-flow:frontend` | مهارة الشخصية `$frontend` + `codex --profile frontend` |
| الأمر `/analyzer:audit` | مهارة المهمة `$analyzer-audit` |
| الأمر `/vorcl` | مهارة المهمة `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` في `config.toml` |
| `SessionStart` هوك | توجيه الدور في `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

انظر [`codex/README.md`](../codex/README.md) للحصول على التعيين الكامل.

---

## Cursor

Cursor يستخدم نفس التنسيق المفتوح `SKILL.md` مثل المحول Codex، بالإضافة إلى العوامل الفرعية المخصصة الأصلية والتكوين العام MCP:

| Agent-Vorcl-Flow المفهوم | Cursor يعادل |
| --- | --- |
| الدور `backend` | وكيل فرعي مخصص `/avf-backend` في `~/.cursor/agents` |
| أمر المهمة `/backend:create-api` | مهارة `/backend-create-api` |
| عالمي `/vorcl` | مهارة `/vorcl` |
| `.mcp.json` | الخوادم المدمجة في `~/.cursor/mcp.json` |

يقوم المثبت بتحويل تعريفات الدور إلى Cursor المادة الأمامية، ويضع البادئات الفرعية بـ `avf-` لتجنب تضارب أسماء المهارات، ويستخدم `model: inherit`، ويضع علامة على وكلاء التدقيق فقط كـ `readonly: true`. يتم الاحتفاظ بإدخالات الخادم MCP الموجودة بنفس الأسماء. انظر [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) يقوم أصلاً بتحميل مهارات الوكيل وملفات الوكيل المخصصة وخطافات دورة الحياة؛ يقوم AVF أيضًا بدمج نفس الخوادم MCP المستخدمة بواسطة Claude و Cursor:

| Agent-Vorcl-Flow المفهوم | Kimi CLI يعادل |
| --- | --- |
| المهارات / أوامر المهمة | `~/.kimi/skills` و `/skill:<name>` |
| Expo وكيل مخصص | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo حارس PostToolUse | تم دمجها في `~/.kimi/config.toml` |
| `.mcp.json` | الخوادم المدمجة في `~/.kimi/mcp.json` |
| ملف مفتاح لكل وقت تشغيل | المشتركة `~/.config/agent-vorcl-flow/.env` (عبر المشغل) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI لا يحتوي على توسيع `${VAR}` في `mcp.json`، لذا تأتي المفاتيح من `.env` المشتركة من خلال المشغل - تمامًا مثل أوقات التشغيل الأخرى. انظر [`kimi/README.md`](../kimi/README.md).

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

**كيف تتناسب معًا:** `agents/*.md` أعلن دورًا، وفي المقدمة `skills:`، قم بإرفاق المهارات ← يتم تحميل المهارات الموجودة في `skills/*/SKILL.md` تلقائيًا عن طريق الوصف → `commands/<agent>/*.md` توفير اختصارات `/agent:command` سريعة يتم تفويضها إلى الوكيل الفرعي → `.mcp.json` يمنح الوكلاء أدواتهم، يبدأ كل منها من خلال `bin/mcp-env.mjs` الذي يقوم بتحميل الأسرار من `.env` المشتركة. يخبرك الخطاف Claude بتوفر الوكلاء.

---

## License

معهد ماساتشوستس للتكنولوجيا – مجاني للاستخدام والنسخ والتعديل والتوزيع؛ المقدمة "كما هي"، دون أي ضمان أو مسؤولية. انظر [LICENSE](../LICENSE).

© 2026 كريستيان أفيس (Vorcl).
