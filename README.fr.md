<div align="center">

# Agent-Vorcl-Flow

**Une équipe de sous-agents d'IA spécialisés pour [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) et [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — avec des compétences, des commandes et des outils MCP.**
Une commande `npx` les installe. Pas de backend distant ni d'hébergement cloud : votre agent de codage exécute tout localement.

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

[English](./README.md) · [Русский](./README.ru.md) · [Українська](./README.uk.md) · [Deutsch](./README.de.md) · [**Français**](./README.fr.md) · [Español](./README.es.md)<br>
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 01861dcfef6354f49ecb1c6e62f9c5316943aeb8305556e432e273d7117f85e6. -->

</div>

---

## Qu'est-ce que c'est ?

Agent-Vorcl-Flow transforme un agent de codage pris en charge en une **équipe d'ingénierie structurée**. Au lieu d'un assistant général, vous obtenez **22 sous-agents ciblés** (architecte, backend, frontend, ingénieur mobile Expo, ingénieur DB, cartographe d'architecture, opérateur de liveboard, et plus), chacun avec ses propres **compétences** de domaine, des **commandes slash** rapides et les **MCP outils** dont il a besoin. Chaque tâche non triviale s'exécute dans une boucle **Task Master** disciplinée — *objectif → tâches → implémenter → vérifier → terminé* — afin que le travail soit planifié, suivi et survit aux interruptions.

- 🧩 **22 sous-agents**, 44 compétences, 135 commandes slash
- ⚡ **Installation en une seule commande** pour Claude Code, Codex, Cursor et/ou Kimi CLI — `npx`
- 🔌 **11 MCP serveurs** connectés (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, système de fichiers, Task Master, Mermaid)
- 🔑 **Un fichier `.env` pour tous les environnements d'exécution** — clés lues par un lanceur, pas `~/.zshrc`, donc elles fonctionnent même à partir des lancements GUI/IDE ; pas de service AVF à distance ; le liveboard est réservé à l'hôte local et est éphémère
- 🤝 **Fonctionne sur Claude Code, GPT Codex, Cursor et Kimi CLI** à partir de la même source

---

## Démarrage rapide

### Exigences
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** et/ou **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Installer (une commande)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Ciblez un seul runtime avec un indicateur :

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Ce que fait l'installateur :

| Durée d'exécution | Actions |
| --- | --- |
| **Couche partagée** | Copie le lanceur sur `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` et crée `~/.config/agent-vorcl-flow/.env` à partir du modèle (une fois) — le fichier de clé unique pour chaque exécution. |
| **Claude Code** | Enregistre ce dépôt en tant que plugin **marketplace** et active le plugin (via `claude plugin …`, avec une solution de secours directe `~/.claude/settings.json`). |
| **GPT Codex** | Fusionne les compétences en `~/.agents/skills` et les blocs `config.toml` + `AGENTS.md` en `~/.codex` (idempotent, entre marqueurs). |
| **Cursor** | Installe les compétences dans `~/.cursor/skills`, les sous-agents personnalisés natifs dans `~/.cursor/agents` et fusionne les serveurs manquants dans `~/.cursor/mcp.json`. |
| **Kimi CLI** | Installe les compétences dans `~/.kimi/skills`, l'agent personnalisé natif Expo dans `~/.kimi/agents`, les deux architectures Expo/UI se connectent à `~/.kimi/config.toml` et fusionne les serveurs MCP. |

> L'installateur ne remplit jamais vos secrets — il crée uniquement un `.env` vide à partir du modèle. Vous y ajoutez des clés (voir [Configuration](#configuration-mcp--touches)).

### Mise à jour vers la dernière version

Exécutez à nouveau le programme d'installation avec la balise npm `latest` :

```bash
npx --yes agent-vorcl-flow@latest
```

Pour mettre à jour un seul environnement d'exécution, conservez le même indicateur d'exécution que vous avez utilisé lors de l'installation :

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

La mise à jour superpose les compétences, les agents, les hooks, le lanceur et les blocs de configuration gérés par Agent-Vorcl-Flow. Il maintient votre `~/.config/agent-vorcl-flow/.env` existant et ses secrets inchangés, et préserve les compétences Firecrawl en amont. Redémarrez ensuite le client de codage mis à jour (ou exécutez `/reload-plugins` dans Claude Code).

### Installations alternatives (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Après l'installation, **redémarrez Claude Code** (ou exécutez `/reload-plugins` dans une session ouverte) pour charger les agents.

---

## Comment utiliser

Les exemples de cette section utilisent la syntaxe Claude Code ; voir les mappages [Cursor](#cursor) et [GPT Codex](#gpt-codex) ci-dessous pour leur syntaxe native. Dans Claude Code, il existe **trois façons** d'invoquer l'équipe.

### 1. Point d'entrée universel : il suffit d'énoncer un objectif
```text
/vorcl add a shopping cart to checkout
/audit .
```
`/vorcl` détermine quel sous-agent doit être propriétaire du travail et pilote le cycle Task Master complet. `/audit` détecte automatiquement le backend, le frontend, le mobile, les données et l'infrastructure et rédige un `PROJECT_AUDIT.md` basé sur des preuves en utilisant tous les rôles pertinents.

### 2. Parlez à un sous-agent spécifique
```text
@agent-vorcl-flow:architect  design billing for a SaaS
@agent-vorcl-flow:backend    add a POST /invoices endpoint
```

### 3. Exécutez une commande slash spécifique
```text
/backend:create-api   POST /invoices
/analyzer:audit       src/
/screenshot:convert   ./mockups/dashboard.png  react
```

Chaque agent possède également son propre point d'entrée `/<agent>:vorcl` qui exécute la boucle Task Master limitée à cet agent.

### La boucle Task Master
Chaque tâche non triviale passe par **Task Master** (`task-master-ai`) :

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```

Cela permet de planifier le travail, de le vérifier et de le reprendre : rien n'est déclaré « terminé » sans passer l'étape de vérification.

---

## Les agents| Agent | Rôle | Faits saillants |
| --- | --- | --- |
| 🔵 **architecte** | Architecte systèmes et solutions | Analyse des besoins, conception système/DB/API, revues d'architecture |
| 🟢 **back-end** | Développeur back-end | Nœud/TS, Postgres, Redis ; architecture modulaire ; chaque itinéraire entièrement couvert par OpenAPI |
| 🟣 **interface** | Frontend (React 19 / Next.js Routeur d'application) | Composants, état, récupération de données, optimisation du rendu/bundle, tests |
| 📱 **expo-mobile** | React Native + Expo ingénieur | Architecture modulaire plus système de conception/mouvement/interaction, navigation native, jetons, gestes, haptique, mouvement réduit |
| 🟠 **analyseur** | Auditeur de code (lecture seule) | Bugs, sécurité des types, structure DB, simulations du frontend, odeurs du backend |
| 🟡 **fanfaron** | Couverture OpenAPI/Swagger (n'importe quelle pile) | Trouve les itinéraires pas entièrement documentés et les parcourt, avec vérification |
| 🔴 **crawl** | Chercheur Web | Live CLI/MCP/REST, intégration d'applications et flux de travail de données Web terminés |
| 🟤 **rendu** | Hébergement et déploiement (Rendu) | Déploiements, diagnostics basés sur les journaux, métriques, variables d'environnement, rendu Postgres |
| 🟦 **base de données** | DB ingénieur / DBA | Schéma, requêtes & plans, index, N+1, migrations réversibles sécurisées, cache |
| ⚪ **résilience** | Fiabilité : erreurs + journalisation | try/catch aux bonnes limites, erreurs de frappe, tentatives/timeouts, journaux structurés |
| 🖼️ **capture d'écran** | Capture d'écran UI → code | Transforme une capture d'écran UI en un code prêt pour la production, réactif et accessible |
| 🔎 **recherche visuelle** | Capture d'écran → réponse vérifiée | Identifie le site/la page, trouve des documents officiels, vérifie les données en direct et les réponses avec des URL et en toute confiance |
| 🎯 **identifier** | Capture d'écran → placer dans un projet existant (lecture seule) | Fonde une capture d'écran de l'application en cours d'exécution dans la base de code réelle : composant, `file:line`, route/page, le contrôle exact et la logique derrière celui-ci ; ne crée rien, délègue le montage |
| 📊 **dessin** | Diagrammes (draw.io / diagrammes.net) | Organigramme, BPMN, UML, ERD, réseau/cloud et PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **archmap** | Cartographe d'architecture | Code déterministe → `architecture.json` (chaque nœud avec `source:{file,line}`) → carte interactive HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF ; les faits non prouvés sont marqués `inferred` |
| 🧜 **sirène** | Mermaid diagrammes (+ rendu réel) | organigramme, séquence, classe, état, ER, gantt, gitGraph, mindmap… ; validé via mcp-sirène/`mmdc` ; vous remet le fichier (`.mmd` + SVG/PNG/PDF) |
| 🧪 **tests** | Ingénieur tests et vérification | Unité (Vitest/Jest), intégration (Supertest), E2E (Playwright), couverture, recherche de tests floconneux ; exécute le `testStrategy` de chaque tâche — rien n'est "fait" sans une exécution verte |
| 🌿 **gitflow** | Git flux de travail et versions | Commits conventionnels, commits par nom (jamais `git add .`), PR, Keep-a-Changelog, versions semver ; pousser uniquement avec confirmation explicite |
| 🛡️ **sécurité** | Auditeur de sécurité (lecture seule) | Secrets dans l'historique de l'arborescence et de Git, OWASP Top 10, CVE de dépendances, PII ; les résultats deviennent des tâches — les correctifs sont délégués |
| 📝 **documents** | Ingénieur documentation | README (parité multilingue), API docs de OpenAPI, ARCHITECTURE, CONTRIBUTING, notes de version ; chaque exemple vérifié par rapport au code |
| 🐳 **dévops** | Conteneurs & CI/CD | Dockerfiles multi-étapes, docker-compose pour le développement local, GitHub Pipelines d'actions, hygiène env/secrets, surveillance |
| 📡 **tableau en direct** | Conseil des opérations locales | Arbres de travail Git en direct, processus d'agent et tâches Task Master sur un tableau de bord localhost éphémère |**Quelques choses à savoir :**
- **Le frontend parle toujours à un vrai API.** La spécification OpenAPI du backend est l'unique source de vérité ; des types en sont générés (`openapi-typescript` + `openapi-fetch`). Pas de moqueries dans le parcours de production.
- **`database` les mutations nécessitent une confirmation explicite.** Les analyses sont en lecture seule ; Les modifications de schéma/données (DDL/DML/migrations) ne s'exécutent jamais sans votre accord.
- **`resilience` est livré avec un crochet de sécurité.** Un crochet `PostToolUse` non bloquant (`catch-guard.js`) signale doucement les blocs `catch {}` vides dans les fichiers que vous venez de modifier.
- **`archmap` ne sort jamais de l'imagination.** L'extraction et le rendu sont strictement séparés : des scripts sans dépendance parcourent le dépôt dans `architecture.json` (bases de données avec une véritable cardinalité FK, routes API, agents IA avec leurs modèles/outils/mémoire, graphe d'importation, env), et chaque diagramme est rendu à partir de ce JSON uniquement. Tout ce que le LLM ajoute sans un `file:line` vérifiable est marqué de force `inferred:true` et dessiné en pointillés.
- **`pinpoint` trouve, ne crée jamais.** À partir d'une capture d'écran d'une application en cours d'exécution, il mappe l'écran sur le code réel (le composant, l'itinéraire, le contrôle exact et la logique derrière celui-ci) et confie la modification à `frontend`/`backend`. Cela fonctionne sur ce qui existe déjà (l'inverse de `screenshot`).
- **`visual-research` vérifie au lieu de deviner.** Il traite une capture d'écran comme une preuve, confirme le domaine et la documentation officiels, vérifie les données actuelles du site et signale les éventuelles valeurs de phishing ou obsolètes.
- **`i18n` applique le « codage en dur sans langue ».** Les agents détectent d'abord si un projet est multilingue et s'adaptent : les chaînes destinées à l'utilisateur passent par une couche de traduction (next-intl/react-i18next/i18next), jamais en ligne.

---

## Référence de commande

Chaque commande ci-dessous est une commande slash. `<…>` marque votre saisie.

### `/vorcl` — routeur universel
| Commande | Ce qu'il fait |
| --- | --- |
| `/vorcl <goal>` | Transforme n'importe quel objectif en tâches et l'achemine vers le bon sous-agent, puis exécute le cycle complet. |
| `/audit [path] [focus]` | Audit multi-rôle approfondi en lecture seule → systèmes détectés, résultats de sécurité/CVE/résilience, architecture cible et `PROJECT_AUDIT.md` par étapes. |

### 🔵 architecte — architecture
| Commande | Ce qu'il fait |
| --- | --- |
| `/architect:vorcl <goal>` | Objectif → tâches → cycle, limité à l'architecture. |
| `/architect:analyze <context>` | Analyser les exigences et le contexte de la tâche. |
| `/architect:design <problem>` | Concevoir l'architecture de la solution (système, DB, API). |
| `/architect:review <target>` | Examinez une architecture existante. |

### 🟢 backend — serveur (Node/TS, Postgres, Redis)
| Commande | Ce qu'il fait |
| --- | --- |
| `/backend:vorcl <goal>` | Objectif → tâches → cycle pour le travail backend. |
| `/backend:create-api <endpoint>` | Générez un point de terminaison API sur l'architecture modulaire, entièrement couvert par OpenAPI. |
| `/backend:refactor <target>` | Refactorisez le code sans changer le comportement. |
| `/backend:optimize <target>` | Optimisation des performances. |
| `/backend:test <target>` | Générez des tests pour le code. |

### 🟣 interface — React / Next.js
| Commande | Ce qu'il fait |
| --- | --- |
| `/frontend:vorcl <goal>` | Objectif → tâches → cycle pour le travail frontend. |
| `/frontend:create-component <spec>` | Générez un composant UI suivant la structure des fonctionnalités. |
| `/frontend:refactor <target>` | Refactorisez UI / hooks sans changer de comportement. |
| `/frontend:optimize <target>` | Optimiser le rendu/bundle/Core Web Vitals. |
| `/frontend:test <target>` | Générez des tests de composants. |

### 📱 expo-mobile — React Native / Expo| Commande | Ce qu'il fait |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Objectif → Task Master cycle pour Expo travail mobile. |
| `/expo-mobile:create-module <domain>` | Créez une tranche métier modulaire avec uniquement les couches dont sa complexité a besoin. |
| `/expo-mobile:create-screen <flow>` | Créez un itinéraire Expo Router fin ainsi qu'un écran et des états appartenant au module. |
| `/expo-mobile:design-screen <flow>` | Créez un écran premium avec des jetons de conception/de mouvement, des états et une accessibilité partagés. |
| `/expo-mobile:motion <interaction>` | Concevez une navigation native, des ressorts, des gestes, des haptiques et des replis à mouvement réduit. |
| 🟠 | Ajoutez des clés de schéma/DTO/mapper/requête et une intégration TanStack Query. |
| `/expo-mobile:audit [scope]` | Protection de l'architecture en lecture seule et audit basé sur des preuves. |
| `/expo-mobile:ui-audit [scope]` | Système de conception en lecture seule, mouvement, interaction, accessibilité et audit de performance. |
| `/expo-mobile:compatibility [app] [change]` | Audit de compatibilité Expo/RN/Node/package/native-runtime en lecture seule en direct par rapport aux sources officielles versionnées. |
| `/expo-mobile:test <scope>` | Exécutez l'unité de domaine, la bibliothèque de tests React Native et les vérifications Maestro. |

### 🟠 analyseur — audit de code (lecture seule)
| Commande | Ce qu'il fait |
| --- | --- |
| `/analyzer:vorcl <goal>` | Auditez un objectif via Task Master — les résultats deviennent des tâches. |
| `/analyzer:audit` | Audit complet : bugs, types, DB, simulations du frontend, odeurs du backend. |
| `/analyzer:bugs` | Chassez les bogues – erreurs non gérées, conditions de concurrence, cas extrêmes. |
| `/analyzer:types` | Vérification de type — `tsc`, `any`, lancers dangereux, dérive des zod↔types. |
| `/analyzer:db` | Audit DB structure — schéma, index, FK, N+1, migrations. |
| `/analyzer:mocks` | Recherchez des maquettes/fausses données sur le frontend. |
| `/analyzer:backend` | Recherchez le « mauvais » code backend – violations d’architecture, logique dans les contrôleurs. |

### 🟡 swagger — couverture OpenAPI/Swagger (n'importe quelle pile)
| Commande | Ce qu'il fait |
| --- | --- |
| `/swagger:vorcl <goal>` | Objectif de couverture complète via Task Master — audit → tâches → couverture → vérifier. |
| `/swagger:audit` | Lecture seule : recherchez les itinéraires qui ne sont pas entièrement couverts par la spécification. |
| `/swagger:cover <route>` | Couvrir un itinéraire/module — paramètres, réponses, descriptions, sécurité + vérification. |

### 🔴 firecrawl — recherche sur le Web
| Commande | Ce qu'il fait |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Objectif de recherche via Task Master : collecter des données Web pour obtenir un résultat final. |
| `/firecrawl:search <query>` | Recherche sur le Web de sources sur une question. |
| `/firecrawl:scrape <url>` | Grattez une URL dans markdown/JSON. |
| `/firecrawl:map <url>` | Mappez les URL d'un site. |
| `/firecrawl:crawl <url>` | Explorez de manière récursive une section/un site. |
| `/firecrawl:extract <url>` | Extraction structurée par un schéma JSON. |
| `/firecrawl:setup` | Installez/vérifiez CLI ainsi que les compétences officielles en matière de construction et de flux de travail (avec confirmation). |
| `/firecrawl:interact <url>` | Cliquez, naviguez ou remplissez des formulaires lorsque le scraping est insuffisant. |
| `/firecrawl:parse <file>` | Analysez un document local/privé en markdown ou JSON. |
| `/firecrawl:monitor <action>` | Répertoriez les vérifications ou gérez les moniteurs de changements de page récurrents. |
| `/firecrawl:agent <goal>` | Exécutez une tâche Firecrawl Agent limitée de longue durée. |
| `/firecrawl:research <query>` | Recherche d'articles et GitHub contexte de recherche. |
| `/firecrawl:ask <jobId>` | Diagnostiquer une tâche ayant échoué. |
| `/firecrawl:docs-search <question>` | Recherchez la documentation officielle actuelle. |
| `/firecrawl:integrate <feature>` | Ajoutez Firecrawl au code de l'application via les compétences de construction en amont. |
| `/firecrawl:deliverable <artifact>` | Produisez un brief, un audit, une liste de prospects ou tout autre artefact de flux de travail. |`/firecrawl:setup` n'exécute le flux officiel `firecrawl-cli init --all` qu'après confirmation. Les compétences officielles `firecrawl-*` existantes sont prioritaires et sont préservées par l'installateur Codex/Cursor ; AVF fournit des solutions de secours compatibles pour les compétences manquantes. Les opérations en direct passent par CLI → MCP → REST/sans clé.

### 🟤 render — hébergement/déploiement (Render)
| Commande | Ce qu'il fait |
| --- | --- |
| `/render:vorcl <goal>` | Objectif infra via Task Master — déployer/diagnostiquer/configurer pour terminer. |
| `/render:deploy <service>` | Déployer/redéployer un service. |
| `/render:logs <service>` | Journaux de service et diagnostics jusqu'à la cause première. |
| `/render:status <service>` | Statut du service + déploiement + métriques. |
| `/render:query <sql>` | SQL en lecture seule contre Render Postgres. |

### 🟦 base de données — DB ingénieur / DBA (Postgres / MongoDB / Redis)
| Commande | Ce qu'il fait |
| --- | --- |
| `/database:vorcl <goal>` | Objectif de données via Task Master — schéma/requêtes/migrations/cache à effectuer. |
| `/database:query <query>` | Requête/analyse en lecture seule. |
| `/database:schema <target>` | Concevoir/réviser le schéma et l’intégrité des données. |
| `/database:migrate <change>` | Planifiez une migration de schéma/données sûre et réversible. |
| `/database:optimize <target>` | Optimiser — index, N+1, plans de requête, pagination. |
| `/database:cache <target>` | Redis — TTL, invalidation, verrouillages, limitation de débit, Streams. |

### ⚪ résilience — gestion des erreurs + journalisation
| Commande | Ce qu'il fait |
| --- | --- |
| `/resilience:vorcl <goal>` | Objectif de fiabilité via Task Master — couvrir le code avec try/catch + logs. |
| `/resilience:harden <target>` | Enveloppez le code dans try/catch/finally avec une journalisation solide, pas d'échecs silencieux. |
| `/resilience:logging <target>` | Ajouter/corriger la journalisation structurée — niveaux, contexte, pas de secrets/PII. |
| `/resilience:audit` | Lecture seule : recherchez les échecs silencieux, les captures vides, les lacunes de journalisation. |

### 🖼️ capture d'écran — capture d'écran UI → code
| Commande | Ce qu'il fait |
| --- | --- |
| `/screenshot:vorcl <goal>` | Un ensemble d'écrans à partir de captures d'écran via Task Master — panne → code. |
| `/screenshot:analyze <image>` | Répartition en lecture seule — disposition, composants, jetons, états → plan. |
| `/screenshot:convert <image> [framework]` | Générez du code exécutable complet à partir d'une capture d'écran (par défaut React + Tailwind v4). |
| `/screenshot:tokens <image>` | Extrayez les jetons de conception (couleurs OKLCH, typographie, espacement) dans Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Rendre le UI généré réactif : points d'arrêt, fluides, `clamp()`, requêtes de conteneur. |

### 🔎 recherche visuelle — capture d'écran → réponse Web vérifiée
| Commande | Ce qu'il fait |
| --- | --- |
| `/visual-research:vorcl <goal>` | Recherche de capture d'écran en plusieurs étapes via Task Master. |
| `/visual-research:identify <image>` | Identifiez le site, la page et la fonctionnalité avec des preuves de confiance. |
| `/visual-research:search <image> <target>` | Trouvez la vraie page ou la documentation officielle à partir d'indices visuels. |
| `/visual-research:answer <image> <question>` | Répondez à l’aide de captures d’écran, de documents officiels et de données en direct actuelles. |
| `/visual-research:hints <image> <goal>` | Proposez des étapes sécurisées et documentées pour l’interface visible. |

### 🎯 localiser — capture d'écran → placer dans un projet existant (lecture seule)
| Commande | Ce qu'il fait |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Rechercher/comprendre/modifier les UI existants à partir d'une capture d'écran via Task Master — carte → tâches → délégué. |
| `/pinpoint:locate <image>` | Localisez le(s) composant(s) existant(s) à partir d'une capture d'écran — `file:line`, pas de nouveau code. |
| `/pinpoint:route <image>` | Identifiez l'itinéraire/la page sur laquelle se trouve l'écran (Next.js Routeur d'applications/pages, React Routeur). |
| `/pinpoint:control <image>` | Identifiez le contrôle exact (bouton/champ) et son gestionnaire dans le code. |
| `/pinpoint:trace <target>` | Tracez la logique derrière un élément - gestionnaire → état → récupération de données → API. |
| `/pinpoint:handoff <change>` | Créez une demande de modification précise par rapport au code existant et déléguez-la à `frontend`/`backend`. |

### 📊 drawio — diagrammes (draw.io / diagrammes.net)
| Commande | Ce qu'il fait |
| --- | --- |
| `/drawio:vorcl <goal>` | Un ensemble de diagrammes via Task Master — build to done. |
| `/drawio:create <description> [type]` | Construisez un diagramme à partir d’une description textuelle (XML natif valide). |
| `/drawio:pmp <type> <project>` | Créez un diagramme PMP/PMBOK — WBS, PERT/CPM, Gantt, RACI, matrice des risques, grille des parties prenantes. |
| `/drawio:convert <source> [type]` | Convertir une source en diagramme — DB schéma → ERD, dossiers → arborescence, code → UML, sirène/CSV/JSON. |
| `/drawio:refine <file>` | Affiner un `.drawio` existant — mise en page, thème, ajouter/supprimer des nœuds, aligner sur la grille. |

### 🗺️ archmap — carte d'architecture à partir du code| Commande | Ce qu'il fait |
| --- | --- |
| `/archmap:vorcl <goal>` | Un objectif de cartographie via Task Master – construire un ensemble d'artefacts vérifié. |
| `/archmap:map [repo]` | Pipeline complet : extraction → `architecture.json` → annotation LLM → tous formats (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Extraction uniquement — `architecture.json` lisible par machine avec `source:{file,line}` sur chaque nœud. |
| `/archmap:annotate [json]` | Enrichissement LLM d'un `architecture.json` existant (mémoire agent, sémantique des flux de données) ; faits non prouvés automatiquement rétrogradés à `inferred`. |
| `/archmap:html [json]` | Carte HTML autonome interactive — basculement de calque, faisceaux de traçage, nœud → panneau `file:line`, recherche, impression CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (multi-pages : Présentation / ERD / API / Agents) et/ou Mermaid vues, validées. |

### 🧜 sirène — Mermaid diagrammes (+ rendu réel)
| Commande | Ce qu'il fait |
| --- | --- |
| `/mermaid:vorcl <goal>` | Un ensemble de diagrammes via Task Master — build to done (rendu vérifié). |
| `/mermaid:create <description> [type]` | Construisez un diagramme à partir d'une description - syntaxe valide, vérifiée par un rendu réel ; vous remet le dossier. |
| `/mermaid:convert <source> [type]` | Convertir une source en Mermaid — DB schéma → ER, code → classe/séquence, dossiers → organigramme, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Syntaxe + test de rendu réel ; trouver et corriger les erreurs (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Exporter vers SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Affiner un `.mmd` existant — direction, sous-graphe, classDef/styles, lisibilité. |

### 🧪 tests — tests et vérification
| Commande | Ce qu'il fait |
| --- | --- |
| `/testing:vorcl <goal>` | Un objectif de test/vérification via Task Master — unité + intégration + e2e à faire. |
| `/testing:unit <file\|module>` | Tests unitaires (Vitest/Jest) — chemin heureux, limites, erreurs ; les exécute et affiche le résultat. |
| `/testing:integration <endpoint\|module>` | Tests d'intégration (Supertest/inject, real DB ou testcontainers). |
| `/testing:e2e <scenario>` | Playwright E2E pour un chemin utilisateur critique — sélecteurs de rôles, appareils, trace en cas de panne. |
| `/testing:verify <task\|testStrategy>` | Exécute le `testStrategy` d'une tâche et renvoie un verdict PRÊT / NON PRÊT avec une sortie réelle. |
| `/testing:coverage [path]` | Rapport de couverture avec les résultats : quel code critique n'a pas été testé ; crée des tâches. |
| `/testing:flaky <test>` | Diagnostique un test instable (course, timing, état partagé, simulations) et le corrige définitivement. |

### 🌿 gitflow — workflow et versions git
| Commande | Ce qu'il fait |
| --- | --- |
| `/gitflow:vorcl <goal>` | Un objectif git/release via Task Master (préparer une version, nettoyer l'historique, branche de fonctionnalité). |
| `/gitflow:commit <files\|scope>` | Un commit par nom (jamais `git add .`) avec un message Conventional Commits ; s'arrête sur un WIP inconnu. |
| `/gitflow:pr <base> <title>` | Branche → commits → pull request (gh / GitHub MCP) avec quoi/pourquoi/comment-vérifié. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Conserver un journal des modifications) généré à partir des validations entre les balises. |
| `/gitflow:release <version\|auto>` | Semer les commits → synchroniser les versions du manifeste → balise → GitHub release. Appuyez uniquement après confirmation explicite. |
| `/gitflow:audit [branch]` | Audit de l'historique en lecture seule : violations de conventions, commits de vidage, gros blobs, branches orphelines. |

### 🛡️ sécurité — audit de sécurité (lecture seule)
| Commande | Ce qu'il fait |
| --- | --- |
| `/security:vorcl <goal>` | Un objectif de sécurité via Task Master — audit → résultats → tâches → correctifs délégués. |
| `/security:secrets [path\|branch]` | Secrets dans l'arborescence de travail ET l'historique git (toutes les branches) ; `${VAR:-}` les espaces réservés ne sont pas des secrets. |
| `/security:owasp [path]` | OWASP Top 10 dans le code : injections, XSS, authentification, exposition des données, CORS/cookies — avec preuve file:line. |
| `/security:deps` | CVE de dépendance via npm audit / lockfiles — gravité, indicateurs de changement avec rupture. |
| `/security:pii [path]` | Risques PII/RGPD : e-mails, téléphones, cartes en code et journaux ; chemins privés du développeur. |
| `/security:pre-push [branch]` | Vérification combinée rapide des fichiers modifiés avant un push : secrets + injections + PII ; verdict vert/rouge. |

### 📝docs — documentation
| Commande | Ce qu'il fait |
| --- | --- |
| `/docs:vorcl <goal>` | Un objectif de documentation via Task Master. |
| `/docs:readme [path]` | Créer/mettre à jour le fichier README — quoi/quickstart/usage/config/troubleshooting ; exemples vérifiés; versions linguistiques synchronisées. || `/docs:api [spec]` | API documents générés à partir de la spécification OpenAPI (points de terminaison, paramètres, exemples curl) ; suggère `/swagger:audit` si aucune spécification. |
| `/docs:architecture` | ARCHITECTURE.md — modules, limites, flux de données ; schémas délégués à `mermaid`/`drawio`. |
| `/docs:contributing` | CONTRIBUTING.md — configuration, structure, tests, conventions de validation (alignées sur `gitflow`), processus PR. |
| `/docs:release-notes <version>` | Notes de version pour une version de CHANGELOG/historique. |
| `/docs:audit` | Documents en lecture seule↔vérification de dérive de code : liens rompus, exemples/compteurs obsolètes, traductions non synchronisées. |

### 🐳 devops — conteneurs & CI/CD
| Commande | Ce qu'il fait |
| --- | --- |
| `/devops:vorcl <goal>` | Un objectif d'infrastructure via Task Master. |
| `/devops:dockerfile [app-type]` | Écrire/réviser un Dockerfile — multi-étapes, base mince, non root, HEALTHCHECK ; vérifié par un réel `docker build`. |
| `/devops:compose` | docker-compose.yml pour le développement local (application + bases de données) ; les changements d'environnement ont besoin de `--force-recreate`, attend la santé. |
| `/devops:ci [type]` | GitHub Actions — Workflow PR (lint+typecheck+test, npm cache), workflow de déploiement, autorisations minimales. |
| `/devops:env` | Inventaire des variables d'environnement : où lire, ce qui est requis, `.env.example` modèle ; secrets jamais en images. |
| `/devops:monitoring` | Journaux structurés (pino/JSON), point final de santé, sur quoi alerter ; Rendre les métriques via l'agent `render`. |

### 📡 liveboard — tableau des opérations locales éphémère
| Commande | Ce qu'il fait |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Démarrez un tableau de bord raffiné en 43 langues sur un port localhost gratuit ; Task Master change de flux via SSE et réconcilie toutes les 5 minutes. |
| `/liveboard:vorcl <goal>` | Développez ou modifiez le liveboard lui-même via le flux de travail Task Master requis. |

Liveboard lit les arbres de travail Git, les processus locaux Claude/Codex/Cursor et le `.taskmaster/tasks/tasks.json` de chaque arbre de travail. L'état d'exécution reste en mémoire et disparaît lorsque le processus de premier plan s'arrête. Le UI détecte la langue du navigateur et propose 43 paramètres régionaux, dont anglais, russe, ukrainien, allemand, français, espagnol, portugais, italien, polonais, turc, chinois, japonais, arabe, néerlandais, tchèque, slovaque, roumain, hongrois, bulgare, serbe, croate, slovène, grec, hébreu, persan, hindi, bengali, ourdou, indonésien, malais, vietnamien, thaï, coréen, suédois, norvégien, danois, finnois, estonien, letton, lituanien, géorgien, arménien et Azerbaïdjanais. L'arabe, l'hébreu, le persan et l'ourdou utilisent la mise en page RTL.

Configuration directe :

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root` : projet dont les Git worktrees et Task Master fichiers sont analysés.
- `--port 0` : sélectionne automatiquement un port libre.
- `--interval` : intervalle de réconciliation complet en millisecondes ; le fichier à regarder continue de diffuser Task Master change immédiatement.
- Points finaux : `/health`, `/api/snapshot`, `/api/events` (SSE), et `POST /api/refresh`.
- Conservez `--host 127.0.0.1` sauf si vous avez explicitement l'intention d'exposer les informations du projet au réseau.

---

## Configuration (MCP & touches)

Le package n'a **pas de backend ou de base de données distant**. Le liveboard facultatif est un processus en mémoire réservé à l'hôte local. Les serveurs MCP ont besoin de jetons et **chaque utilisateur fournit le sien**. Pour que cela fonctionne de manière identique sur **Claude Code, Codex, Cursor et Kimi CLI** — et que vous le lanciez depuis un terminal ou depuis Dock / Spotlight / un IDE — chaque serveur stdio MCP est démarré via un petit lanceur (`bin/mcp-env.mjs`) qui lit vos clés à partir d'**un fichier** :

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Le programme d'installation le crée à partir de [`.env.example`](./.env.example). Ouvrez-le et remplissez uniquement les clés que vous utilisez :

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

> **Pourquoi un lanceur au lieu de `~/.zshrc` ?** L'extension Env-var diffère selon le runtime (`${VAR:-}` en Claude, `${env:VAR}` en Cursor, littéraux en Codex/Kimi) et chaque runtime lit uniquement l'environnement **dans lequel** il a été lancé. Les lancements GUI/IDE sur macOS ne sourcent pas `~/.zshrc`, donc les clés exportées sont invisibles et les serveurs ne se connectent à rien — le classique "MCP env not set" échec. La lecture à partir d'un fichier `.env` supprime les deux problèmes à la fois.**Précédence** (gagne plus tard) : le `~/.config/agent-vorcl-flow/.env` partagé → un `./.env` dans la racine du projet → un vrai `export` dans votre shell. Conservez les clés globales dans le fichier partagé, remplacez par projet (par exemple un `MONGODB_URI` différent) par un projet `.env`, et une véritable exportation shell gagne toujours pour les exécutions CLI. Vous pouvez pointer le lanceur vers un autre fichier avec `AGENT_VORCL_ENV_FILE=/path/.env`.

Un serveur dont la clé requise est manquante **ne démarre tout simplement pas** — vous verrez une ligne `[agent-vorcl-flow] MCP «…» is not configured: …` dans le journal MCP du runtime, et tous les autres serveurs continuent de fonctionner. Ajoutez la clé à `.env` et redémarrez. (Vous pouvez conserver les noms `GITHUB_TOKEN`/`MONGODB_URI` — le lanceur les mappe aux `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` attendus par les serveurs.)

> ⚠️ **Requis pour les commandes Task Master basées sur l'IA :** configurez au moins un fournisseur sélectionné — `ANTHROPIC_API_KEY` pour Claude, `OPENAI_API_KEY` pour GPT ou Codex CLI OAuth. Sans informations d'identification pour le modèle sélectionné dans `.taskmaster/config.json`, `/vorcl` ne peut pas générer ou développer de tâches.

Choisissez quel fournisseur Task Master exécute réellement la génération ; les touches seules ne sélectionnent pas le modèle :

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

La commande utilise le flux `task-master models` officiel et stocke uniquement la sélection de modèle dans `.taskmaster/config.json`. `PERPLEXITY_API_KEY` est facultatif et nécessaire uniquement lorsque Perplexité est sélectionné comme modèle de recherche.

Les serveurs **vercel** et **render** distants utilisent OAuth (autorisez avec `/mcp` dans un navigateur). Pour Render in headless/CI, définissez `RENDER_API_KEY` dans votre environnement et ajoutez une entrée d'en-tête Bearer à ce serveur pour votre exécution.

---

## Vérifiez l'installation

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

Codex n'a pas de « plugins », donc les mêmes capacités sont exprimées sous forme de **compétences**, de **profils** et d'un routeur `AGENTS.md` :

| Claude Code | Codex équivalent |
| --- | --- |
| sous-agent `@agent-vorcl-flow:frontend` | personnage de compétence `$frontend` + `codex --profile frontend` |
| commande `/analyzer:audit` | compétence de tâche `$analyzer-audit` |
| commande `/vorcl` | compétence de tâche `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` dans `config.toml` |
| `SessionStart` crochet | routage des rôles dans `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Voir [`codex/README.md`](./codex/README.md) pour le mappage complet.

---

## Cursor

Cursor utilise le même format ouvert `SKILL.md` que l'adaptateur Codex, plus des sous-agents personnalisés natifs et une configuration MCP globale :

| Agent-Vorcl-Flowconcept | Cursor équivalent |
| --- | --- |
| rôle `backend` | sous-agent personnalisé `/avf-backend` dans `~/.cursor/agents` |
| commande de tâche `/backend:create-api` | compétence `/backend-create-api` |
| universel `/vorcl` | compétence `/vorcl` |
| `.mcp.json` | serveurs fusionnés dans `~/.cursor/mcp.json` |

Le programme d'installation convertit les définitions de rôle en frontmatter Cursor, préfixe les sous-agents avec `avf-` pour éviter les collisions de noms de compétences, utilise `model: inherit` et marque les agents d'audit uniquement comme `readonly: true`. Les entrées de serveur MCP existantes portant les mêmes noms sont conservées. Voir [`cursor/README.md`](./cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) charge nativement les compétences d'agent, les fichiers d'agent personnalisés et les hooks de cycle de vie ; AVF fusionne également les mêmes serveurs MCP utilisés par Claude et Cursor :

| Agent-Vorcl-Flowconcept | Kimi CLI équivalent |
| --- | --- |
| compétences / commandes de tâches | `~/.kimi/skills` et `/skill:<name>` |
| Expo agent en douane | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUtiliser la garde | fusionné avec `~/.kimi/config.toml` |
| `.mcp.json` | serveurs fusionnés dans `~/.kimi/mcp.json` |
| fichier de clé par exécution | le `~/.config/agent-vorcl-flow/.env` partagé (via le launcher) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI n'a pas d'extension `${VAR}` dans `mcp.json`, donc les clés proviennent du `.env` partagé via le lanceur — exactement comme les autres environnements d'exécution. Voir [`kimi/README.md`](./kimi/README.md).

---

## Structure du projet

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

**Comment cela s'articule :** `agents/*.md` déclarez un rôle et, en premier lieu `skills:`, attachez des compétences → les compétences dans `skills/*/SKILL.md` sont chargées automatiquement par description → `commands/<agent>/*.md` fournissent des raccourcis rapides `/agent:command` qui délèguent au sous-agent → `.mcp.json` donne aux agents leurs outils, chacun démarré via `bin/mcp-env.mjs` qui charge les secrets du `.env` partagé. Un crochet `SessionStart` indique Claude que les agents sont disponibles.

---

## Licence

MIT – utilisation, copie, modification et distribution gratuites ; fourni « tel quel », sans garantie ni responsabilité. Voir [LICENSE](./LICENSE).

© 2026 Christian Avis (Vorcl).
