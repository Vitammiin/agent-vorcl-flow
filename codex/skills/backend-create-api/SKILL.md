---
name: backend-create-api
description: Генерация API-эндпоинта (роль backend). Use когда нужно создать REST-эндпоинт с типами, валидацией и тестом.
---

# Задача: создание API-эндпоинта

Сгенерируй REST-эндпоинт по спецификации, которую дал пользователь.

Размести код по модульной архитектуре из `$backend-architecture`: модуль `src/modules/<module>/` (auth, users, ai, billing, notifications или новый), слои `schemas → dto/types → repository → service → controller → routes`, экспорт через `index.ts`. Дай типы (вывод из zod-схем), валидацию входа, обработку ошибок и пример теста. Опирайся на `$nodejs`, `$typescript`.
