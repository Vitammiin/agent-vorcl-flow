---
name: drawio-diagrams
description: Диаграммы в нативном XML draw.io/diagrams.net — структура (`mxfile`/`mxGraphModel`/`mxCell`/`mxGeometry`), ID-менеджмент, стили `key=value;`, каталог фигур и рёбер, типы (flowchart, swimlane, BPMN, UML, network/cloud, ERD, org chart, mind map), custom-библиотеки (`?clibs=`), валидность XML. Use при создании/конвертации/правке диаграмм draw.io.
---

# Навык: Draw.io / diagrams.net

По описанию/исходнику — валидный, аккуратный `.drawio` XML для diagrams.net. Проектные диаграммы (WBS/RACI/Gantt/риски/стейкхолдеры) — в `$pmp-diagrams`.

**Навигатор.** База: [формат файла](#формат) (скелет XML) → [ячейки, id, геометрия](#концепты) → [стилизация и палитра](#стили-keyvalue) → [рёбра](#рёбра). Перед сдачей: [правила качества и антипаттерны](#качество). Справочники: [каталог фигур](#фигуры) · [типы диаграмм](#типы-диаграмм) (flowchart/swimlane/BPMN/UML/ERD/…) · [custom-библиотеки `?clibs`](#custom-библиотеки).

## Формат
Иерархия `mxfile > diagram > mxGraphModel > root > mxCell`. Root-ячейки `id="0"` и `id="1" parent="0"`; фигуры/рёбра — `parent="1"`. `mxGraphModel` с `grid="1" gridSize="10"`. Несколько страниц — несколько `<diagram>`.

## Концепты
- Ячейка `mxCell`: фигура `vertex="1"`, связь `edge="1"`.
- ID уникален, `0`/`1` зарезервированы (нумеруй с `2` или осмысленно); рёбра ссылаются через `source`/`target`.
- `mxGeometry`: фигуры `x/y/width/height`; рёбра `relative="1"`.

## Стили (`key=value;`)
Тип (`rounded=1`/`ellipse`/`rhombus`/`shape=...`/`swimlane`); цвета `fillColor`/`strokeColor`/`fontColor`; текст `fontSize`/`fontStyle` (1=bold), `align`/`verticalAlign`/`whiteSpace=wrap;html=1`.
Палитра (fill/stroke): синий `#dae8fc`/`#6c8ebf`, зелёный `#d5e8d4`/`#82b366`, оранжевый `#ffe6cc`/`#d79b00`, жёлтый `#fff2cc`/`#d6b656`, фиолетовый `#e1d5e7`/`#9673a6`, красный `#f8cecc`/`#b85450`, серый `#f5f5f5`/`#666666`.

## Фигуры
Process `rounded=1;...` · Decision `rhombus;...` · Start/End `ellipse;...` · Document `shape=document;...` · Data `shape=parallelogram;...` · Swimlane `swimlane;startSize=20;...` (верт. +`horizontal=0`).

## Рёбра
`edgeStyle=orthogonalEdgeStyle;html=1;exitX/exitY;entryX/entryY;` + `endArrow=block;endFill=1;`. Всегда реальные `source`/`target`; подпись — `value=`.

## Типы диаграмм
flowchart · cross-functional (swimlane) · BPMN (`mxgraph.bpmn.*`) · UML (class/sequence/use case) · network/cloud (`mxgraph.aws4/azure/gcp/kubernetes`) · ERD (таблицы-swimlane, PK/FK, кардинальность) · org chart (дерево) · mind map (радиально).

## Custom-библиотеки
Перечисляй нужные наборы: `https://app.diagrams.net/?clibs=U...` или More Shapes… (AWS/Azure/GCP/Kubernetes/BPMN/UML/Networking).

## Качество
Well-formed XML (экранируй `&`/`<`/`"`, `xmllint --noout`); уникальные id; у рёбер валидные `source`/`target`; выравнивание по сетке, без наложений; ортогональные рёбра; семантические цвета. Антипаттерны: висящие рёбра, дубли id, неэкранированные символы, цвета вразнобой, наложения, диагонали.
