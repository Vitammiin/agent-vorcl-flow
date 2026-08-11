<div align="center">

# Agent-Vorcl-Flow

**فريق من الوكلاء الفرعيين المتخصصين في الذكاء الاصطناعي لـ [Claude Code](https://claude.com/claude-code) و[GPT Codex](https://developers.openai.com/codex/cli/) و[Cursor](https://cursor.com/) و[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — ذوي المهارات والأوامر والأدوات.**
أمر واحد يقوم بتثبيتها. لا توجد واجهة خلفية عن بعد أو استضافة سحابية: يقوم وكيل البرمجة الخاص بك بتشغيل كل شيء محليًا.

![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-6C5CE7)
![GPT Codex](https://img.shields.io/badge/GPT%20Codex-adapter-1abc9c)
![Cursor](https://img.shields.io/badge/Cursor-native%20adapter-111111)
![Kimi CLI](https://img.shields.io/badge/Kimi%20CLI-adapter-000000)
![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)
![Agents](https://img.shields.io/badge/agents-22-blue)
![Commands](https://img.shields.io/badge/commands-135-blue)
![License](https://img.shields.io/badge/license-MIT-green)

<details>
<summary>🌐 <strong>Languages (22)</strong> — all translations are stored in Git</summary>

[English](./README.md) · [Русский](./README.ru.md) · [Українська](./README.uk.md) · [Deutsch](./README.de.md) · [Français](./README.fr.md) · [Español](./README.es.md)<br>
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [**العربية**](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 01861dcfef6354f49ecb1c6e62f9c5316943aeb8305556e432e273d7117f85e6. -->
<p dir="rtl">هذه ترجمة عربية محفوظة داخل المستودع.</p>

</div>

---

## ما هذا؟

Agent-Vorcl-Flow يحول وكيل الترميز المدعوم إلى **فريق هندسي منظم**. بدلاً من مساعد عام واحد، تحصل على **22 وكيلًا فرعيًا مركّزًا** (مهندس معماري، وواجهة خلفية، وواجهة أمامية، ومهندس متنقل، ومهندس، ورسام خرائط معماري، ومشغل لوحة حية، والمزيد)، لكل منهم **مهارات** مجاله الخاص، وأوامر الشرطة المائلة السريعة، و**الأدوات** التي يحتاجها. يتم تشغيل كل مهمة غير تافهة من خلال حلقة **Task Master** منضبطة — *الهدف ← المهام ← التنفيذ ← التحقق ← إنجاز* - بحيث يتم تخطيط العمل وتتبعه والتغلب على الانقطاعات.

- 🧩 **22 وكيلًا فرعيًا**، 44 مهارة، 135 أمر شرطة مائلة
- ⚡ **التثبيت بأمر واحد** لـ Claude Code و Codex و Cursor و/أو Kimi CLI — `npx`
- 🔌 **11 MCP خادمًا** متصلين (GitHub، Postgres، MongoDB، Redis، Docker، Firecrawl، Vercel، Render، نظام الملفات، Task Master، Mermaid)
- 🔑 **ملف `.env` واحد لجميع أوقات التشغيل** — مفاتيح تتم قراءتها بواسطة المشغل، وليس `~/.zshrc`، لذا فهي تعمل حتى من عمليات تشغيل GUI/IDE؛ لا توجد خدمة AVF عن بعد؛ Liveboard هو مضيف محلي فقط وسريع الزوال
- 🤝 ** يعمل على Claude Code و GPT Codex و Cursor و Kimi CLI** من نفس المصدر

---

## بداية سريعة

### المتطلبات
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**، **[GPT Codex](https://developers.openai.com/codex/cli/)**، **[Cursor](https://cursor.com/)**، و/أو **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### تثبيت (أمر واحد)

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
| **Claude Code** | يسجل هذا الريبو كمكون إضافي **سوق** ويمكّن المكون الإضافي (عبر `claude plugin …`، مع احتياطي `~/.claude/settings.json` مباشر). |
| **GPT Codex** | يدمج المهارات في `~/.agents/skills` والكتل `config.toml` + `AGENTS.md` في ​​`~/.codex` (عاجز، بين العلامات). |
| **Cursor** | تثبيت المهارات في `~/.cursor/skills`، والوكلاء الفرعيين الأصليين المخصصين في `~/.cursor/agents`، ودمج الخوادم المفقودة في `~/.cursor/mcp.json`. |
| **Kimi CLI** | تثبيت المهارات في `~/.kimi/skills`، والوكيل المخصص الأصلي في `~/.kimi/agents`، وكل من البنية/الربط في `~/.kimi/config.toml`، ودمج MCP الخوادم. |

> لا يقوم المثبت بملء أسرارك مطلقًا، بل يقوم فقط بإنشاء علامة `.env` فارغة من القالب. يمكنك إضافة مفاتيح هناك (انظر [Configuration](#التكوين-mcp-والمفاتيح)).

### التحديث إلى الإصدار الأحدث

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

### التثبيتات البديلة (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

بعد التثبيت، **أعد التشغيل Claude Code** (أو قم بتشغيل `/reload-plugins` في جلسة مفتوحة) لتحميل الوكلاء.

---

## كيفية الاستخدام

تستخدم الأمثلة الموجودة في هذا القسم بناء الجملة Claude Code؛ راجع التعيينات [Cursor](#cursor) و [GPT Codex](#gpt-codex) أدناه للتعرف على بناء الجملة الأصلي الخاص بهم. في Claude Code هناك **ثلاث طرق** لاستدعاء الفريق.

### 1. نقطة الدخول العالمية - فقط حدد الهدف
```text
/vorcl add a shopping cart to checkout
/audit .
```
`/vorcl` يحدد الوكيل الفرعي الذي يجب أن يمتلك العمل ويقود الدورة الكاملة. `/audit` يكتشف تلقائيًا الواجهة الخلفية والواجهة الأمامية والجوال والبيانات والبنية التحتية ويكتب مستندًا على الأدلة باستخدام جميع الأدوار ذات الصلة.

### 2. تحدث إلى وكيل فرعي محدد
```text
@agent-vorcl-flow:architect  design billing for a SaaS
@agent-vorcl-flow:backend    add a POST /invoices endpoint
```

### 3. قم بتشغيل أمر شرطة مائلة محددة
```text
/backend:create-api   POST /invoices
/analyzer:audit       src/
/screenshot:convert   ./mockups/dashboard.png  react
```

لدى كل وكيل أيضًا نقطة دخول خاصة به تقوم بتشغيل الحلقة Task Master التي يتم تحديد نطاقها لهذا الوكيل.

### الحلقة Task Master
كل مهمة غير تافهة تتدفق من خلال **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```

يؤدي هذا إلى إبقاء العمل مخططًا ومحددًا وقابلاً للاستئناف - لا يتم الإعلان عن "إنجاز" أي شيء دون اجتياز خطوة التحقق الخاصة به.

---

## الوكلاء| الوكيل | الدور | أبرز الأحداث |
| --- | --- | --- |
| 🔵 **مهندس معماري** | مهندس النظم والحلول | تحليل المتطلبات، تصميم النظام/DB/API، مراجعات الهندسة المعمارية |
| 🟢 **الواجهة الخلفية** | مطور الواجهة الخلفية | العقدة/TS، Postgres، Redis؛ العمارة المعيارية كل طريق مغطى بالكامل بـ OpenAPI |
| 🟣 **الواجهة الأمامية** | الواجهة الأمامية (React 19 / Next.js جهاز توجيه التطبيقات) | المكونات، الحالة، جلب البيانات، تحسين العرض/الحزمة، الاختبارات |
| 📱 **اكسبو موبايل** | React Native + Expo مهندس | بنية معيارية بالإضافة إلى نظام التصميم/الحركة/التفاعل، والملاحة الأصلية، والرموز، والإيماءات، واللمس، والحركة المنخفضة |
| 🟠 **المحلل** | مدقق الكود (للقراءة فقط) | الأخطاء، نوع الأمان، DB الهيكل، نماذج الواجهة الأمامية، روائح الواجهة الخلفية |
| 🟡 **التباهي** | OpenAPI/Swagger التغطية (أي مكدس) | يجد الطرق غير الموثقة بالكامل ويغطيها مع التحقق |
| 🔴 **الزحف الناري** | باحث ويب | البث المباشر CLI/MCP/REST، وتكامل التطبيق وسير عمل بيانات الويب النهائية |
| 🟤 **رندر** | الاستضافة والنشر (رندر) | عمليات النشر، والتشخيصات المستندة إلى السجل، والمقاييس، وenv vars، والعرض Postgres |
| 🟦 **قاعدة البيانات** | DB مهندس / ديسيبل | المخطط، الاستعلامات والخطط، الفهارس، N+1، عمليات الترحيل الآمنة القابلة للعكس، ذاكرة التخزين المؤقت |
| ⚪ **المرونة** | الموثوقية: الأخطاء + التسجيل | حاول/التقط الحدود الصحيحة، والأخطاء المكتوبة، وعمليات إعادة المحاولة/المهلات، والسجلات المنظمة |
| 🖼️ **لقطة شاشة** | لقطة الشاشة UI → الكود | يحول لقطة الشاشة UI إلى رمز جاهز للإنتاج وسريع الاستجابة ويمكن الوصول إليه |
| 🔎 **البحث البصري** | لقطة الشاشة → إجابة تم التحقق منها | يحدد الموقع/الصفحة، ويبحث عن المستندات الرسمية، ويتحقق من البيانات المباشرة والإجابات باستخدام عناوين URL والثقة |
| 🎯 **تحديد** | لقطة الشاشة → وضعها في مشروع موجود (للقراءة فقط) | إنشاء لقطة شاشة للتطبيق قيد التشغيل في قاعدة التعليمات البرمجية الحقيقية - المكون، `file:line`، والمسار/الصفحة، والتحكم الدقيق، والمنطق الكامن وراءها؛ لا ينشئ شيئًا، ويفوض التحرير |
| 📊 **رسمو** | الرسوم البيانية (draw.io/diagrams.net) | مخطط انسيابي، BPMN، UML، ERD، الشبكة/السحابة، وPMP/PMBOK (WBS، Gantt، RACI...) |
| 🗺️ **الخريطة الرئيسية** | رسام الخرائط المعماري | الكود الحتمي → `architecture.json` (كل عقدة مع `source:{file,line}`) → خريطة HTML تفاعلية، draw.io، Mermaid، ARCHITECTURE.md، PDF؛ يتم وضع علامة على الحقائق غير المثبتة `inferred` |
| 🧜 **حورية البحر** | Mermaid الرسوم البيانية (+ تقديم حقيقي) | مخطط انسيابي، تسلسل، فئة، حالة، ER، جانت، gitGraph، خريطة ذهنية...؛ تم التحقق من صحتها عبر mcp-mermaid/`mmdc`؛ يسلمك الملف (`.mmd` + SVG/PNG/PDF) |
| 🧪 **الاختبار** | مهندس اختبار وتحقق | الوحدة (Vitest/Jest)، التكامل (Supertest)، E2E (Playwright)، التغطية، صيد الاختبار غير المستقر؛ ينفذ كل مهمة `testStrategy` - لا يتم "فعل" أي شيء بدون التشغيل الأخضر |
| 🌿 **جيت فلو** | Git سير العمل والإصدارات | الالتزامات التقليدية، الالتزامات بالاسم (أبدًا `git add .`)، العلاقات العامة، الاحتفاظ بسجل التغيير، الإصدارات المنتظمة؛ ادفع فقط بتأكيد صريح |
| 🛡️ **الأمن** | مدقق الأمن (للقراءة فقط) | الأسرار في تاريخ الشجرة والبوابة، OWASP Top 10، التبعية CVEs، PII؛ النتائج تصبح مهام — يتم تفويض الإصلاحات |
| 📝 **مستندات** | مهندس توثيق | README (تكافؤ متعدد اللغات)، API مستندات من OpenAPI، الهندسة المعمارية، المساهمة، ملاحظات الإصدار؛ تم التحقق من كل مثال مقابل الكود |
| 🐳 **ديفوبس** | الحاويات و CI/CD | ملفات Dockerfiles متعددة المراحل، إنشاء عامل إرساء للتطوير المحلي، GitHub خطوط أنابيب الإجراءات، نظافة البيئة/أسرار النظافة، المراقبة |
| 📡 **لوحة الحياة** | مجلس العمليات المحلية | أشجار العمل المباشرة وعمليات الوكيل والمهام Task Master على لوحة معلومات المضيف المحلي سريعة الزوال |** بعض الأشياء التي تستحق المعرفة: **
- **الواجهة الأمامية تتحدث دائمًا إلى API حقيقي.** مواصفات الواجهة الخلفية OpenAPI هي المصدر الوحيد للحقيقة؛ ويتولد منه أنواع (`openapi-typescript` + `openapi-fetch`). لا يوجد سخرية في مسار الإنتاج.
- **`database` تتطلب الطفرات تأكيدًا صريحًا.** التحليلات للقراءة فقط؛ لا يتم تشغيل تغييرات المخطط/البيانات (DDL/DML/الترحيلات) بدون الحصول على الضوء الأخضر.
- **`resilience` يشحن خطاف أمان.** يقوم الخطاف غير المحظور (`catch-guard.js`) بوضع إشارة بلطف على الكتل الفارغة في الملفات التي قمت بتحريرها للتو.
- **`archmap` لا يستمد أبدًا من الخيال.** يتم الفصل بين الاستخراج والعرض بشكل صارم: تعمل البرامج النصية ذات التبعية الصفرية على تحويل الريبو إلى `architecture.json` (قواعد البيانات ذات أصل FK الحقيقي، والمسارات API، ووكلاء الذكاء الاصطناعي مع نماذجهم/أدواتهم/ذاكرتهم، ورسمهم البياني للاستيراد، والبيئة)، ويتم عرض كل رسم تخطيطي من ذلك JSON فقط. أي شيء يضيفه LLM دون وجود علامة يمكن التحقق منها `file:line` يتم وضع علامة القوة `inferred:true` ومرسومة متقطعة.
- **`pinpoint` يجد، لا ينشئ أبدًا.** بالنظر إلى لقطة شاشة لتطبيق قيد التشغيل، فإنه يعين الشاشة إلى الكود الحقيقي - المكون والمسار والتحكم الدقيق والمنطق الكامن وراءه - ويسلم التحرير إلى `frontend`/`backend`. إنه يعمل على ما هو موجود بالفعل (عكس `screenshot`).
- **`visual-research` يتم التحقق بدلاً من التخمين.** فهو يتعامل مع لقطة الشاشة كدليل، ويؤكد النطاق الرسمي والمستندات، ويتحقق من بيانات الموقع الحالية، ويضع علامة على القيم المحتملة للتصيد الاحتيالي أو القديمة.
- **`i18n` يفرض "صفر لغة."** يكتشف الوكلاء أولاً ما إذا كان المشروع متعدد اللغات ويتكيفون معه - تمر السلاسل التي تواجه المستخدم عبر طبقة ترجمة (next-intl / React-i18next / i18next)، ولا تكون مضمّنة أبدًا.

---

## مرجع الأمر

كل أمر أدناه هو أمر شرطة مائلة. `<…>` يحدد المدخلات الخاصة بك.

### `/vorcl` — جهاز التوجيه العالمي
| الأمر | ماذا يفعل |
| --- | --- |
| `/vorcl <goal>` | يحول أي هدف إلى مهام ويوجهه إلى الوكيل الفرعي المناسب، ثم يقوم بتشغيل الدورة الكاملة لإنجازه. |
| `/audit [path] [focus]` | تدقيق عميق متعدد الأدوار للقراءة فقط ← الأنظمة المكتشفة، ونتائج الأمان/مكافحة التطرف العنيف/المرونة، والبنية المستهدفة والمراحل `PROJECT_AUDIT.md`. |

### 🔵 مهندس معماري — الهندسة المعمارية
| الأمر | ماذا يفعل |
| --- | --- |
| `/architect:vorcl <goal>` | الهدف ← المهام ← دورة، مخصصة للهندسة المعمارية. |
| `/architect:analyze <context>` | تحليل المتطلبات وسياق المهمة. |
| `/architect:design <problem>` | تصميم بنية الحل (النظام، DB، API). |
| `/architect:review <target>` | مراجعة بنية موجودة. |

### 🟢 الواجهة الخلفية - الخادم (العقدة/TS، Postgres، Redis)
| الأمر | ماذا يفعل |
| --- | --- |
| `/backend:vorcl <goal>` | الهدف → المهام → دورة العمل الخلفي. |
| `/backend:create-api <endpoint>` | قم بإنشاء نقطة نهاية API على البنية المعيارية، مغطاة بالكامل بـ OpenAPI. |
| `/backend:refactor <target>` | كود إعادة البناء دون تغيير السلوك. |
| `/backend:optimize <target>` | تحسين الأداء. |
| `/backend:test <target>` | إنشاء اختبارات للكود. |

### 🟣 الواجهة الأمامية — React / Next.js
| الأمر | ماذا يفعل |
| --- | --- |
| `/frontend:vorcl <goal>` | الهدف → المهام → دورة عمل الواجهة الأمامية. |
| `/frontend:create-component <spec>` | قم بإنشاء مكون UI يتبع بنية الميزة. |
| `/frontend:refactor <target>` | Refactor UI / الخطافات دون تغيير السلوك. |
| `/frontend:optimize <target>` | تحسين العرض / الحزمة / مؤشرات أداء الويب الأساسية. |
| `/frontend:test <target>` | إنشاء اختبارات المكونات. |

### 📱 معرض الجوال — React Native / Expo| الأمر | ماذا يفعل |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | الهدف → Task Master دورة Expo العمل المتنقل. |
| `/expo-mobile:create-module <domain>` | قم بإنشاء شريحة أعمال معيارية تحتوي فقط على الطبقات التي تحتاجها من حيث التعقيد. |
| `/expo-mobile:create-screen <flow>` | قم بإنشاء مسار Expo Router رفيع بالإضافة إلى شاشة وحالات مملوكة للوحدة النمطية. |
| `/expo-mobile:design-screen <flow>` | أنشئ شاشة مميزة تتضمن رموزًا وحالات وإمكانية وصول مشتركة للتصميم/الحركة. |
| `/expo-mobile:motion <interaction>` | صمم نظام الملاحة الأصلي، والينابيع، والإيماءات، واللمسات، والحركات الاحتياطية ذات الحركة المنخفضة. |
| | أضف مفاتيح المخطط/DTO/مخطط/الاستعلام والتكامل TanStack Query. |
| `/expo-mobile:audit [scope]` | حارس الهندسة المعمارية للقراءة فقط والتدقيق المبني على الأدلة. |
| `/expo-mobile:ui-audit [scope]` | نظام التصميم للقراءة فقط، والحركة، والتفاعل، وإمكانية الوصول، وتدقيق الأداء. |
| `/expo-mobile:compatibility [app] [change]` | مراجعة توافق وقت التشغيل المباشر للقراءة فقط Expo/RN/Node/package/Native-runtime مقابل المصادر الرسمية ذات الإصدار. |
| `/expo-mobile:test <scope>` | تشغيل وحدة المجال، React Native مكتبة الاختبار و Maestro الشيكات. |

### 🟠 محلل - تدقيق الكود (للقراءة فقط)
| الأمر | ماذا يفعل |
| --- | --- |
| `/analyzer:vorcl <goal>` | قم بمراجعة الهدف عبر Task Master — تصبح النتائج مهامًا. |
| `/analyzer:audit` | التدقيق الكامل: الأخطاء، الأنواع، DB، نماذج الواجهة الأمامية، روائح الواجهة الخلفية. |
| `/analyzer:bugs` | اصطياد الأخطاء - الأخطاء التي لم تتم معالجتها، وظروف السباق، وحالات الحافة. |
| `/analyzer:types` | التحقق من النوع — `tsc`، `any`، قوالب غير آمنة، انحراف أنواع zod↔. |
| `/analyzer:db` | هيكل التدقيق DB — المخطط، والفهارس، وFKs، وN+1، والترحيلات. |
| `/analyzer:mocks` | ابحث عن البيانات النموذجية/المزيفة في الواجهة الأمامية. |
| `/analyzer:backend` | ابحث عن التعليمات البرمجية الخلفية "السيئة" - انتهاكات البنية والمنطق في وحدات التحكم. |

### 🟡 التباهي — تغطية OpenAPI/Swagger (أي مكدس)
| الأمر | ماذا يفعل |
| --- | --- |
| `/swagger:vorcl <goal>` | هدف التغطية الكاملة عبر Task Master - التدقيق ← المهام ← التغطية ← التحقق. |
| `/swagger:audit` | للقراءة فقط: ابحث عن الطرق التي لم تغطيها المواصفات بالكامل. |
| `/swagger:cover <route>` | قم بتغطية المسار/الوحدة النمطية - المعلمات والاستجابات والأوصاف والأمان + التحقق. |

### 🔴 الزحف الناري — بحث الويب
| الأمر | ماذا يفعل |
| --- | --- |
| `/firecrawl:vorcl <goal>` | هدف البحث عبر Task Master — جمع بيانات الويب للحصول على نتيجة نهائية. |
| `/firecrawl:search <query>` | البحث في الويب عن مصادر حول سؤال ما. |
| `/firecrawl:scrape <url>` | كشط عنوان URL واحدًا في تخفيض السعر/JSON. |
| `/firecrawl:map <url>` | قم بتعيين عناوين URL الخاصة بالموقع. |
| `/firecrawl:crawl <url>` | الزحف بشكل متكرر إلى قسم/موقع. |
| `/firecrawl:extract <url>` | الاستخراج المنظم بواسطة مخطط JSON. |
| `/firecrawl:setup` | التثبيت/التحقق CLI بالإضافة إلى مهارات البناء وسير العمل الرسمية (مع التأكيد). |
| `/firecrawl:interact <url>` | انقر على النماذج أو تصفحها أو املأها عندما لا يكون المسح كافيًا. |
| `/firecrawl:parse <file>` | قم بتحليل مستند محلي/خاص إلى تخفيض السعر أو JSON. |
| `/firecrawl:monitor <action>` | قم بإدراج عمليات التحقق أو إدارة أجهزة مراقبة تغيير الصفحة المتكررة. |
| `/firecrawl:agent <goal>` | قم بتشغيل مهمة وكيل Firecrawl محدودة المدى وطويلة الأمد. |
| `/firecrawl:research <query>` | أوراق البحث وسياق البحث GitHub. |
| `/firecrawl:ask <jobId>` | تشخيص مهمة Firecrawl فاشلة. |
| `/firecrawl:docs-search <question>` | ابحث في الوثائق الرسمية Firecrawl الحالية. |
| `/firecrawl:integrate <feature>` | أضف Firecrawl إلى كود التطبيق عبر مهارات البناء الأولية. |
| `/firecrawl:deliverable <artifact>` | قم بإنتاج ملخص أو تدقيق أو قائمة رئيسية أو أي عناصر أخرى لسير العمل. |`/firecrawl:setup` يتم تشغيل التدفق الرسمي فقط بعد التأكيد. المهارات الرسمية الحالية لها الأولوية ويتم الحفاظ عليها بواسطة برنامج التثبيت Codex/Cursor؛ يوفر AVF إجراءات احتياطية متوافقة للمهارات المفقودة. مسار العمليات المباشرة من خلال CLI → MCP → REST/بدون مفتاح.

### 🟤 تقديم - استضافة / نشر (تقديم)
| الأمر | ماذا يفعل |
| --- | --- |
| `/render:vorcl <goal>` | هدف الأشعة تحت الحمراء عبر Task Master — النشر/التشخيص/التكوين للقيام به. |
| `/render:deploy <service>` | نشر/إعادة نشر الخدمة. |
| `/render:logs <service>` | سجلات الخدمة والتشخيصات وصولاً إلى السبب الجذري. |
| `/render:status <service>` | حالة الخدمة + النشر + المقاييس. |
| `/render:query <sql>` | SQL للقراءة فقط مقابل التقديم Postgres. |

### 🟦 قاعدة البيانات — DB مهندس / ديسيبل (Postgres / MongoDB / Redis)
| الأمر | ماذا يفعل |
| --- | --- |
| `/database:vorcl <goal>` | هدف البيانات عبر Task Master — المخطط/الاستعلامات/الترحيل/ذاكرة التخزين المؤقت لإنجازه. |
| `/database:query <query>` | الاستعلام/التحليلات للقراءة فقط. |
| `/database:schema <target>` | تصميم / مراجعة المخطط وسلامة البيانات. |
| `/database:migrate <change>` | التخطيط لعملية ترحيل آمنة وقابلة للعكس للمخطط/البيانات. |
| `/database:optimize <target>` | التحسين — الفهارس، N+1، خطط الاستعلام، ترقيم الصفحات. |
| `/database:cache <target>` | Redis — TTL، الإبطال، الأقفال، تحديد المعدل، التدفقات. |

### ⚪ المرونة — معالجة الأخطاء + التسجيل
| الأمر | ماذا يفعل |
| --- | --- |
| `/resilience:vorcl <goal>` | هدف الموثوقية عبر Task Master — رمز الغلاف مع سجلات محاولة/التقاط +. |
| `/resilience:harden <target>` | قم بلف التعليمات البرمجية في محاولة/التقاط/أخيرًا باستخدام التسجيل المستمر، دون حدوث أي فشل صامت. |
| `/resilience:logging <target>` | إضافة/إصلاح التسجيل المنظم - المستويات والسياق وعدم وجود أسرار/معلومات تحديد الهوية الشخصية. |
| `/resilience:audit` | للقراءة فقط: ابحث عن حالات الفشل الصامتة، وعناصر الصيد الفارغة، وفجوات التسجيل. |

### 🖼️ لقطة شاشة — لقطة شاشة UI → الكود
| الأمر | ماذا يفعل |
| --- | --- |
| `/screenshot:vorcl <goal>` | مجموعة من الشاشات من لقطات الشاشة عبر Task Master — تفصيل → الكود. |
| `/screenshot:analyze <image>` | تفاصيل القراءة فقط - التخطيط، المكونات، الرموز المميزة، الحالات → الخطة. |
| `/screenshot:convert <image> [framework]` | قم بإنشاء كود كامل قابل للتشغيل من لقطة شاشة (افتراضي React + Tailwind v4). |
| `/screenshot:tokens <image>` | قم باستخراج رموز التصميم المميزة (ألوان OKLCH، والطباعة، والتباعد) إلى Tailwind `@theme`. |
| `/screenshot:responsive <target>` | اجعل UI مستجيبًا — نقاط التوقف، السوائل، `clamp()`، استعلامات الحاوية. |

### 🔎 البحث المرئي — لقطة شاشة ← إجابة ويب تم التحقق منها
| الأمر | ماذا يفعل |
| --- | --- |
| `/visual-research:vorcl <goal>` | بحث لقطة شاشة متعدد الخطوات من خلال Task Master. |
| `/visual-research:identify <image>` | تحديد الموقع والصفحة والميزة بأدلة الثقة. |
| `/visual-research:search <image> <target>` | ابحث عن الصفحة الحقيقية أو الوثائق الرسمية من القرائن المرئية. |
| `/visual-research:answer <image> <question>` | أجب باستخدام أدلة لقطة الشاشة والمستندات الرسمية والبيانات المباشرة الحالية. |
| `/visual-research:hints <image> <goal>` | قدم خطوات آمنة ومدعومة بالوثائق للواجهة المرئية. |

### 🎯 تحديد دقيق — لقطة شاشة ← ضع في مشروع موجود (للقراءة فقط)
| الأمر | ماذا يفعل |
| --- | --- |
| `/pinpoint:vorcl <goal>` | ابحث عن/فهم/تغيير UI الموجود من لقطة الشاشة عبر Task Master — خريطة ← المهام ← المفوض. |
| `/pinpoint:locate <image>` | حدد موقع المكون/الملف (الملفات) الموجود من لقطة الشاشة — `file:line`، لا يوجد رمز جديد. |
| `/pinpoint:route <image>` | حدد المسار/الصفحة التي تعمل عليها الشاشة (Next.js جهاز توجيه التطبيقات/الصفحات، React جهاز التوجيه). |
| `/pinpoint:control <image>` | حدد عنصر التحكم الدقيق (الزر/الحقل) ومعالجه في الكود. |
| `/pinpoint:trace <target>` | تتبع المنطق وراء عنصر ما - المعالج ← الحالة ← جلب البيانات ← API. |
| `/pinpoint:handoff <change>` | أنشئ طلب تحرير دقيق مقابل التعليمات البرمجية الموجودة وقم بتفويض `frontend`/`backend`. |

### 📊 drawio - الرسوم البيانية (draw.io / Diagrams.net)
| الأمر | ماذا يفعل |
| --- | --- |
| `/drawio:vorcl <goal>` | مجموعة من المخططات عبر Task Master — إنشاء لإنجازه. |
| `/drawio:create <description> [type]` | أنشئ رسمًا تخطيطيًا من وصف نصي (XML أصلي صالح). |
| `/drawio:pmp <type> <project>` | أنشئ مخطط PMP/PMBOK — WBS، وPERT/CPM، وGantt، وRACI، ومصفوفة المخاطر، وشبكة أصحاب المصلحة. |
| `/drawio:convert <source> [type]` | تحويل مصدر إلى رسم تخطيطي — DB المخطط → ERD، المجلدات → شجرة، الكود → UML، mermaid/CSV/JSON. |
| `/drawio:refine <file>` | قم بتحسين `.drawio` موجود - التخطيط، والموضوع، وإضافة/إزالة العقد، والمحاذاة إلى الشبكة. |

### 🗺️ Archmap — خريطة معمارية من الكود| الأمر | ماذا يفعل |
| --- | --- |
| `/archmap:vorcl <goal>` | هدف التعيين عبر Task Master — إنشاء مجموعة أثرية تم التحقق منها. |
| `/archmap:map [repo]` | خط الأنابيب الكامل: الاستخراج → `architecture.json` → شرح LLM → جميع التنسيقات (HTML، draw.io، Mermaid، ARCHITECTURE.md، PDF). |
| `/archmap:extract [repo]` | الاستخراج فقط — يمكن قراءته آليًا مع وجود `source:{file,line}` على كل عقدة. |
| `/archmap:annotate [json]` | إثراء LLM لـ `architecture.json` موجود (ذاكرة الوكيل، دلالات تدفق البيانات)؛ حقائق غير مثبتة تم تخفيض رتبتها تلقائيًا إلى `inferred`. |
| `/archmap:html [json]` | خريطة HTML تفاعلية مستقلة - تبديل الطبقة، وحزم التتبع، والعقدة → `file:line` اللوحة، والبحث، وطباعة CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (متعدد الصفحات: نظرة عامة / ERD / API / الوكلاء) و/أو Mermaid طرق العرض، تم التحقق من صحتها. |

### 🧜 حورية البحر — Mermaid الرسوم البيانية (+ تقديم حقيقي)
| الأمر | ماذا يفعل |
| --- | --- |
| `/mermaid:vorcl <goal>` | مجموعة من المخططات عبر Task Master — تم البناء عليها (تم التحقق من العرض). |
| `/mermaid:create <description> [type]` | أنشئ رسمًا تخطيطيًا من الوصف — بناء جملة صالح، تم التحقق منه بواسطة عرض حقيقي؛ يسلمك الملف. |
| `/mermaid:convert <source> [type]` | تحويل مصدر إلى Mermaid — DB المخطط → ER، الكود → الفئة/التسلسل، المجلدات → مخطط انسيابي، `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | بناء الجملة + اختبار العرض الحقيقي؛ البحث عن الأخطاء وإصلاحها (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | تصدير إلى SVG/PNG/PDF (حورية البحر-cli / كروكي / Mermaid.ink). |
| `/mermaid:refine <file>` | قم بتحسين `.mmd` موجود - الاتجاه، الرسم البياني الفرعي، classDef/styles، إمكانية القراءة. |

### 🧪 الاختبار - الاختبارات والتحقق
| الأمر | ماذا يفعل |
| --- | --- |
| `/testing:vorcl <goal>` | هدف الاختبار/التحقق عبر Task Master — وحدة + تكامل + e2e to do. |
| `/testing:unit <file\|module>` | اختبارات الوحدة (Vitest/Jest) - المسار السعيد، الحدود، الأخطاء؛ يديرها ويظهر الإخراج. |
| `/testing:integration <endpoint\|module>` | اختبارات التكامل (Supertest/inject، real DB أو testcontainers). |
| `/testing:e2e <scenario>` | Playwright E2E لمسار المستخدم المهم — محددات الأدوار، والتركيبات، وتتبع الفشل. |
| `/testing:verify <task\|testStrategy>` | ينفذ مهمة `testStrategy` ويعيد حكم جاهز / غير جاهز بمخرجات حقيقية. |
| `/testing:coverage [path]` | تقرير التغطية بالنتائج - ما هي التعليمات البرمجية المهمة التي لم يتم اختبارها؛ يخلق المهام. |
| `/testing:flaky <test>` | تشخيص اختبار غير مستقر (العرق، التوقيت، الحالة المشتركة، السخرية) وإصلاحه للأبد. |

### 🌿 gitflow — سير عمل وإصدارات git
| الأمر | ماذا يفعل |
| --- | --- |
| `/gitflow:vorcl <goal>` | هدف البوابة/الإصدار عبر Task Master (إعداد الإصدار، تنظيف السجل، فرع الميزات). |
| `/gitflow:commit <files\|scope>` | التزام بالاسم (أبدًا `git add .`) مع رسالة التزامات تقليدية؛ توقف على WIP غير معروف. |
| `/gitflow:pr <base> <title>` | الفرع → الالتزام → طلب السحب (gh / GitHub MCP) مع ماذا/لماذا/كيف تم التحقق منه. |
| `/gitflow:changelog [version]` | CHANGELOG.md (الاحتفاظ بسجل التغيير) تم إنشاؤه من عمليات الالتزام بين العلامات. |
| `/gitflow:release <version\|auto>` | قطع من الالتزامات → مزامنة إصدارات البيان → العلامة → GitHub الإصدار. ادفع فقط بعد التأكيد الصريح. |
| `/gitflow:audit [branch]` | تدقيق التاريخ للقراءة فقط: انتهاكات الاتفاقية، ومخالفات التفريغ، والنقط الكبيرة، والفروع اليتيمة. |

### 🛡️ الأمان - التدقيق الأمني (للقراءة فقط)
| الأمر | ماذا يفعل |
| --- | --- |
| `/security:vorcl <goal>` | هدف أمني عبر Task Master — التدقيق ← النتائج ← المهام ← الإصلاحات المفوضة. |
| `/security:secrets [path\|branch]` | الأسرار في شجرة العمل وتاريخ البوابة (جميع الفروع)؛ `${VAR:-}` العناصر النائبة ليست أسرار. |
| `/security:owasp [path]` | OWASP أعلى 10 في الكود: الحقن، XSS، المصادقة، عرض البيانات، CORS/ملفات تعريف الارتباط - مع الملف: دليل السطر. |
| `/security:deps` | التبعية CVEs عبر التدقيق / ملفات القفل - الخطورة، وعلامات تغيير التغيير. |
| `/security:pii [path]` | مخاطر تحديد الهوية الشخصية/اللائحة العامة لحماية البيانات: رسائل البريد الإلكتروني والهواتف والبطاقات المشفرة والسجلات؛ المسارات الخاصة للمطور. |
| `/security:pre-push [branch]` | فحص سريع ومدمج للملفات التي تم تغييرها قبل الدفع: الأسرار + الحقن + معلومات تحديد الهوية الشخصية؛ الحكم الأخضر / الأحمر. |

### 📝 المستندات — التوثيق
| الأمر | ماذا يفعل |
| --- | --- |
| `/docs:vorcl <goal>` | هدف التوثيق عبر Task Master. |
| `/docs:readme [path]` | إنشاء/تحديث الملف التمهيدي — What/quickstart/usage/config/troubleshooting؛ تم التحقق من الأمثلة؛ تمت مزامنة إصدارات اللغة. || `/docs:api [spec]` | API المستندات التي تم إنشاؤها من المواصفات OpenAPI (نقاط النهاية، المعلمات، أمثلة التجعيد)؛ يقترح `/swagger:audit` إذا لم يكن هناك المواصفات. |
| `/docs:architecture` | ARCHITECTURE.md - الوحدات النمطية، والحدود، وتدفق البيانات؛ الرسوم البيانية المفوضة إلى `mermaid`/`drawio`. |
| `/docs:contributing` | CONTRIBUTING.md - الإعداد، والهيكل، والاختبارات، واتفاقيات الالتزام (تتماشى مع `gitflow`)، وعملية العلاقات العامة. |
| `/docs:release-notes <version>` | ملاحظات الإصدار لإصدار من CHANGELOG/history. |
| `/docs:audit` | مستندات للقراءة فقط↔ التحقق من انحراف التعليمات البرمجية: الروابط المعطلة، والأمثلة/العدادات التي لا معنى لها، والترجمات غير المتزامنة. |

### 🐳devops — الحاويات & CI/CD
| الأمر | ماذا يفعل |
| --- | --- |
| `/devops:vorcl <goal>` | هدف البنية التحتية عبر Task Master. |
| `/devops:dockerfile [app-type]` | كتابة/مراجعة ملف Dockerfile - متعدد المراحل، وقاعدة رفيعة، وغير جذر، وفحص صحي؛ تم التحقق منها بواسطة `docker build` حقيقي. |
| `/devops:compose` | docker-compose.yml للتطوير المحلي (التطبيق + قواعد البيانات)؛ تغييرات البيئة تحتاج `--force-recreate`، وينتظر صحية. |
| `/devops:ci [type]` | GitHub الإجراءات — سير عمل العلاقات العامة (lint+typecheck+test، npm ذاكرة التخزين المؤقت)، نشر سير العمل، الحد الأدنى من الأذونات. |
| `/devops:env` | المخزون المتغير بيئيًا: أين تمت القراءة، ما هو مطلوب، `.env.example` القالب؛ أسرار أبدا في الصور. |
| `/devops:monitoring` | السجلات المنظمة (pino/JSON)، ونقطة النهاية الصحية، وما يجب التنبيه عليه؛ تقديم المقاييس عبر الوكيل `render`. |

### 📡 Liveboard — لوحة العمليات المحلية سريعة الزوال
| الأمر | ماذا يفعل |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | ابدأ لوحة تحكم مصقولة بـ 43 لغة على منفذ مضيف محلي مجاني؛ Task Master يتم تغيير التدفق عبر SSE والتوفيق كل 5 دقائق. |
| `/liveboard:vorcl <goal>` | تطوير أو تغيير لوحة الحياة نفسها من خلال سير العمل المطلوب. |

Liveboard يقرأ Git أشجار العمل وعمليات Claude/Codex/Cursor المحلية وكل شجرة عمل `.taskmaster/tasks/tasks.json`. تظل حالة وقت التشغيل في الذاكرة وتختفي عندما تتوقف عملية المقدمة. يكتشف UI لغة المتصفح ويقدم 43 لغة محلية، بما في ذلك الإنجليزية والروسية والأوكرانية والألمانية والفرنسية والإسبانية والبرتغالية والإيطالية والبولندية والتركية والصينية واليابانية والعربية والهولندية والتشيكية والسلوفاكية والرومانية والمجرية والبلغارية والصربية والكرواتية والسلوفينية واليونانية والعبرية والفارسية والهندية والبنغالية والأردية والإندونيسية والماليزية والفيتنامية والتايلاندية والكورية والسويدية والنرويجية والدانماركية والفنلندية والإستونية، اللاتفية، الليتوانية، الجورجية، الأرمينية، والأذربيجانية. تستخدم العربية والعبرية والفارسية والأردية تخطيط RTL.

التكوين المباشر:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: المشروع الذي تم فحص أشجار العمل والملفات الخاصة به.
- `--port 0`: تحديد منفذ حر تلقائيًا.
- `--interval`: الفاصل الزمني الكامل للتسوية بالمللي ثانية؛ مشاهدة الملفات لا تزال تتدفق Task Master تتغير على الفور.
- نقاط النهاية: `/health`، `/api/snapshot`، `/api/events` (SSE)، و `POST /api/refresh`.
- احتفظ بـ `--host 127.0.0.1` إلا إذا كنت تنوي بشكل صريح كشف معلومات المشروع للشبكة.

---

## التكوين (MCP والمفاتيح)

لا تحتوي الحزمة على ** لا توجد واجهة خلفية أو قاعدة بيانات بعيدة **. اللوحة الحية الاختيارية هي عملية في الذاكرة للمضيف المحلي فقط. MCP تحتاج الخوادم إلى الرموز المميزة، و**يوفر كل مستخدم الرموز المميزة الخاصة به**. لجعل هذا يعمل بشكل متماثل عبر **Claude Code و Codex و Cursor و Kimi CLI** - وسواء كنت تقوم بالتشغيل من محطة طرفية أو من Dock / Spotlight / IDE - يتم تشغيل كل خادم stdio MCP من خلال مشغل صغير (`bin/mcp-env.mjs`) يقرأ مفاتيحك من **ملف واحد**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

يقوم المثبت بإنشائه من [`.env.example`](./.env.example). افتحه واملأ المفاتيح التي تستخدمها فقط:

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

> **لماذا المشغل بدلاً من `~/.zshrc`؟** يختلف توسيع Env-var حسب وقت التشغيل (`${VAR:-}` في Claude، `${env:VAR}` في Cursor، الأحرف الحرفية في Codex/Kimi) وكل وقت تشغيل يقرأ فقط البيئة **التي تم إطلاقها فيها**. لا يتم تشغيل واجهة المستخدم الرسومية / IDE على نظام التشغيل macOS `~/.zshrc`، لذا تكون المفاتيح المصدرة غير مرئية ولا تتصل الخوادم بأي شيء - "MCP env not set" الكلاسيكي الفشل. تؤدي القراءة من ملف `.env` واحد إلى إزالة المشكلتين في وقت واحد.**الأسبقية** (تفوز لاحقًا): `~/.config/agent-vorcl-flow/.env` → a `./.env` في جذر المشروع → `export` حقيقي في الصدفة الخاصة بك. احتفظ بالمفاتيح العامة في الملف المشترك، وتجاوز كل مشروع (على سبيل المثال، `MONGODB_URI` مختلف) مع مشروع `.env`، وسيظل تصدير Shell الأصلي يفوز بعمليات التشغيل CLI. يمكنك توجيه المشغل إلى ملف مختلف باستخدام `AGENT_VORCL_ENV_FILE=/path/.env`.

الخادم الذي يكون مفتاحه المطلوب مفقودًا **لا يبدأ التشغيل** — سترى سطرًا واحدًا `[agent-vorcl-flow] MCP «…» is not configured: …` في سجل MCP وقت التشغيل، ويستمر كل خادم آخر في العمل. أضف المفتاح إلى `.env` وأعد التشغيل. (يمكنك الاحتفاظ بأسماء `GITHUB_TOKEN`/`MONGODB_URI` - يقوم المشغل بتعيينها على `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` التي تتوقعها الخوادم.)

> ⚠️ **مطلوب للأوامر التي تعمل بالذكاء الاصطناعي Task Master:** قم بتكوين موفر واحد محدد على الأقل — `ANTHROPIC_API_KEY` لـ Claude، أو `OPENAI_API_KEY` لـ GPT، أو Codex CLI OAuth. بدون بيانات اعتماد النموذج المحدد في `.taskmaster/config.json`، لا يمكن لـ `/vorcl` إنشاء المهام أو توسيعها.

اختر المزود الذي يقوم بالفعل بتشغيل عملية التوليد؛ المفاتيح وحدها لا تحدد النموذج:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

يستخدم الأمر التدفق الرسمي `task-master models` ويخزن تحديد النموذج فقط في `.taskmaster/config.json`. `PERPLEXITY_API_KEY` اختياري ومطلوب فقط عند تحديد الحيرة كنموذج بحث.

تستخدم خوادم **vercel** و **render** البعيدة OAuth (التفويض باستخدام `/mcp` في المتصفح). بالنسبة إلى العرض بدون رأس/CI، قم بتعيين `RENDER_API_KEY` في بيئتك وأضف إدخال رأس Bearer إلى هذا الخادم لوقت التشغيل الخاص بك.

---

## التحقق من التثبيت

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

Codex لا يحتوي على "مكونات إضافية"، لذلك يتم التعبير عن نفس الإمكانيات في **المهارات** و **ملفات التعريف** وجهاز التوجيه `AGENTS.md`:

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

انظر [`codex/README.md`](./codex/README.md) للحصول على الخريطة الكاملة.

---

## Cursor

Cursor يستخدم نفس التنسيق `SKILL.md` المفتوح مثل المحول Codex، بالإضافة إلى الوكلاء الفرعيين المخصصين الأصليين والتكوين MCP العام:

| Agent-Vorcl-Flow مفهوم | Cursor يعادل |
| --- | --- |
| الدور `backend` | الوكيل الفرعي المخصص `/avf-backend` في `~/.cursor/agents` |
| أمر المهمة `/backend:create-api` | مهارة `/backend-create-api` |
| عالمي `/vorcl` | مهارة `/vorcl` |
| `.mcp.json` | الخوادم المدمجة في `~/.cursor/mcp.json` |

يقوم المثبت بتحويل تعريفات الأدوار إلى Cursor المادة الأمامية، ويضع البادئات الفرعية بـ `avf-` لتجنب تضارب أسماء المهارات، ويستخدم `model: inherit`، ويضع علامة على وكلاء التدقيق فقط كـ `readonly: true`. يتم الاحتفاظ بإدخالات الخادم الموجودة بنفس الأسماء. انظر [`cursor/README.md`](./cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) يقوم أصلاً بتحميل مهارات الوكيل وملفات الوكيل المخصصة وخطافات دورة الحياة؛ يقوم AVF أيضًا بدمج نفس الخوادم MCP المستخدمة بواسطة Claude و Cursor:

| Agent-Vorcl-Flow المفهوم | Kimi CLI ما يعادل |
| --- | --- |
| المهارات / أوامر المهمة | `~/.kimi/skills` و `/skill:<name>` |
| Expo وكيل مخصص | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse Guard | تم دمجها في `~/.kimi/config.toml` |
| `.mcp.json` | الخوادم المدمجة في `~/.kimi/mcp.json` |
| ملف مفتاح لكل وقت تشغيل | المشتركة `~/.config/agent-vorcl-flow/.env` (عبر المشغل) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI لا يحتوي على توسيع `${VAR}` في `mcp.json`، لذا تأتي المفاتيح من `.env` المشتركة من خلال المشغل - تمامًا مثل أوقات التشغيل الأخرى. انظر [`kimi/README.md`](./kimi/README.md).

---

## هيكل المشروع

```text
.claude-plugin/plugin.json      # plugin manifest
.claude-plugin/marketplace.json # local marketplace (for install)
agents/       22 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (44 skills; some ship references, scripts, tests or HTML assets)
commands/     <namespace>/<command>.md    (135 commands, /namespace:command, including /vorcl and /audit)
hooks/        hooks.json + SessionStart + PostToolUse guards (empty catch, Expo architecture/UI boundaries)
.mcp.json     github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master, mermaid
.env.example  template for ~/.config/agent-vorcl-flow/.env (single key file for all runtimes)
bin/          install.mjs (the npx installer) + mcp-env.mjs (cross-runtime MCP launcher / .env loader)
codex/        GPT Codex adapter (skills + config.toml + install.sh)
cursor/       Cursor adapter (MCP template + installation notes)
kimi/         Kimi CLI adapter (skills install + Expo agent/hook + MCP)
```

**كيف تتناسب معًا:** `agents/*.md` أعلن دورًا، وفي المقدمة `skills:`، قم بإرفاق المهارات ← يتم تحميل المهارات الموجودة في `skills/*/SKILL.md` تلقائيًا عن طريق الوصف → `commands/<agent>/*.md` توفير اختصارات `/agent:command` سريعة يتم تفويضها إلى الوكيل الفرعي → `.mcp.json` يمنح الوكلاء أدواتهم، يبدأ كل منهم من خلال `bin/mcp-env.mjs` الذي يقوم بتحميل الأسرار من `.env` المشتركة. يخبرنا الخطاف بتوفر الوكلاء.

---

## الترخيص

معهد ماساتشوستس للتكنولوجيا – مجاني للاستخدام والنسخ والتعديل والتوزيع؛ المقدمة "كما هي"، دون أي ضمان أو مسؤولية. انظر [LICENSE](./LICENSE).

© 2026 كريستيان أفيس (Vorcl).
