---
description: Построить диаграмму draw.io/diagrams.net по текстовому описанию — валидный XML, аккуратная раскладка, семантические цвета (drawio). Use when вход — описание словами; исходник (код/БД/mermaid/CSV) → /drawio:convert, PMP-артефакты → /drawio:pmp, правка готового .drawio → /drawio:refine
argument-hint: "<описание диаграммы> [тип: flowchart|bpmn|uml|erd|network|orgchart|mindmap]"
allowed-tools: Read, Write, Edit, Bash
---

Построй диаграмму draw.io по описанию: **$ARGUMENTS**.

Выбери тип под задачу (если не задан): процесс → **flowchart**, роли/отделы → **swimlane (cross-functional)**, система/инфраструктура → **network/cloud**, данные → **ERD**, иерархия → **org chart**, идеи → **mind map**, бизнес-процесс → **BPMN**, объекты/поведение → **UML**.

Требования: нативный `mxGraphModel` (`mxfile > diagram > mxGraphModel > root`); **уникальные id** (`0`/`1` зарезервированы), у **каждого** ребра реальные `source`/`target`; **ортогональные рёбра** (`edgeStyle=orthogonalEdgeStyle`) без диагоналей; **выравнивание по сетке** (`gridSize=10`, координаты кратны 10, без наложений); **семантические цвета** из палитры draw.io (роль → цвет постоянно); подписи с экранированием `&`/`<`/`"`. **Материализуй** результат как `.drawio`-файл в рабочем каталоге пользователя (не только XML текстом в ответе) и провалидируй: `xmllint --noout` зелёный (или файл повторно открывается без ошибок). **Только валидный артефакт = готово.**

Отдай: путь к файлу + как открыть в app.diagrams.net + какие custom-библиотеки (`?clibs=…`: BPMN/UML/AWS/Azure/GCP/Kubernetes/Networking) включить + заметки о допущениях. Неоднозначное помечай и предлагай альтернативу. Опирайся на навыки `drawio-diagrams`, `system-design`. Делегируй субагенту `drawio`.
