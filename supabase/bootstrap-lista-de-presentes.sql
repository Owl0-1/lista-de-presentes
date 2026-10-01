-- Schema final para projeto novo (lista-de-presentes)

create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  product_url text,
  price_cents integer,
  sort_order integer not null default 0,
  reserved_by text,
  is_reserved boolean not null default false,
  reservation_token uuid,
  created_at timestamptz not null default now(),
  constraint gifts_title_length check (char_length(title) between 1 and 80),
  constraint gifts_reserved_by_length check (
    reserved_by is null or char_length(reserved_by) between 1 and 40
  ),
  constraint gifts_image_url_length check (
    image_url is null or char_length(image_url) between 1 and 2000
  ),
  constraint gifts_product_url_length check (
    product_url is null or char_length(product_url) between 1 and 2000
  ),
  constraint gifts_price_cents_check check (
    price_cents is null or (price_cents > 0 and price_cents <= 10000000)
  )
);

alter table public.gifts enable row level security;

drop policy if exists "Anyone can read gifts" on public.gifts;
drop policy if exists "Anyone can add gifts" on public.gifts;
drop policy if exists "Anyone can mark gifts" on public.gifts;

create policy "Anyone can read gifts"
  on public.gifts
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can add gifts"
  on public.gifts
  for insert
  to anon, authenticated
  with check (true);

revoke all on table public.gifts from anon, authenticated;

grant select (
  id,
  title,
  image_url,
  product_url,
  price_cents,
  sort_order,
  created_at,
  is_reserved
) on table public.gifts to anon, authenticated;

grant insert on table public.gifts to anon, authenticated;

create or replace function public.reserve_gift(p_gift_id uuid, p_buyer_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token uuid := gen_random_uuid();
  v_name text := trim(p_buyer_name);
begin
  if v_name is null or char_length(v_name) < 1 or char_length(v_name) > 40 then
    raise exception 'Diga quem vai comprar';
  end if;

  update public.gifts
  set
    reserved_by = v_name,
    reservation_token = v_token,
    is_reserved = true
  where id = p_gift_id
    and is_reserved = false;

  if not found then
    raise exception 'Presente indisponível';
  end if;

  return v_token;
end;
$$;

create or replace function public.release_gift(p_gift_id uuid, p_token uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_token is null then
    raise exception 'Não foi possível liberar';
  end if;

  update public.gifts
  set
    reserved_by = null,
    reservation_token = null,
    is_reserved = false
  where id = p_gift_id
    and reservation_token = p_token;

  if not found then
    raise exception 'Não foi possível liberar';
  end if;
end;
$$;

revoke all on function public.reserve_gift(uuid, text) from public;
revoke all on function public.release_gift(uuid, uuid) from public;

grant execute on function public.reserve_gift(uuid, text) to anon, authenticated;
grant execute on function public.release_gift(uuid, uuid) to anon, authenticated;

insert into public.gifts (title, product_url, image_url, price_cents, sort_order)
select title, product_url, image_url, price_cents, sort_order
from (
  values
    ('Sagittarius Seiya FiguartsZERO'::text, 'https://www.amazon.com.br/dp/B0D2KH7C7K'::text, 'https://m.media-amazon.com/images/I/717Txp6IwXL._AC_SL500_.jpg'::text, 228986, 0),
    ('Psicologia Forense'::text, 'https://www.amazon.com.br/dp/8536324309'::text, 'https://m.media-amazon.com/images/I/91wAysoZqML._SL500_.jpg'::text, 24108, 1),
    ('Avaliação Psicológica no Contexto Forense'::text, 'https://www.amazon.com.br/dp/8582715943'::text, 'https://m.media-amazon.com/images/I/81q1fktIVuL._SL500_.jpg'::text, 15780, 2),
    ('Freud: Neurose, psicose, perversão'::text, 'https://www.amazon.com.br/dp/8582179855'::text, 'https://m.media-amazon.com/images/I/51AYcW75IAL._SL500_.jpg'::text, 6482, 3),
    ('Freud: Inibição, sintoma e angústia'::text, 'https://www.amazon.com.br/dp/6559287645'::text, 'https://m.media-amazon.com/images/I/71-lPLMJltL._SL500_.jpg'::text, 6833, 4),
    ('iPad Air 13" 128 GB'::text, 'https://www.amazon.com.br/dp/B0DZK3VZVH'::text, 'https://m.media-amazon.com/images/I/51q7uCdqy2L._AC_SL500_.jpg'::text, 799990, 5),
    ('Baralho Black à prova d''água'::text, 'https://www.amazon.com.br/dp/B0FGKS1VTY'::text, 'https://m.media-amazon.com/images/I/616maN3Gt0L._AC_SL500_.jpg'::text, 4390, 6),
    ('Bicicleta ergométrica spinning'::text, 'https://www.amazon.com.br/dp/B0FDS8R6DW'::text, 'https://m.media-amazon.com/images/I/61ln+QG9IML._AC_SL500_.jpg'::text, 85394, 7),
    ('Sauvage Dior Eau de Parfum 200ml'::text, 'https://www.amazon.com.br/dp/B07PHSB4L9'::text, 'https://m.media-amazon.com/images/I/61YGnWUxG0L._AC_SL500_.jpg'::text, 108196, 8),
    ('Kindle Paperwhite 16 GB'::text, 'https://www.amazon.com.br/dp/B0CFPL6CFY'::text, 'https://m.media-amazon.com/images/I/81-vCHKJb1L._AC_SL500_.jpg'::text, 100957, 9),
    ('Relógio Casio LTP-V007L-9B'::text, 'https://www.amazon.com.br/dp/B08DJ1F7XH'::text, 'https://m.media-amazon.com/images/I/51mge8lyG7L._AC_SL500_.jpg'::text, 23339, 10)
) as seed(title, product_url, image_url, price_cents, sort_order)
where not exists (select 1 from public.gifts);
