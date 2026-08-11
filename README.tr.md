<div align="center">

# Agent-Vorcl-Flow

**Beceriler, komutlar ve MCP araçlarıyla [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) ve [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) için uzmanlaşmış yapay zeka alt aracılarından oluşan bir ekip.**
Tek bir komutla bunları yükler. Uzak arka uç veya bulut barındırma yok: Kodlama aracınız her şeyi yerel olarak çalıştırır.

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
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [**Türkçe**](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 01861dcfef6354f49ecb1c6e62f9c5316943aeb8305556e432e273d7117f85e6. -->

</div>

---

## Bu nedir?

Agent-Vorcl-Flow desteklenen bir kodlama aracısını **yapılandırılmış bir mühendislik ekibine** dönüştürür. Tek bir genel asistan yerine, her biri kendi etki alanı **becerilerine**, hızlı **eğik çizgi komutlarına** ve ihtiyaç duyduğu **MCP araçlara** sahip **22 odaklanmış alt aracı** (mimar, arka uç, ön uç, Expo mobil mühendisi, DB mühendis, mimari haritacı, liveboard operatörü ve daha fazlası) alırsınız. Önemsiz olmayan her görev disiplinli bir **Task Master** döngüden geçer — *hedef → görevler → uygulama → doğrulama → yapıldı* — böylece iş planlanır, takip edilir ve kesintilere karşı dayanıklı olur.

- 🧩 **22 alt ajan**, 44 beceri, 135 eğik çizgi komutu
- ⚡ Claude Code, Codex, Cursor ve/veya Kimi CLI — `npx` için **Tek komutla kurulum**
- 🔌 **11 MCP sunucu** kablolu (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, dosya sistemi, Task Master, Mermaid)
- 🔑 **Tüm çalışma zamanları için tek bir `.env` dosya** — anahtarlar `~/.zshrc` tarafından değil başlatıcı tarafından okunur, böylece GUI/IDE başlatıldığında bile çalışırlar; uzaktan AVF hizmeti yok; liveboard yalnızca localhost'a yöneliktir ve geçicidir
- 🤝 **Aynı kaynaktan Claude Code, GPT Codex, Cursor ve Kimi CLI** üzerinde çalışır

---

## Hızlı başlangıç

### Gereksinimler
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** ve/veya **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Yükle (tek komut)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Tek bir çalışma zamanını bir bayrakla hedefleyin:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Yükleyici ne yapar:

| Çalışma zamanı | Eylem |
| --- | --- |
| **Paylaşılan katman** | Başlatıcıyı `~/.config/agent-vorcl-flow/bin/mcp-env.mjs`'ye kopyalar ve şablondan `~/.config/agent-vorcl-flow/.env`'yi oluşturur (bir kez) — her çalışma zamanı için tek anahtar dosyası. |
| **Claude Code** | Bu repoyu bir eklenti **pazar yeri** olarak kaydeder ve eklentiyi etkinleştirir (`claude plugin …` aracılığıyla, doğrudan `~/.claude/settings.json` geri dönüşüyle). |
| **GPT Codex** | Becerileri `~/.agents/skills` ve `config.toml` + `AGENTS.md` bloklarını `~/.codex` (idempotent, işaretleyiciler arasında) olarak birleştirir. |
| **Cursor** | Becerileri `~/.cursor/skills`'ye, yerel özel alt aracıları `~/.cursor/agents`'ye yükler ve eksik sunucuları `~/.cursor/mcp.json`'de birleştirir. |
| **Kimi CLI** | Becerileri `~/.kimi/skills`'ye, yerel Expo özel aracısını `~/.kimi/agents`'ye yükler, her iki Expo mimarisi/UI `~/.kimi/config.toml`'ye bağlanır ve MCP sunucularını birleştirir. |

> Yükleyici hiçbir zaman sırlarınızı doldurmaz; yalnızca şablondan boş bir `.env` oluşturur. Anahtarları buraya eklersiniz (bkz. [Configuration](#yapılandırma-mcp-ve-tuşlar)).

### En son sürüme güncelleyin

Yükleyiciyi npm `latest` etiketiyle tekrar çalıştırın:

```bash
npx --yes agent-vorcl-flow@latest
```

Yalnızca bir çalışma zamanını güncellemek için kurulum sırasında kullandığınız çalışma zamanı bayrağını koruyun:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

Güncelleme, Agent-Vorcl-Flow tarafından yönetilen becerileri, aracıları, kancaları, başlatıcıyı ve yapılandırma bloklarını kapsıyor. Mevcut `~/.config/agent-vorcl-flow/.env` bilgilerinizi ve sırlarını değiştirmeden tutar ve yukarı yönlü Firecrawl becerilerinizi korur. Güncellenen kodlama istemcisini daha sonra yeniden başlatın (veya Claude Code'de `/reload-plugins` komutunu çalıştırın).

### Alternatif kurulumlar (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Yüklemeden sonra aracıları yüklemek için **Claude Code**'i yeniden başlatın (veya açık bir oturumda `/reload-plugins`'yi çalıştırın).

---

## Nasıl kullanılır?

Bu bölümdeki örneklerde Claude Code sözdizimi kullanılmaktadır; yerel sözdizimleri için aşağıdaki [Cursor](#cursor) ve [GPT Codex](#gpt-codex) eşlemelerine bakın. Claude Code'de takımı çağırmanın **üç yolu** vardır.

### 1. Evrensel giriş noktası — sadece bir hedef belirtin
```text
/vorcl add a shopping cart to checkout
/audit .
```
`/vorcl` işin hangi alt aracıya ait olması gerektiğini belirler ve tüm Task Master döngüsünü yürütür. `/audit` arka ucu, ön ucu, mobil verileri ve altyapıyı otomatik olarak algılar ve ilgili tüm rolleri kullanarak kanıta dayalı bir `PROJECT_AUDIT.md` yazar.

### 2. Belirli bir alt temsilciyle konuşun
```text
@agent-vorcl-flow:architect  design billing for a SaaS
@agent-vorcl-flow:backend    add a POST /invoices endpoint
```

### 3. Belirli bir eğik çizgi komutunu çalıştır
```text
/backend:create-api   POST /invoices
/analyzer:audit       src/
/screenshot:convert   ./mockups/dashboard.png  react
```

Her aracının aynı zamanda o aracıya yönelik Task Master döngüsünü çalıştıran kendi `/<agent>:vorcl` giriş noktası vardır.

### Task Master döngüsü
Önemsiz olmayan her görev **Task Master** (`task-master-ai`) üzerinden akar:

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```

Bu, işin planlı, kontrol noktalı ve devam ettirilebilir olmasını sağlar; doğrulama adımını geçmeden hiçbir şeyin "tamamlandığı" bildirilmez.

---

## Acenteler| Temsilci | Rol | Öne Çıkanlar |
| --- | --- | --- |
| 🔵 **mimar** | Sistemler ve çözüm mimarı | Gereksinim analizi, sistem/DB/API tasarımı, mimari incelemeleri |
| 🟢 **arka uç** | Arka uç geliştiricisi | Düğüm/TS, Postgres, Redis; modüler mimari; OpenAPI |
| 🟣 **ön uç** | Ön Uç (React 19 / Next.js Uygulama Yönlendiricisi) | Bileşenler, durum, veri getirme, oluşturma/paket optimizasyonu, testler |
| 📱 **expo-mobile** | React Native + Expo mühendis | Modüler mimarinin yanı sıra Tasarım/Hareket/Etkileşim Sistemi, yerel navigasyon, belirteçler, hareketler, dokunma teknolojisi, Azaltılmış Hareket |
| 🟠 **analizör** | Kod denetçisi (salt okunur) | Hatalar, tür güvenliği, DB yapısı, ön uç taklitleri, arka uç kokuları |
| 🟡 **havalı** | OpenAPI/Swagger kapsamı (herhangi bir yığın) | Tam olarak belgelenmemiş rotaları bulur ve doğrulamayla bunları kapsar |
| 🔴 **havai fişek** | Web araştırmacısı | Canlı CLI/MCP/REST, uygulama entegrasyonu ve tamamlanmış web verileri iş akışları |
| 🟤 **oluşturma** | Barındırma ve dağıtım (Render) | Dağıtımlar, günlük odaklı tanılamalar, ölçümler, ortam değişkenleri, İşleme Postgres |
| 🟦 **veritabanı** | DB mühendis / DBA | Şema, sorgular ve planlar, dizinler, N+1, güvenli geri döndürülebilir geçişler, önbellek |
| ⚪ **esneklik** | Güvenilirlik: hatalar + günlük kaydı | doğru sınırları deneyin/yakalayın, yazılan hatalar, yeniden denemeler/zaman aşımları, yapılandırılmış günlükler |
| 🖼️ **ekran görüntüsü** | Ekran görüntüsü UI → kod | UI ekran görüntüsünü üretime hazır, duyarlı, erişilebilir koda dönüştürür |
| 🔎 **görsel araştırma** | Ekran görüntüsü → doğrulanmış yanıt | Siteyi/sayfayı tanımlar, resmi belgeleri bulur, canlı verileri kontrol eder ve URL'lerle ve güvenle yanıtlar |
| 🎯 **belirleme** | Ekran görüntüsü → mevcut bir projeye yerleştirin (salt okunur) | Çalışan bir uygulama ekran görüntüsünü gerçek kod tabanına (bileşen, `file:line`, rota/sayfa, tam kontrol ve arkasındaki mantık) temellendirir; hiçbir şey yaratmaz, düzenlemeyi devreder |
| 📊 **drawio** | Diyagramlar (draw.io / diyagramlar.net) | Akış şeması, BPMN, UML, ERD, ağ/bulut ve PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **archmap** | Mimari haritacı | Deterministik kod → `architecture.json` (her düğümde `source:{file,line}` bulunur) → etkileşimli HTML haritası, Draw.io, Mermaid, ARCHITECTURE.md, PDF; kanıtlanmamış gerçekler işaretlenmiştir `inferred` |
| 🧜 **denizkızı** | Mermaid diyagramlar (+ gerçek oluşturma) | akış şeması, sıra, sınıf, durum, ER, gantt, gitGraph, zihin haritası…; mcp-mermaid/`mmdc` aracılığıyla doğrulandı; dosyayı size veriyor (`.mmd` + SVG/PNG/PDF) |
| 🧪 **test** | Test ve doğrulama mühendisi | Birim (Vitest/Jest), entegrasyon (Süpertest), E2E (Playwright), kapsama alanı, kesintili test avcılığı; her görevin `testStrategy` işlemini yürütür — yeşil çalıştırma olmadan hiçbir şey "tamamlanmaz" |
| 🌿 **gitflow** | Git iş akışı ve sürümler | Geleneksel Taahhütler, isme göre taahhütler (asla `git add .`), PR'ler, Değişiklik Günlüğü Tut, semver sürümleri; yalnızca açık onayla itin |
| 🛡️ **güvenlik** | Güvenlik denetçisi (salt okunur) | Ağaç ve git geçmişindeki sırlar, OWASP İlk 10, bağımlılık CVE'leri, PII; bulgular göreve dönüşür; düzeltmeler devredilir |
| 📝 **belgeler** | Dokümantasyon mühendisi | README (çoklu dil eşitliği), OpenAPI'dan API dokümanlar, MİMARLIK, KATKIDA BULUNMA, sürüm notları; her örnek koda göre doğrulandı |
| 🐳 **devops** | Kaplar ve CI/CD | Çok Aşamalı Dockerfiles, yerel geliştirici için docker-compose, GitHub Eylem işlem hatları, env/sır hijyeni, izleme |
| 📡 **canlı tahtası** | Yerel operasyonlar kurulu | Geçici bir localhost kontrol panelinde canlı Git çalışma ağaçları, aracı süreçleri ve Task Master görevler |**Bilmeye değer birkaç şey:**
- **Ön uç her zaman gerçek bir API ile konuşur.** Arka ucun OpenAPI spesifikasyonu gerçeğin tek kaynağıdır; türler ondan oluşturulur (`openapi-typescript` + `openapi-fetch`). Üretim yolunda taklit yok.
- **`database` mutasyonlar açık onay gerektirir.** Analizler salt okunurdur; şema/veri değişiklikleri (DDL/DML/geçişler) sizin izniniz olmadan asla çalışmaz.
- **`resilience` bir güvenlik kancası sunar.** Engellenmeyen bir `PostToolUse` ​​kancası (`catch-guard.js`), yeni düzenlediğiniz dosyalardaki boş `catch {}` bloklarını nazikçe işaretler.
- **`archmap` hiçbir zaman hayal gücünden faydalanmaz.** Çıkarma ve işleme kesin olarak ayrılmıştır: sıfır bağımlılık komut dosyaları, repo'yu `architecture.json`'ye (gerçek FK kardinalitesine sahip veritabanları, API rotalar, modelleri/araçları/belleği, içe aktarma grafiği, env'si ile AI aracıları) yönlendirir ve her diyagram yalnızca bu JSON'den oluşturulur. LLM'nin doğrulanabilir bir `file:line` olmadan eklediği her şey zorunlu olarak `inferred:true` olarak işaretlenir ve kesikli çizgiyle çizilir.
- **`pinpoint` bulur, asla oluşturmaz.** Çalışan bir uygulamanın ekran görüntüsü verildiğinde, ekranı gerçek kodla (bileşen, rota, tam kontrol ve arkasındaki mantık) eşleştirir ve düzenlemeyi `frontend`/`backend`'ye verir. Zaten var olan üzerinde çalışır (`screenshot`'nın tersi).
- **`visual-research` tahmin etmek yerine doğrular.** Ekran görüntüsünü kanıt olarak ele alır, resmi alan adını ve belgeleri onaylar, mevcut site verilerini kontrol eder ve olası kimlik avı veya eski değerleri işaretler.
- **`i18n` "sıfır dilde sabit kodlamayı" zorunlu kılar.** Aracılar öncelikle bir projenin çok dilli olup olmadığını tespit eder ve uyarlar; kullanıcıya yönelik dizeler bir çeviri katmanından (next-intl / react-i18next / i18next) geçer, asla satır içi değildir.

---

## Komut referansı

Aşağıdaki her komut bir eğik çizgi komutudur. `<…>` girişinizi işaretler.

### `/vorcl` — evrensel yönlendirici
| Komut | Ne işe yarar |
| --- | --- |
| `/vorcl <goal>` | Herhangi bir hedefi göreve dönüştürür ve onu doğru alt aracıya yönlendirir, ardından tamamlanana kadar tüm döngüyü çalıştırır. |
| `/audit [path] [focus]` | Derin salt okunur çok rollü denetim → algılanan sistemler, güvenlik/CVE/esneklik bulguları, hedef mimari ve aşamalı `PROJECT_AUDIT.md`. |

### 🔵 mimar — mimarlık
| Komut | Ne işe yarar |
| --- | --- |
| `/architect:vorcl <goal>` | Hedef → görevler → döngü, mimari kapsamına alınmıştır. |
| `/architect:analyze <context>` | Gereksinimleri ve görevin içeriğini analiz edin. |
| `/architect:design <problem>` | Çözüm mimarisini tasarlayın (sistem, DB, API). |
| `/architect:review <target>` | Mevcut bir mimariyi inceleyin. |

### 🟢 arka uç — sunucu (Düğüm/TS, Postgres, Redis)
| Komut | Ne işe yarar |
| --- | --- |
| `/backend:vorcl <goal>` | Hedef → görevler → arka uç çalışması döngüsü. |
| `/backend:create-api <endpoint>` | Modüler mimaride tamamen OpenAPI kapsamına giren bir API uç noktası oluşturun. |
| `/backend:refactor <target>` | Davranışı değiştirmeden kodu yeniden düzenleyin. |
| `/backend:optimize <target>` | Performans optimizasyonu. |
| `/backend:test <target>` | Kod için testler oluşturun. |

### 🟣 ön uç — React / Next.js
| Komut | Ne işe yarar |
| --- | --- |
| `/frontend:vorcl <goal>` | Hedef → görevler → ön uç çalışması için döngü. |
| `/frontend:create-component <spec>` | Özellik yapısını takip ederek bir UI bileşeni oluşturun. |
| `/frontend:refactor <target>` | Davranışı değiştirmeden yeniden düzenleme UI / kancalar. |
| `/frontend:optimize <target>` | Oluşturma/paketleme/Önemli Web Verilerini optimize edin. |
| `/frontend:test <target>` | Bileşen testleri oluşturun. |

### 📱 fuar-mobil — React Native / Expo| Komut | Ne işe yarar |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Hedef → Expo mobil çalışma için Task Master döngüsü. |
| `/expo-mobile:create-module <domain>` | Yalnızca karmaşıklığının ihtiyaç duyduğu katmanları içeren modüler bir iş dilimi oluşturun. |
| `/expo-mobile:create-screen <flow>` | İnce bir Expo Router rota artı modüle ait bir ekran ve durumlar oluşturun. |
| `/expo-mobile:design-screen <flow>` | Paylaşılan tasarım/hareket belirteçleri, durumlar ve erişilebilirlik ile birinci sınıf bir ekran oluşturun. |
| `/expo-mobile:motion <interaction>` | Yerel gezinme, yaylar, hareketler, dokunsal ve azaltılmış hareketli geri dönüşler tasarlayın. |
| `/expo-mobile:add-api <contract>` | Şema/DTO/eşleştirici/sorgu anahtarlarını ve TanStack Query entegrasyonunu ekleyin. |
| `/expo-mobile:audit [scope]` | Salt okunur mimari koruması ve kanıta dayalı denetim. |
| `/expo-mobile:ui-audit [scope]` | Salt Okunur Tasarım Sistemi, hareket, etkileşim, erişilebilirlik ve performans denetimi. |
| `/expo-mobile:compatibility [app] [change]` | Sürümlendirilmiş resmi kaynaklara göre canlı salt okunur Expo/RN/Node/package/yerel çalışma zamanı uyumluluk denetimi. |
| `/expo-mobile:test <scope>` | Etki alanı birimini, React Native Test Kitaplığını ve Maestro kontrollerini çalıştırın. |

### 🟠 analizör — kod denetimi (salt okunur)
| Komut | Ne işe yarar |
| --- | --- |
| `/analyzer:vorcl <goal>` | Bir hedefi Task Master aracılığıyla denetleyin; bulgular göreve dönüşür. |
| `/analyzer:audit` | Tam denetim: hatalar, türler, DB, ön uç taklitleri, arka uç kokuları. |
| `/analyzer:bugs` | Hataları avlayın — işlenmeyen hatalar, yarış koşulları, uç durumlar. |
| `/analyzer:types` | Tip kontrolü — `tsc`, `any`, güvensiz kullanımlar, zod↔tiplerinin kayması. |
| `/analyzer:db` | Denetim DB yapısı — şema, dizinler, FK'ler, N+1, geçişler. |
| `/analyzer:mocks` | Ön uçta maket/sahte verileri bulun. |
| `/analyzer:backend` | "Kötü" arka uç kodunu bulun - mimari ihlalleri, denetleyicilerdeki mantık. |

### 🟡 havalı — OpenAPI/Swagger kapsamı (herhangi bir yığın)
| Komut | Ne işe yarar |
| --- | --- |
| `/swagger:vorcl <goal>` | Task Master — denetim → görevler → kapsam → doğrulama yoluyla tam kapsamlı hedef. |
| `/swagger:audit` | Salt okunur: Spesifikasyonun tam olarak kapsamadığı rotaları bulun. |
| `/swagger:cover <route>` | Bir rotayı/modülü kapsayın - parametreler, yanıtlar, açıklamalar, güvenlik + doğrulama. |

### 🔴 havai fişek — web araştırması
| Komut | Ne işe yarar |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Task Master aracılığıyla araştırma hedefi — bitmiş bir sonuç elde etmek için web verilerini toplayın. |
| `/firecrawl:search <query>` | Bir soruyla ilgili kaynakları internette arayın. |
| `/firecrawl:scrape <url>` | Bir URL'yi işaretleme/JSON içine kazıyın. |
| `/firecrawl:map <url>` | Bir sitenin URL'lerini eşleyin. |
| `/firecrawl:crawl <url>` | Bir bölümü/siteyi yinelemeli olarak tarayın. |
| `/firecrawl:extract <url>` | Bir JSON şemasıyla yapılandırılmış çıkarma. |
| `/firecrawl:setup` | CLI'yi yükleyin/doğrulayın ve ayrıca resmi derleme ve iş akışı becerileri (onay ile). |
| `/firecrawl:interact <url>` | Kazıma yetersiz olduğunda formları tıklayın, gezinin veya doldurun. |
| `/firecrawl:parse <file>` | Yerel/özel bir belgeyi işaretleme veya JSON olarak ayrıştırın. |
| `/firecrawl:monitor <action>` | Yinelenen sayfa değişikliği izleyicilerini listeleyin veya yönetin. |
| `/firecrawl:agent <goal>` | Sınırlı, uzun süreli bir Firecrawl Agent görevini çalıştırın. |
| `/firecrawl:research <query>` | Makaleleri ve GitHub araştırma içeriğini arayın. |
| `/firecrawl:ask <jobId>` | Başarısız bir Firecrawl işi teşhis edin. |
| `/firecrawl:docs-search <question>` | Geçerli resmi Firecrawl belgelerini arayın. |
| `/firecrawl:integrate <feature>` | Yukarı akış oluşturma becerileri aracılığıyla uygulama koduna Firecrawl ekleyin. |
| `/firecrawl:deliverable <artifact>` | Özet, denetim, müşteri listesi veya başka bir iş akışı yapısı oluşturun. |`/firecrawl:setup` resmi `firecrawl-cli init --all` akışını ancak onaylandıktan sonra çalıştırır. Mevcut resmi `firecrawl-*` beceriler önceliklidir ve Codex/Cursor yükleyicisi tarafından korunur; AVF, eksik beceriler için uyumlu yedekler sağlar. Canlı operasyonlar CLI → MCP → REST/anahtarsız olarak yönlendirilir.

### 🟤 render — barındırma / dağıtma (Render)
| Komut | Ne işe yarar |
| --- | --- |
| `/render:vorcl <goal>` | Task Master aracılığıyla kızılötesi hedefi — tamamlanacak şekilde dağıtma/tanılama/yapılandırma. |
| `/render:deploy <service>` | Bir hizmeti dağıtın/yeniden dağıtın. |
| `/render:logs <service>` | Temel nedene kadar hizmet günlükleri ve teşhisler. |
| `/render:status <service>` | Hizmet durumu + dağıtım + ölçümler. |
| `/render:query <sql>` | Render'a karşı salt okunur SQL Postgres. |

### 🟦 veritabanı — DB mühendis / DBA (Postgres / MongoDB / Redis)
| Komut | Ne işe yarar |
| --- | --- |
| `/database:vorcl <goal>` | Task Master aracılığıyla veri hedefi — şema/sorgular/geçişler/önbellek tamamlandı. |
| `/database:query <query>` | Salt okunur sorgu/analiz. |
| `/database:schema <target>` | Şemayı ve veri bütünlüğünü tasarlayın / inceleyin. |
| `/database:migrate <change>` | Güvenli, geri döndürülebilir bir şema/veri geçişi planlayın. |
| `/database:optimize <target>` | Optimize edin — dizinler, N+1, sorgu planları, sayfalandırma. |
| `/database:cache <target>` | Redis — TTL, geçersiz kılma, kilitler, hız sınırlama, Akışlar. |

### ⚪ esneklik — hata işleme + günlük kaydı
| Komut | Ne işe yarar |
| --- | --- |
| `/resilience:vorcl <goal>` | Task Master aracılığıyla güvenilirlik hedefi — try/catch + günlüklerini içeren kapak kodu. |
| `/resilience:harden <target>` | Kodu try/catch/finally'ye katı günlük kaydıyla sarın, sessiz hatalar yok. |
| `/resilience:logging <target>` | Yapılandırılmış günlük kaydı ekleyin/düzeltin — düzeyler, bağlam, sır yok/PII. |
| `/resilience:audit` | Salt okunur: sessiz hataları, boş yakalamaları, kayıt boşluklarını bulun. |

### 🖼️ ekran görüntüsü — ekran görüntüsü UI → kod
| Komut | Ne işe yarar |
| --- | --- |
| `/screenshot:vorcl <goal>` | Task Master — arıza → kod yoluyla ekran görüntülerinden bir dizi ekran. |
| `/screenshot:analyze <image>` | Salt okunur döküm — düzen, bileşenler, belirteçler, durumlar → plan. |
| `/screenshot:convert <image> [framework]` | Bir ekran görüntüsünden tam çalıştırılabilir kod oluşturun (varsayılan React + Tailwind v4). |
| `/screenshot:tokens <image>` | Tasarım belirteçlerini (OKLCH renkleri, tipografi, aralık) Tailwind `@theme`'ye çıkarın. |
| `/screenshot:responsive <target>` | Oluşturulan UI kesme noktaları, değişken, `clamp()` kapsayıcı sorgularını duyarlı hale getirin. |

### 🔎 görsel araştırma — ekran görüntüsü → doğrulanmış web yanıtı
| Komut | Ne işe yarar |
| --- | --- |
| `/visual-research:vorcl <goal>` | Task Master aracılığıyla çok adımlı ekran görüntüsü araştırması. |
| `/visual-research:identify <image>` | Siteyi, sayfayı ve özelliği güven kanıtıyla tanımlayın. |
| `/visual-research:search <image> <target>` | Görsel ipuçlarından gerçek sayfayı veya resmi belgeleri bulun. |
| `/visual-research:answer <image> <question>` | Ekran görüntüsü kanıtlarını, resmi belgeleri ve güncel canlı verileri kullanarak yanıt verin. |
| `/visual-research:hints <image> <goal>` | Görünür arayüz için güvenli, belgelerle desteklenen adımlar verin. |

### 🎯 nokta belirleme — ekran görüntüsü → mevcut bir projeye yerleştirme (salt okunur)
| Komut | Ne işe yarar |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Mevcut UI öğesini Task Master — harita → görevler → yetki verme aracılığıyla bir ekran görüntüsünden bulun/anlayın/değiştirin. |
| `/pinpoint:locate <image>` | Mevcut bileşeni/dosyaları ekran görüntüsünden bulun — `file:line`, yeni kod yok. |
| `/pinpoint:route <image>` | Ekranın bulunduğu rotayı/sayfayı tanımlayın (Next.js Uygulama/Pages Router, React Router). |
| `/pinpoint:control <image>` | Koddaki kontrolün (düğme/alan) ve işleyicisinin tam yerini belirleyin. |
| `/pinpoint:trace <target>` | Bir öğenin arkasındaki mantığı izleyin — işleyici → durum → veri getirme → API. |
| `/pinpoint:handoff <change>` | Mevcut koda göre kesin bir düzenleme isteği oluşturun ve `frontend`/`backend`'ye yetki verin. |

### 📊drawio — diyagramlar (draw.io / diyagramlar.net)
| Komut | Ne işe yarar |
| --- | --- |
| `/drawio:vorcl <goal>` | Task Master aracılığıyla bir dizi diyagram — tamamlanacak yapı. |
| `/drawio:create <description> [type]` | Metin açıklamasından (geçerli yerel XML) bir diyagram oluşturun. |
| `/drawio:pmp <type> <project>` | Bir PMP/PMBOK diyagramı oluşturun — WBS, PERT/CPM, Gantt, RACI, risk matrisi, paydaş tablosu. |
| `/drawio:convert <source> [type]` | Kaynağı diyagrama dönüştürün — DB şema → ERD, klasörler → ağaç, kod → UML, deniz kızı/CSV/JSON. |
| `/drawio:refine <file>` | Mevcut bir `.drawio`'yi iyileştirin — düzen, tema, düğüm ekleme/kaldırma, ızgaraya hizalama. |

### 🗺️ archmap — koddan mimari harita| Komut | Ne işe yarar |
| --- | --- |
| `/archmap:vorcl <goal>` | Task Master aracılığıyla bir eşleme hedefi — doğrulanmış bir yapı seti oluşturmak. |
| `/archmap:map [repo]` | Tam işlem hattı: çıkarma → `architecture.json` → Yüksek Lisans açıklaması → tüm formatlar (HTML, Draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Yalnızca çıkarma — her düğümde `source:{file,line}` ile makine tarafından okunabilen `architecture.json`. |
| `/archmap:annotate [json]` | Mevcut bir `architecture.json`'nin Yüksek Lisans zenginleştirmesi (aracı belleği, veri akışı semantiği); kanıtlanmamış gerçekler otomatik olarak `inferred`'ye indirildi. |
| `/archmap:html [json]` | Etkileşimli bağımsız HTML harita — katman geçişleri, izleme ışınları, düğüm → `file:line` paneli, arama, CSS yazdırma. |
| `/archmap:diagram [json] [drawio\|mermaid]` | Draw.io (çok sayfalı: Genel Bakış / ERD / API / Temsilciler) ve/veya Mermaid görünümler, doğrulandı. |

### 🧜 deniz kızı — Mermaid diyagramlar (+ gerçek oluşturma)
| Komut | Ne işe yarar |
| --- | --- |
| `/mermaid:vorcl <goal>` | Task Master aracılığıyla bir dizi diyagram — tamamlanacak derleme (oluşturma doğrulandı). |
| `/mermaid:create <description> [type]` | Açıklamadan bir diyagram oluşturun - gerçek bir oluşturmayla doğrulanan geçerli sözdizimi; dosyayı sana verir. |
| `/mermaid:convert <source> [type]` | Kaynağı Mermaid — DB şema → ER, kod → sınıf/sıra, klasörler → akış şeması, `.drawio`/CSV/JSON biçimine dönüştürün. |
| `/mermaid:validate <file>` | Sözdizimi + gerçek oluşturma testi; hataları bulun ve düzeltin (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | SVG/PNG/PDF (denizkızı-cli / Kroki / Mermaid.ink) formatına aktarın. |
| `/mermaid:refine <file>` | Mevcut bir `.mmd`'yi iyileştirin — yön, alt grafik, sınıf tanımı/stilleri, okunabilirlik. |

### 🧪 test etme — testler ve doğrulama
| Komut | Ne işe yarar |
| --- | --- |
| `/testing:vorcl <goal>` | Task Master — birim + entegrasyon + e2e aracılığıyla bir test/doğrulama hedefi tamamlandı. |
| `/testing:unit <file\|module>` | Birim testleri (Vitest/Jest) — mutlu yol, sınırlar, hatalar; bunları çalıştırır ve çıktıyı gösterir. |
| `/testing:integration <endpoint\|module>` | Entegrasyon testleri (Süpertest/enjekte, gerçek DB veya test kapsayıcıları). |
| `/testing:e2e <scenario>` | Playwright Kritik bir kullanıcı yolu için E2E — rol seçiciler, donanımlar, arıza durumunda izleme. |
| `/testing:verify <task\|testStrategy>` | Bir görevin `testStrategy` işlemini yürütür ve gerçek çıktıyla HAZIR / HAZIR DEĞİL kararı verir. |
| `/testing:coverage [path]` | Bulguları içeren kapsam raporu — hangi kritik kodun test edilmediği; görevler oluşturur. |
| `/testing:flaky <test>` | Kararsız bir testi (ırk, zamanlama, paylaşılan durum, taklitler) teşhis eder ve bunu tamamen düzeltir. |

### 🌿 gitflow — git iş akışı ve sürümler
| Komut | Ne işe yarar |
| --- | --- |
| `/gitflow:vorcl <goal>` | Task Master aracılığıyla bir git/yayın hedefi (bir sürüm hazırlayın, geçmişi temizleyin, özellik dalı). |
| `/gitflow:commit <files\|scope>` | Geleneksel Taahhütler mesajıyla isimle işleme (asla `git add .`); bilinmeyen WIP'te durur. |
| `/gitflow:pr <base> <title>` | Şube → taahhüt eder → ne/neden/nasıl doğrulandığıyla birlikte çekme isteği (gh / GitHub MCP). |
| `/gitflow:changelog [version]` | Etiketler arasındaki taahhütlerden oluşturulan CHANGELOG.md (Değişiklik Günlüğü Tut). |
| `/gitflow:release <version\|auto>` | Taahhütlerden Semver → manifest sürümlerini senkronize et → etiket → GitHub yayın. Yalnızca açıkça onaylandıktan sonra basın. |
| `/gitflow:audit [branch]` | Salt okunur geçmiş denetimi: sözleşme ihlalleri, döküm taahhütleri, büyük lekeler, yetim dallar. |

### 🛡️ güvenlik — güvenlik denetimi (salt okunur)
| Komut | Ne işe yarar |
| --- | --- |
| `/security:vorcl <goal>` | Task Master — denetim → bulgular → görevler → devredilen düzeltmeler yoluyla bir güvenlik hedefi. |
| `/security:secrets [path\|branch]` | Çalışma ağacındaki VE git geçmişindeki sırlar (tüm dallar); `${VAR:-}` yer tutucular sır değildir. |
| `/security:owasp [path]` | OWASP Koddaki ilk 10: enjeksiyonlar, XSS, kimlik doğrulama, veri açığa vurma, CORS/tanımlama bilgileri — dosya:satır kanıtı ile. |
| `/security:deps` | npm denetim / kilit dosyaları aracılığıyla bağımlılık CVE'leri — önem derecesi, değişiklik değişikliği işaretleri. |
| `/security:pii [path]` | PII/GDPR riskleri: e-postalar, telefonlar, kod ve günlüklerdeki kartlar; geliştiricinin özel yolları. |
| `/security:pre-push [branch]` | Aktarmadan önce değiştirilen dosyaların hızlı birleştirilmiş kontrolü: sırlar + enjeksiyonlar + PII; yeşil/kırmızı karar. |

### 📝 dokümanlar — dokümantasyon
| Komut | Ne işe yarar |
| --- | --- |
| `/docs:vorcl <goal>` | Task Master aracılığıyla bir dokümantasyon hedefi. |
| `/docs:readme [path]` | README'yi oluştur/güncelle — ne/hızlı başlangıç/kullanım/yapılandırma/sorun giderme; örnekler doğrulandı; dil sürümleri senkronize edildi. || `/docs:api [spec]` | OpenAPI spesifikasyonundan oluşturulan API belgeler (uç noktalar, parametreler, kıvrılma örnekleri); özellik yoksa `/swagger:audit` önerilir. |
| `/docs:architecture` | ARCHITECTURE.md — modüller, sınırlar, veri akışı; diyagramlar `mermaid`/`drawio`'ye devredildi. |
| `/docs:contributing` | CONTRIBUTING.md — kurulum, yapı, testler, taahhüt kuralları (`gitflow` ile uyumlu), PR süreci. |
| `/docs:release-notes <version>` | CHANGELOG/history'den bir sürüm için sürüm notları. |
| `/docs:audit` | Salt okunur belgeler↔kod kayması kontrolü: bozuk bağlantılar, eski örnekler/sayaçlar, senkronize edilmemiş çeviriler. |

### 🐳 devops — kapsayıcılar ve CI/CD
| Komut | Ne işe yarar |
| --- | --- |
| `/devops:vorcl <goal>` | Task Master aracılığıyla bir altyapı hedefi. |
| `/devops:dockerfile [app-type]` | Bir Docker dosyası yazın/inceleyin — çok aşamalı, ince tabanlı, root olmayan, HEALTHCHECK; gerçek bir `docker build` ile doğrulandı. |
| `/devops:compose` | yerel geliştirici için docker-compose.yml (app + DB'ler); env değişikliklerinin `--force-recreate` olması gerekiyor, sağlıklı olmasını bekliyor. |
| `/devops:ci [type]` | GitHub Eylemler — PR iş akışı (lint+typecheck+test, npm önbellek), dağıtım iş akışı, minimum izinler. |
| `/devops:env` | Ortam değişkeni envanteri: nerede okunduğu, neyin gerekli olduğu, `.env.example` şablonu; sırlar asla görüntülerde değildir. |
| `/devops:monitoring` | Yapılandırılmış günlükler (pino/JSON), sağlık uç noktası, ne konusunda uyarılması gerektiği; Metrikleri `render` aracısı aracılığıyla işleyin. |

### 📡 liveboard — geçici yerel operasyonlar kurulu
| Komut | Ne işe yarar |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Ücretsiz bir localhost bağlantı noktasında 43 dilli gösterişli bir kontrol paneli başlatın; Task Master SSE üzerinden akışı değiştirir ve her 5 dakikada bir mutabakat sağlar. |
| `/liveboard:vorcl <goal>` | Gerekli Task Master iş akışı aracılığıyla liveboard'un kendisini geliştirin veya değiştirin. |

Liveboard, Git çalışma ağaçlarını, yerel Claude/Codex/Cursor işlemlerini ve her çalışma ağacının `.taskmaster/tasks/tasks.json`'sini okur. Çalışma zamanı durumu bellekte kalır ve ön plan işlemi durduğunda kaybolur. UI tarayıcı dilini algılar ve aralarında İngilizce, Rusça, Ukraynaca, Almanca, Fransızca, İspanyolca, Portekizce, İtalyanca, Lehçe, Türkçe, Çince, Japonca, Arapça, Felemenkçe, Çekçe, Slovakça, Rumence, Macarca, Bulgarca, Sırpça, Hırvatça, Slovence, Yunanca, İbranice, Farsça, Hintçe, Bengalce, Urduca, Endonezce, Malayca, Vietnamca, Tayca, Korece, İsveççe, Norveççe, Danca, Fince, Estonyaca, Letonca, Litvanca, Gürcüce, Ermeni ve Azeri. Arapça, İbranice, Farsça ve Urduca RTL düzenini kullanır.

Doğrudan yapılandırma:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: Git çalışma ağaçları ve Task Master dosyaları taranan proje.
- `--port 0`: otomatik olarak boş bir bağlantı noktası seçer.
- `--interval`: milisaniye cinsinden tam mutabakat aralığı; dosya akışı devam ederken Task Master hemen değişir.
- Uç noktalar: `/health`, `/api/snapshot`, `/api/events` (SSE) ve `POST /api/refresh`.
- Proje bilgilerini açıkça ağa ifşa etme niyetinde olmadığınız sürece `--host 127.0.0.1`'yi saklayın.

---

## Yapılandırma (MCP ve tuşlar)

Pakette **uzak arka uç veya veritabanı yok**. İsteğe bağlı liveboard, yalnızca localhost'a yönelik bir bellek içi işlemdir. MCP sunucularının jetonlara ihtiyacı vardır ve **her kullanıcı kendi jetonunu sağlar**. Bunun **Claude Code, Codex, Cursor ve Kimi CLI** üzerinde aynı şekilde çalışmasını sağlamak için ve ister bir terminalden ister Dock / Spotlight / bir IDE'den başlatıyor olun, her stdio MCP sunucusu, anahtarlarınızı **tek dosyadan** okuyan küçük bir başlatıcı (`bin/mcp-env.mjs`) aracılığıyla başlatılır:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Yükleyici bunu [`.env.example`](./.env.example)'den oluşturur. Açın ve yalnızca kullandığınız tuşları girin:

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

> **Neden `~/.zshrc` yerine başlatıcı?** Env-var genişletmesi çalışma zamanına göre farklılık gösterir (`${VAR:-}` Claude'da, `${env:VAR}` Cursor'de, sabit değerler Codex/Kimi'de) ve her çalışma zamanı yalnızca **it**'in başlatıldığı ortamı okur. macOS'ta GUI / IDE başlatılırken `~/.zshrc` kaynaklanmaz, dolayısıyla dışa aktarılan anahtarlar görünmez ve sunucular hiçbir şeye bağlanmaz; klasik "MCP env ayarlanmadı" hatası. Tek bir `.env` dosyasından okumak her iki sorunu da aynı anda ortadan kaldırır.**Öncelik** (sonradan kazanır): proje kökünde paylaşılan `~/.config/agent-vorcl-flow/.env` → bir `./.env` → kabuğunuzda gerçek bir `export`. Genel anahtarları paylaşılan dosyada tutun, proje başına (örneğin farklı bir `MONGODB_URI`) bir proje `.env` ile geçersiz kılın; gerçek bir kabuk aktarımı CLI çalıştırma için yine de kazanır. Başlatıcıyı `AGENT_VORCL_ENV_FILE=/path/.env` tuşuyla farklı bir dosyaya yönlendirebilirsiniz.

Gerekli anahtarı eksik olan bir sunucu **başlamıyor** — çalışma zamanının MCP günlüğünde tek satırlık bir `[agent-vorcl-flow] MCP «…» is not configured: …` görürsünüz ve diğer tüm sunucular çalışmaya devam eder. Anahtarı `.env` öğesine ekleyin ve yeniden başlatın. (`GITHUB_TOKEN`/`MONGODB_URI` adlarını saklayabilirsiniz; başlatıcı bunları sunucuların beklediği `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` adlarıyla eşleştirir.)

> ⚠️ **Yapay zeka destekli Task Master komutları için gereklidir:** seçilen en az bir sağlayıcıyı yapılandırın — Claude için `ANTHROPIC_API_KEY`, GPT için `OPENAI_API_KEY` veya Codex CLI OAuth. `.taskmaster/config.json`'de seçilen modele ilişkin kimlik bilgileri olmadan `/vorcl` görevler oluşturamaz veya genişletemez.

Üretimi gerçekte hangi Task Master sağlayıcının çalıştırdığını seçin; tuşlar tek başına modeli seçmez:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

Komut, resmi `task-master models` akışını kullanır ve yalnızca model seçimini `.taskmaster/config.json`'de saklar. `PERPLEXITY_API_KEY` isteğe bağlıdır ve yalnızca araştırma modeli olarak Şaşkınlık seçildiğinde gereklidir.

Uzak **vercel** ve **render** sunucuları OAuth'u kullanır (tarayıcıda `/mcp` ile yetkilendirme). Headless/CI'de Render için ortamınızda `RENDER_API_KEY` ayarını yapın ve çalışma zamanınız için bu sunucuya bir Taşıyıcı başlık girişi ekleyin.

---

## Yüklemeyi doğrulayın

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

Codex'da "eklenti" bulunmadığından aynı yetenekler **beceriler**, **profiller** ve `AGENTS.md` yönlendirici olarak ifade edilir:

| Claude Code | Codex eşdeğeri |
| --- | --- |
| alt temsilci `@agent-vorcl-flow:frontend` | beceri kişiliği `$frontend` + `codex --profile frontend` |
| komut `/analyzer:audit` | görev becerisi `$analyzer-audit` |
| komut `/vorcl` | görev becerisi `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` içinde `config.toml` |
| `SessionStart` kanca | `AGENTS.md`'de rol yönlendirme |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Tam haritalama için [`codex/README.md`](./codex/README.md)'e bakın.

---

## Cursor

Cursor, Codex bağdaştırıcısıyla aynı açık `SKILL.md` biçiminin yanı sıra yerel özel alt aracıları ve genel MCP yapılandırmasını kullanır:

| Agent-Vorcl-Flow konsepti | Cursor eşdeğeri |
| --- | --- |
| rolü `backend` | özel alt temsilci `/avf-backend` in `~/.cursor/agents` |
| görev komutu `/backend:create-api` | beceri `/backend-create-api` |
| evrensel `/vorcl` | beceri `/vorcl` |
| `.mcp.json` | `~/.cursor/mcp.json`'da birleştirilmiş sunucular |

Yükleyici, rol tanımlarını Cursor ön maddeye dönüştürür, beceri adı çakışmalarını önlemek için alt aracıların önüne `avf-` ekler, `model: inherit` kullanır ve yalnızca denetim aracılarını `readonly: true` olarak işaretler. Aynı adlara sahip mevcut MCP sunucu girişleri korunur. Bkz. [`cursor/README.md`](./cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI), Aracı Becerilerini, özel aracı dosyalarını ve yaşam döngüsü kancalarını yerel olarak yükler; AVF ayrıca Claude ve Cursor tarafından kullanılan aynı MCP sunucuları birleştirir:

| Agent-Vorcl-Flow konsepti | Kimi CLI eşdeğeri |
| --- | --- |
| beceriler / görev komutları | `~/.kimi/skills` ve `/skill:<name>` |
| Expo gümrük acentesi | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse koruması | `~/.kimi/config.toml` ile birleşti |
| `.mcp.json` | `~/.kimi/mcp.json`'deki birleştirilmiş sunucular |
| çalışma zamanı başına anahtar dosyası | paylaşılan `~/.config/agent-vorcl-flow/.env` (başlatıcı aracılığıyla) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI'ın `mcp.json`'de `${VAR}` genişletmesi yoktur, bu nedenle anahtarlar, tıpkı diğer çalışma zamanlarında olduğu gibi, başlatıcı aracılığıyla paylaşılan `.env`'den gelir. Bkz. [`kimi/README.md`](./kimi/README.md).

---

## Proje yapısı

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

**Birbirine nasıl uyuyor:** `agents/*.md` bir rol beyan edin ve en başta `skills:`, becerileri ekleyin → `skills/*/SKILL.md`'deki beceriler açıklamaya göre otomatik olarak yüklenir → `commands/<agent>/*.md` alt aracıya yetki veren hızlı `/agent:command` kısayolları sağlar → `.mcp.json` aracılara, her biri paylaşılan `.env`'den sırları yükleyen `bin/mcp-env.mjs` ile başlayan araçlarını verir. `SessionStart` kancası Claude'ye temsilcilerin uygun olduğunu bildirir.

---

## Lisans

MIT — kullanımı, kopyalanması, değiştirilmesi ve dağıtılması ücretsizdir; "olduğu gibi" sağlanır, hiçbir garanti ve yükümlülük söz konusu değildir. Bkz. [LICENSE](./LICENSE).

© 2026 Christian Avis (Vorcl).
