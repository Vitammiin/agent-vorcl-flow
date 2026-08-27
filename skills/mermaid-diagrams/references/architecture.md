# Architecture (architecture-beta) и Block

Две «схемы из коробок» с ручным управлением расположением: `architecture-beta` (v11.1.0+) — сервисы, группы и рёбра для облачных и CI/CD-архитектур с иконками; `block` — сетка блоков, где автор полностью контролирует позиции. **Не применять**, когда нужен поток управления с ветвлениями и автолейаутом (`flowchart`), последовательность во времени (`sequenceDiagram`) или строгая модель C4 (`C4Context`).

## Минимальный скелет

```mermaid
architecture-beta
    group api(cloud)[API]
    service db(database)[Database] in api
    service server(server)[Server] in api
    db:L -- R:server
```

```mermaid
block
  columns 3
  a b c
```

## Синтаксис

Строительные блоки `architecture-beta` — `group`, `service`, `edge`, `junction`. Иконка объявляется в круглых скобках `()`, подпись — в квадратных `[]`. Блоки можно объявлять в любом порядке, но идентификатор должен быть объявлен раньше, чем на него ссылаются.

### Группы

```
group {group id}({icon name})[{title}] (in {parent id})?
```

Опциональное `in {parent id}` вкладывает группу в другую группу.

```mermaid
architecture-beta
    group public_api(cloud)[Public API]
    group private_api(cloud)[Private API] in public_api
    service db(database)[DB] in private_api
    service srv(server)[Server] in public_api
    db:R -- L:srv
```

### Сервисы

```
service {service id}({icon name})[{title}] (in {parent id})?
```

Иконка необязательна — `service a[A]` рендерится без неё. Подпись без кавычек допускает только латиницу, цифры и пробелы; всё остальное (кириллица, диакритика, дефис, точка) требует кавычек внутри скобок — `["DB v2 - main"]`.

```mermaid
architecture-beta
    group api(cloud)["Публичный API"]
    service database1(database)[My Database] in api
    service plain["Без иконки"] in api
    service edge(server)["DB v2 - main"] in api
    database1:R -- L:plain
    plain:B -- T:edge
```

### Рёбра

```
{serviceId}{{group}}?:{T|B|L|R} {<}?--{>}? {T|B|L|R}:{serviceId}{{group}}?
```

- **Сторона выхода** задаётся двоеточием и буквой `L` (left), `R` (right), `T` (top), `B` (bottom): `db:R -- L:server` — ребро выходит справа у `db` и входит слева у `server`. Разные оси дают ребро с изломом 90°: `db:T -- L:server`.
- **Стрелки**: `<` перед направлением слева и/или `>` после направления справа. `subnet:R --> L:gateway` — стрелка входит в `gateway`; `a:R <--> L:b` — двусторонняя.

```mermaid
architecture-beta
    service db(database)[DB]
    service server(server)[Server]
    service gateway(internet)[Gateway]
    service cache(disk)[Cache]
    db:R -- L:server
    server:R --> L:gateway
    db:T <--> B:cache
```

### Рёбра из групп

Модификатор `{group}` после `serviceId` выводит ребро наружу группы — рядом с указанным сервисом:

```mermaid
architecture-beta
    group groupOne(cloud)[One]
    group groupTwo(cloud)[Two]
    service server(server)[Server] in groupOne
    service subnet(internet)[Subnet] in groupTwo
    server{group}:B --> T:subnet{group}
```

`groupId` в рёбрах использовать **нельзя**; модификатор `{group}` работает только для сервисов, лежащих внутри группы.

### Выравнивание соседей — `align` (v11.16.0+)

Когда несколько сервисов имеют одинаковую топологию рёбер (например, три базы подключены через `R --> L:mcp`), эвристика раскладки может схлопнуть их в одну координату и нарисовать друг поверх друга. Директива `align` объявляет общую строку (одинаковый y) или колонку (одинаковый x) и разносит участников по этой оси.

```
align row {idA} {idB} {idC} ...
align column {idA} {idB} ...
```

Участники должны быть уже объявлены как `service` или `junction`, минимум двое; каждая директива — на своей строке. Порядок перечисления задаёт порядок вдоль оси, зазор регулируется `idealEdgeLengthMultiplier`.

- **`align column`** — когда участники связаны с общим узлом *горизонтальной парой портов* (`R --> L:...`): получается вертикальный стек сбоку.
- **`align row`** — когда связь идёт *вертикальной парой портов* (`B --> T:...`): получается горизонтальный ряд над узлом.

```mermaid
architecture-beta
    group api(cloud)[API]
    service db1(database)[DB1] in api
    service db2(database)[DB2] in api
    service db3(database)[DB3] in api
    service mcp(server)[MCP] in api
    db1:R --> L:mcp
    db2:R --> L:mcp
    db3:R --> L:mcp
    align column db1 db2 db3
```

```mermaid
architecture-beta
    service src1(server)[Source 1]
    service src2(server)[Source 2]
    service src3(server)[Source 3]
    service proc(server)[Processor]
    src1:B --> T:proc
    src2:B --> T:proc
    src3:B --> T:proc
    align row src1 src2 src3
```

**Сетка.** `align row` фиксирует только y. Чтобы колонки совпали между ярусами, к каждому `align row` добавьте `align column`; колонки можно тянуть через сколько угодно ярусов и через границы групп.

```mermaid
architecture-beta
    group sources(cloud)[Sources]
        service src_a(server)[Source A] in sources
        service src_b(server)[Source B] in sources
        service src_c(server)[Source C] in sources

    group storage(database)[Storage]
        service db_one(database)[DB One] in storage
        service db_two(database)[DB Two] in storage
        service db_three(database)[DB Three] in storage

    group output(disk)[Output]
        service brief(disk)[Brief] in output
        service analyst(server)[Analyst] in output
        service delivery(cloud)[Delivery] in output

    src_a:B --> T:db_one
    src_b:B --> T:db_two
    src_c:B --> T:db_three
    db_two:B --> T:brief
    brief:R --> L:analyst
    analyst:R --> L:delivery

    align row src_a src_b src_c
    align row db_one db_two db_three
    align row brief analyst delivery

    align column src_a db_one
    align column src_b db_two brief
    align column src_c db_three
```

Рёбра между выровненными узлами рисуются прямыми линиями; поперечные — с одним изломом 90°.

### Junction

Junction — узел-развилка на четыре стороны:

```
junction {junction id} (in {parent id})?
```

```mermaid
architecture-beta
    service left_disk(disk)[Disk]
    service top_disk(disk)[Disk]
    service bottom_disk(disk)[Disk]
    service top_gateway(internet)[Gateway]
    service bottom_gateway(internet)[Gateway]
    junction junctionCenter
    junction junctionRight

    left_disk:R -- L:junctionCenter
    top_disk:B -- T:junctionCenter
    bottom_disk:T -- B:junctionCenter
    junctionCenter:R -- L:junctionRight
    top_gateway:B -- T:junctionRight
    bottom_gateway:T -- B:junctionRight
```

### Иконки

Из коробки доступны `cloud`, `database`, `disk`, `internet`, `server`. После регистрации набора иконок на стороне интегратора (`mermaid.registerIconPacks`) доступны 200 000+ иконок iconify.design в формате `name:icon-name`, где `name` — имя набора при регистрации.

```mermaid
architecture-beta
    group api(logos:aws-lambda)[API]
    service db(logos:aws-aurora)[Database] in api
    service disk1(logos:aws-glacier)[Storage] in api
    service server(logos:aws-ec2)[Server] in api
    db:L -- R:server
    disk1:T -- B:server
```

### Конфигурация architecture

Через frontmatter `config: architecture:` (или `mermaid.initialize({ architecture: {...} })`).

| Опция | Тип | По умолчанию | Что делает |
| --- | --- | --- | --- |
| `randomize` (v11.14.0+) | boolean | `false` | Рандомизировать стартовые позиции узлов перед раскладкой |
| `nodeSeparation` (v11.15.0+) | number | `75` | Минимальный зазор в пикселях между соседями одной группы (pass-through в fcose) |
| `idealEdgeLengthMultiplier` (v11.15.0+) | number | `1.5` | Множитель к `iconSize` для идеальной длины рёбер внутри группы; межгрупповые рёбра не затрагивает |
| `edgeElasticity` (v11.15.0+) | number | `0.45` | Упругость пружины (0–1) на рёбрах внутри группы: выше — узлы ближе |
| `numIter` (v11.15.0+) | number | `2500` | Максимум итераций fcose: больше — лучше раскладка, дольше рендер |
| `seed` (v11.15.0+) | number | `1` | Детерминированное зерно fcose. `0` — нативный `Math.random` (недетерминированно), другое число — другой воспроизводимый вариант |

```mermaid
---
config:
  architecture:
    idealEdgeLengthMultiplier: 3
    seed: 1
---
architecture-beta
    service a(server)[A]
    service b(server)[B]
    service c(server)[C]
    a:R --> L:b
    b:R --> L:c
```

`randomize: false` сам по себе не гарантирует одинаковый рендер — fcose всё равно дёргает `Math.random()` в решателе ограничений; полную фиксацию даёт `seed`.

### Accessibility (architecture)

`accTitle:` и `accDescr:` поддерживаются (проверено рендером на 11.16.1):

```mermaid
architecture-beta
    accTitle: Архитектура сервиса
    accDescr: База данных подключена к серверу приложений
    service db(database)[DB]
    service srv(server)[Server]
    db:R --> L:srv
```

## block

Заголовок — `block` (алиас `block-beta` тоже рендерится). Автор полностью контролирует позиции: блоки укладываются по сетке в порядке записи.

### Колонки и ширина блока

`columns N` задаёт число колонок; блоки переносятся на следующий ряд. `id:N` растягивает блок на `N` колонок.

```mermaid
block
  columns 3
  a["A label"] b:2 c:2 d
```

Вертикальную «стопку» делают колонкой из одной ячейки:

```mermaid
block
  block
    columns 1
    a["A label"] b c d
  end
```

### Составные блоки

Вложенный блок открывается `block` (или `block:id`, `block:id:N` с шириной) и закрывается `end`. У вложенного блока может быть своя `columns`; без неё действует `columns auto`.

```mermaid
block
  columns 3
  a:3
  block:group1:2
    columns 2
    h i j k
  end
  g
  block:group2:3
    %% columns auto (по умолчанию)
    l m n o p q r
  end
```

Ширина колонки определяется самым широким блоком в ней.

### Формы блоков

```mermaid
block
  columns 3
  r("скруглённый")
  s(["стадион"])
  sub[["подпрограмма"]]
  cyl[("БД")]
  cir(("круг"))
  asym>"асимметричный"]
  rho{"ромб"}
  hex{{"шестиугольник"}}
  par1[/"параллелограмм"/]
  par2[\"параллелограмм alt"\]
  tra1[/"трапеция"\]
  tra2[\"трапеция alt"/]
  dc((("двойной круг")))
```

### Block-стрелки и space

Block-стрелка: `id<["Подпись"]>(направление)`. Направления: `right`, `left`, `up`, `down`, `x` (влево-вправо), `y` (вверх-вниз), а также комбинации через запятую — `(x, down)`.

```mermaid
block
  columns 3
  blockArrowId<["Label"]>(right)
  blockArrowId2<["Label"]>(left)
  blockArrowId3<["Label"]>(up)
  blockArrowId4<["Label"]>(down)
  blockArrowId5<["Label"]>(x)
  blockArrowId6<["Label"]>(y)
  blockArrowId7<["Label"]>(x, down)
```

`space` вставляет пустую ячейку, `space:N` — пустоту шириной в `N` колонок.

```mermaid
block
  columns 3
  a space b
  c   d   e
```

```mermaid
block
  ida space:3 idb idc
```

### Связи и подписи

Стрелки те же, что во flowchart: `-->`, `---`; подпись — `-- "текст" -->`. Соединять можно и составной блок по его `id`.

```mermaid
block
columns 1
  db(("DB"))
  arrow<["&nbsp;&nbsp;&nbsp;"]>(down)
  block:ID
    A
    B["A wide one in the middle"]
    C
  end
  space
  D
  ID --> D
  C --> D
  style B fill:#969,stroke:#333,stroke-width:4px
```

```mermaid
block
  columns 4
  A space:2 B
  A-- "X" -->B
```

### Стили и классы

`style <id> <css>` — точечно; `classDef <имя> <css>;` + `class <id[,id2]> <имя>` — переиспользуемо.

```mermaid
block
  columns 3
  A space B
  A-->B
  classDef blue fill:#6e6ce6,stroke:#333,stroke-width:4px;
  class A blue
  style B fill:#bbf,stroke:#f66,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
```

Практический пример — архитектура с классами по ролям:

```mermaid
block
  columns 3
  Frontend arrowRight<[" "]>(right) Backend
  space:2 down<[" "]>(down)
  Disk left<[" "]>(left) Database[("Database")]

  classDef front fill:#696,stroke:#333;
  classDef back fill:#969,stroke:#333;
  class Frontend front
  class Backend,Database back
```

Комментарии — `%%` в начале строки.

## Ловушки

**architecture-beta**

- **Идентификатор должен быть объявлен раньше ссылки на него** — сервис в `in group`, ребро между сервисами. Порядок объявления групп/сервисов/рёбер иначе свободный.
- **`groupId` нельзя использовать как конец ребра.** Наружу группы выводит только модификатор `{group}` на сервисе внутри неё.
- **Наложение сервисов друг на друга** при одинаковой топологии рёбер — известное ограничение эвристики (issue #6120). `nodeSeparation`/`idealEdgeLengthMultiplier`/`edgeElasticity` тут **не помогут**: они лишь тюнят fcose, но не меняют логические позиции. Лечится `align row|column`.
- **Порядок в `align` не должен противоречить направлениям рёбер**: документация предупреждает, что при `a:L --> R:b` (то есть `a` правее `b`) директива `align row a b` конфликтует с ребром и раскладка может не построиться — пишите `align row b a` или убирайте конфликтующее ребро.
- **Длинная однословная подпись** не влезает в строку при маленьком `iconSize` — поднимайте `iconSize` или сокращайте заголовок.
- **`randomize: false` ≠ детерминированный рендер** — фиксируйте `seed`.
- **Кириллица и пунктуация в подписи без кавычек ломают рендер** (проверено на 11.16.1): `service db(database)[База]`, `[Café]`, `[DB v2 - main]` дают Syntax error. Лечится кавычками: `service db(database)["База"]`. Идентификаторы (`service база(...)`) кириллицей писать нельзя вообще — кавычки там не спасают, только латиница.
- **Пустые скобки иконки `service plain()[Plain]` — синтаксическая ошибка** (проверено на 11.16.1). Либо иконка, либо вообще без скобок: `service plain[Plain]`.
- **Иконки вне пяти базовых** (`cloud`, `database`, `disk`, `internet`, `server`) требуют зарегистрированного icon pack; без него `logos:aws-ec2` парсится, но иконка не отрисовывается.

**block**

- **`accTitle:` / `accDescr:` ломают `block`** — parse error `Expecting 'BLOCK_DIAGRAM_KEY', ... got 'acc_title'` (проверено на 11.16.1). В `architecture-beta` и `C4*` они работают, в `block` — нет.
- **Соседние блоки не соединяются напрямую**: чтобы нарисовать стрелку, между блоками нужна пустая ячейка — `A space B` и затем `A --> B`. Запись `A - B` невалидна: связь задаётся только `-->` или `---`.
- **Стиль пишется с двоеточиями и запятыми**: `style A fill#969;` не сработает, правильно `style A fill:#969,stroke:#333;`.
- **Подписи со спецсимволами** оборачивайте в кавычки внутри формы: `B["A wide one in the middle"]`.
- **`columns` действует на текущий уровень вложенности** — у каждого составного блока своя сетка; без явного `columns` внутри работает `columns auto`.

## Источник

Дистиллировано из официальной документации mermaid-js/mermaid (docs/syntax), проверено рендером на mermaid-cli 11.16.0 / mermaid 11.16.1.
