# База данных

Supabase Postgres, project ref **`vjwnxbxtsglrvbxyhdza`**, регион
Stockholm (eu-north-1). URL: `https://vjwnxbxtsglrvbxyhdza.supabase.co`.

Доступ в код — только через автогенерируемый REST API (PostgREST) и
Supabase JS SDK, напрямую с клиента (нет отдельного backend-слоя).
Прямого доступа к БД по строке подключения (`DATABASE_URL`) в коде
репозитория не используется.

## Таблица `public.lamps`

Каталог светильников. На момент создания этой документации — ~288
строк.

| Колонка | Тип (ожидаемый) | Назначение |
|---|---|---|
| `id` | integer, PK | Идентификатор строки. |
| `brand` | text | Бренд светильника (например, `Artemide`). |
| `article` | text | Артикул производителя. |
| `type` | text | Код типа для фильтра на витрине: `potolochnye`, `podvesnye`, `bra`, `torshery`, `nastolnye`, `ulichnye` (также встречается `lyustry` в старых комментариях/доках — сверяться с актуальным набором чипов в `index.html`). |
| `name` | text | Название модели. |
| `price` | numeric | **Цена в евро** — текущая, по акции. Источник истины для расчёта рублёвой цены на витрине. |
| `old_price` | numeric, nullable | **Цена в евро** — прежняя/референсная. Заполняется **только** при наличии реального подтверждённого источника (см. `CLAUDE.md`, раздел 4). Пусто — скидка не показывается. |
| `dimensions` | text | Габариты, свободный текст. |
| `material` | text | Материал, свободный текст. |
| `description` | text | Короткое описание для модалки. |
| `image` | text, nullable | Публичная ссылка на Supabase Storage (`lamp-images`). Пусто — показывается SVG-заглушка. |
| `extra` | jsonb (массив), nullable | Дополнительные пары `{label, value}` для блока характеристик в модалке. |
| `sort_order` | integer, nullable | Порядок отображения в каталоге (`order=sort_order.asc`, `nulls last` при ручных SQL-выгрузках). |
| `created_at` | timestamptz | Время создания строки (видно в `lamps.json`). |

### RLS (Row Level Security) — ожидаемая политика

- `select` — разрешён всем (анонимно), т.к. витрина читает каталог
  без авторизации.
- `insert`/`update`/`delete` — разрешены только роли `authenticated`
  (т.е. только залогиненным через Supabase Auth пользователям —
  практически только через `admin.html`).

Точные формулировки политик настроены в дашборде Supabase
(Database → Policies), не хранятся как код/миграции в этом
репозитории — при необходимости сверять/восстанавливать их нужно
через Supabase Dashboard или `mcp__Supabase__*` инструменты (список
политик, advisors).

## Таблица `public.settings`

Key-value таблица для общесайтовых настроек. На момент написания
документации содержит одну строку:

| Колонка | Тип (ожидаемый) | Назначение |
|---|---|---|
| `key` | text, PK (или unique) | Имя настройки. Сейчас используется `eur_rate`. |
| `value` | text | Значение (хранится как текст, в коде приводится к `Number`). |
| `updated_at` | timestamptz | Обновляется при каждом сохранении из админки. |

### RLS — ожидаемая политика

- `select` — разрешён всем (витрина читает курс анонимно).
- `update` — разрешён только `authenticated` (панель курса в
  `admin.html`). Вставка новых ключей через UI не предусмотрена —
  витрина и админка рассчитаны ровно на один ключ `eur_rate`.

## Supabase Storage

Публичный bucket **`lamp-images`**. Фото загружаются из `admin.html`
(`sb.storage.from('lamp-images').upload(path, file, { upsert: true })`),
публичная ссылка берётся через `getPublicUrl()` и сохраняется в
`lamps.image`.

## Supabase Auth

Email/password провайдер. Один общий аккаунт сотрудника используется
для входа в `admin.html` (учётные данные не хранятся в репозитории —
передаются владельцем отдельно, см. `HANDOFF.md`). Регистрация новых
пользователей через UI сайта не предусмотрена — пользователи
заводятся вручную через Supabase Dashboard при необходимости.

## Восстановление/экспорт каталога напрямую из Supabase (SQL)

Полезно для ручного бэкапа БД независимо от `lamps.json`:

```sql
select json_agg(row_to_json(t)) as data
from (
  select brand, article, name, type, price, old_price,
         dimensions, material, description, image, extra, sort_order
  from public.lamps
  order by sort_order nulls last, id
) t;
```

## Связь схемы с кодом

Любое изменение структуры таблиц должно быть синхронизировано в трёх
местах:
1. Сама схема в Supabase (миграция/ручное изменение в дашборде).
2. `admin.html` — форма редактирования, `renderTable()`.
3. `app.js` — `mapRows()` и рендер карточки/модалки (если поле видно
   покупателю).

`lamps.json` отдельной синхронизации не требует — он зеркалит
`select=*`, поэтому новые поля появятся в нём автоматически при
следующем срабатывании `sync-catalog.yml`.
