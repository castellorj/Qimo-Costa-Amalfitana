# QIMO Croatia — Modelagem de Dados (Supabase)

A camada de conteúdo atual (`/content/*.ts`) é **tipada e serializável** e foi
desenhada para mapear 1:1 a um backend Supabase quando desejado. A UI nunca
importa dados crus — importa de `@/content`. Para migrar, basta tornar essas
funções `async` (fetch do Supabase); **nenhum componente muda**.

## Tabelas

```sql
-- DESTINOS ------------------------------------------------------------------
create table destinations (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  day          int  not null,
  date         date not null,
  name         text not null,
  tagline      text not null,
  route        text,
  hero_src     text not null,
  hero_alt     text not null,
  introduction text[] not null,          -- parágrafos editoriais
  coordinates  jsonb not null,           -- { lat, lng }
  temp_c       int  not null,
  sunset       text not null,            -- "20:17"
  practical    jsonb not null,           -- [{ label, value }]
  created_at   timestamptz default now()
);

create table points_of_interest (
  id             uuid primary key default gen_random_uuid(),
  destination_id uuid references destinations(id) on delete cascade,
  name           text not null,
  description    text not null,
  coordinates    jsonb,
  sort           int default 0
);

create table images (              -- galerias (destino, experiência, etc.)
  id             uuid primary key default gen_random_uuid(),
  owner_type     text not null,    -- 'destination' | 'experience' | 'wine_region'
  owner_id       uuid not null,
  src            text not null,    -- Supabase Storage URL
  alt            text not null,
  credit         text,
  sort           int default 0
);

-- GASTRONOMIA ---------------------------------------------------------------
create type restaurant_category as enum
  ('michelin','fine-dining','beach-club','sunset','wine-bar','traditional');
create type price_range as enum ('€','€€','€€€','€€€€');

create table restaurants (
  id             uuid primary key default gen_random_uuid(),
  destination_id uuid references destinations(id) on delete set null,
  name           text not null,
  category       restaurant_category not null,
  price_range    price_range not null,
  description    text not null,
  image_src      text not null,
  image_alt      text not null,
  coordinates    jsonb,
  phone          text,
  website        text,
  distinction    text                    -- "1 Estrela Michelin"
);

-- VINHOS --------------------------------------------------------------------
create table wine_regions (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  is_island   bool not null,
  coordinates jsonb not null,
  history     text not null,
  grapes      text[] not null,
  image_src   text not null,
  image_alt   text not null,
  experiences text[] not null
);

create table wineries (
  id         uuid primary key default gen_random_uuid(),
  region_id  uuid references wine_regions(id) on delete cascade,
  name       text not null,
  description text not null,
  experience text
);

-- VIAGEM / ITINERÁRIO -------------------------------------------------------
create table itinerary_events (
  id             uuid primary key default gen_random_uuid(),
  destination_id uuid references destinations(id) on delete cascade,
  day            int  not null,
  time           text not null,          -- "18:00"
  title          text not null,
  detail         text,
  sort           int default 0
);

-- EXPERIÊNCIAS / CONCIERGE --------------------------------------------------
create table experiences (
  id        uuid primary key default gen_random_uuid(),
  title     text not null,
  tagline   text not null,
  description text not null,
  image_src text not null,
  image_alt text not null,
  sort      int default 0
);

create table concierge_sections (
  id    uuid primary key default gen_random_uuid(),
  slug  text unique not null,            -- 'contatos' | 'gorjetas' | 'navio'
  title text not null,
  items jsonb not null,                  -- [{ label, value }]
  sort  int default 0
);

create table checklist_items (
  id       uuid primary key default gen_random_uuid(),
  label    text not null,
  category text not null,
  sort     int default 0
);
```

## RLS (leitura pública, escrita só painel)

```sql
alter table destinations enable row level security;
create policy "public read" on destinations for select using (true);
-- repetir para cada tabela de conteúdo.
-- Escrita: restrita a usuários autenticados do painel (role 'editor').
```

## Storage

Bucket público `qimo-media` para heroes, galerias, fotos de restaurantes e
vinícolas. O campo `*_src` guarda a URL pública (ou assinada) do objeto.

## Estratégia de migração (sem tocar a UI)

1. `supabase` MCP → `apply_migration` com o SQL acima.
2. Popular as tabelas a partir dos arquivos `/content/*.ts` (seed).
3. Trocar os getters de `/content/index.ts` por fetchers `async` do Supabase
   (`createServerClient`), usando `revalidate` do Next para ISR.
4. Painel admin: Supabase Studio inicialmente; depois um CMS leve em
   `/admin` (rota protegida) para cadastro pelos organizadores.
```
