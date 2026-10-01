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

insert into public.gifts (title, image_url, product_url, price_cents, sort_order)
select title, image_url, product_url, price_cents, sort_order
from (
  values
    (
      'Cafeteira elétrica'::text,
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=480&h=480&q=80'::text,
      'https://www.magazineluiza.com.br/busca/cafeteira+eletrica/'::text,
      24990,
      0
    ),
    (
      'Jogo de panelas'::text,
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=480&h=480&q=80'::text,
      'https://www.magazineluiza.com.br/busca/jogo+de+panelas/'::text,
      39900,
      1
    ),
    (
      'Jogo de cama casal'::text,
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=480&h=480&q=80'::text,
      'https://www.magazineluiza.com.br/busca/jogo+de+cama+casal/'::text,
      28990,
      2
    ),
    (
      'Conjunto de taças'::text,
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=480&h=480&q=80'::text,
      'https://www.magazineluiza.com.br/busca/conjunto+de+tacas/'::text,
      12990,
      3
    ),
    (
      'Jogo de toalhas'::text,
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=480&h=480&q=80'::text,
      'https://www.magazineluiza.com.br/busca/jogo+de+toalhas/'::text,
      15990,
      4
    )
) as seed(title, image_url, product_url, price_cents, sort_order)
where not exists (select 1 from public.gifts);
