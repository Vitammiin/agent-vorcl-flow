---
name: pmp-diagrams
description: Проектные диаграммы PMP/PMBOK в draw.io — WBS, Project Network PERT/CPM (critical path), Gantt, RACI, Risk Matrix 5×5, Stakeholder power-interest grid + resource histogram/communication plan/process groups/knowledge areas. Уровни, цвета, style-сниппеты. Use при построении PM-диаграмм в draw.io.
---

# Навык: PMP/PMBOK диаграммы (draw.io)

Проектные диаграммы PMBOK в нативном XML draw.io. Опирается на `$drawio-diagrams` (формат/стили/рёбра/качество) — здесь специфика PM.

## WBS
Дерево уровней 0–3, рёбра сверху-вниз (`endArrow=none`). Ур.0 200×80 тёмно-синий `fillColor=#1ba1e2;strokeColor=#006EAF;fontColor=#ffffff;fontStyle=1`; ур.1 зелёный `#60a917`/`#2D7600`; ур.2 `#d5e8d4`/`#82b366`; ур.3 самый светлый. WBS-коды `1`/`1.1`/`1.1.2`, 100% охват.

## PERT/CPM (AON)
Нода-активность с секциями ES/Dur/LS/LF вокруг названия — `fillColor=#fff2cc;strokeColor=#d6b656`. Critical path подсвечен — `fillColor=#f8cecc;strokeColor=#b85450;strokeWidth=3` + рёбра `strokeColor=#b85450;strokeWidth=3`. Зависимости слева-направо `endArrow=block`.

## Gantt
Полосы задач вдоль оси времени `fillColor=#60a917;strokeColor=#2D7600;fontColor=#ffffff`; веха-ромб `rhombus;fillColor=#fa6800;strokeColor=#C73500`; зависимости `orthogonalEdgeStyle;endArrow=block`. Слева — названия, сверху — шкала.

## RACI
Матрица роли × задачи; цвета R зелёный `#d5e8d4`, A синий `#dae8fc`, C жёлтый `#fff2cc`, I фиолетовый `#e1d5e7`; ровно один `A` на задачу; контейнер `swimlane;startSize=40`.

## Risk Matrix 5×5
Probability × Impact; цвет = уровень: Low зелёный `#d5e8d4`, Medium жёлтый `#fff2cc`, High оранжевый `#ffe6cc`, Critical красный `#f8cecc`. Верх-право критично.

## Stakeholder grid
2×2 Power × Interest: Manage Closely / Keep Satisfied / Keep Informed / Monitor. Стейкхолдеры — метки внутри квадрантов.

## Прочее
Resource histogram (bars + capacity), communication plan (узлы+рёбра), Process Groups (Initiating→Planning→Executing→M&C→Closing), Knowledge Areas (10 областей).

## Правила
Семантика метода (один `A`; critical path непрерывен; WBS без дублей), цвета по легендам, ортогональные рёбра, выравнивание по сетке, валидный XML (`$drawio-diagrams`), обязательная легенда (цвет → значение).
