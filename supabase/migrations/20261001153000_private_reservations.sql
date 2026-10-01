alter table public.gifts
  add column if not exists is_reserved boolean not null default false,
  add column if not exists reservation_token uuid;

update public.gifts
set
  is_reserved = (reserved_by is not null),
  reservation_token = coalesce(reservation_token, gen_random_uuid())
where reserved_by is not null;

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

revoke update on table public.gifts from anon, authenticated;

drop policy if exists "Anyone can mark gifts" on public.gifts;

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
