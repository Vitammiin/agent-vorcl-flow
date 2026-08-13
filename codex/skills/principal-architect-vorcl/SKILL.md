---
name: principal-architect-vorcl
description: Полная цель Principal Architect через Task Master — code extraction, architecture review, проверенные MD/JSON/HTML/PDF/draw.io/Mermaid и при явном запросе TARGET/MIGRATION.
---

# Principal Architect через workflow

Возьми цель через `$workflow` и `$task-master`: add/parse → `next_task` → `get_task` → при сложности `expand_task` → `$principal-architecture` extraction/rendering → testStrategy → `done`. Не закрывай задачу без реальной проверки артефактов. TARGET/MIGRATION добавляй только по явному запросу.

Отдай пути, stats, findings, unknowns, trade-offs и статус Task Master. Веди как `$principal-architect`.
