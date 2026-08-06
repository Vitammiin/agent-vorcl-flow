---
description: Построить проектную диаграмму PMP/PMBOK в draw.io — WBS, PERT/CPM, Gantt, RACI, risk matrix, stakeholder grid (drawio). Use when нужен именно проектный артефакт со строгой семантикой метода; обычная диаграмма (flowchart/UML/ERD…) → /drawio:create
argument-hint: "<тип: wbs|pert|gantt|raci|risk|stakeholder> + данные проекта"
allowed-tools: Read, Write, Edit, Bash
---

Построй проектную диаграмму PMP/PMBOK в draw.io: **$ARGUMENTS**.

По типу:
- **wbs** — дерево работ (уровни 0–3: размеры/цвета усиливают иерархию, WBS-коды `1`/`1.1`/`1.1.2`, рёбра сверху-вниз без стрелок).
- **pert / cpm** — Project Network (AON-ноды с ES/Dur/LS/LF, зависимости слева-направо, **critical path** подсвечен красным `strokeWidth=3`).
- **gantt** — таймлайн-полосы по задачам вдоль оси времени, вехи-ромбы, рёбра-зависимости, колонка названий слева.
- **raci** — матрица роли × задачи, цвета R/A/C/I (зелёный/синий/жёлтый/фиолетовый), ровно один `A` на задачу.
- **risk** — сетка 5×5 probability × impact, цвет = уровень (green/yellow/orange/red).
- **stakeholder** — power-interest grid 2×2 (Manage Closely / Keep Satisfied / Keep Informed / Monitor).

Требования: валидный `mxGraphModel`, уникальные id, ортогональные рёбра, выравнивание по сетке, семантические цвета по легендам и обязательная **легенда** (цвет → значение). Соблюдай семантику метода (один `A` в RACI; 100% охват в WBS; непрерывная критическая цепочка). **Материализуй** результат как `.drawio`-файл в рабочем каталоге пользователя и провалидируй `xmllint --noout` (**только валидный артефакт = готово**); отдай путь + как открыть в diagrams.net.

Опирайся на навыки `pmp-diagrams`, `drawio-diagrams`. Делегируй субагенту `drawio`.
