---
name: drawio-pmp
description: Построить проектную диаграмму PMP/PMBOK в draw.io — wbs|pert|gantt|raci|risk|stakeholder (роль drawio). Use для проектных/PM-диаграмм.
---

# Задача: проектная диаграмма PMP/PMBOK (drawio)

Построй PMP/PMBOK-диаграмму указанного типа (см. `$pmp-diagrams`, `$drawio-diagrams`).

- wbs — дерево работ (уровни 0–3, WBS-коды, 100% охват).
- pert/cpm — AON-ноды (ES/Dur/LS/LF), critical path красным `strokeWidth=3`.
- gantt — таймлайн-полосы, вехи-ромбы, зависимости.
- raci — роли×задачи, цвета R/A/C/I, один `A` на задачу.
- risk — сетка 5×5 probability×impact (green/yellow/orange/red).
- stakeholder — power-interest 2×2.

Валидный `mxGraphModel`, уникальные id, ортогональные рёбра, сетка, семантические цвета + обязательная легенда. Соблюдай семантику метода. Сохрани в `.drawio`, проверь `xmllint --noout`, дай путь + как открыть. Опирайся на `$pmp-diagrams`, `$drawio-diagrams`.
