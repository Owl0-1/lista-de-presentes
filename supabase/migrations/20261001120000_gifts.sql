create table public.gifts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  quote text,
  tone text not null,
  illustration text not null,
  span text not null,
  sort_order integer not null default 0,
  reserved_by text,
  created_at timestamptz not null default now(),
  constraint gifts_title_length check (char_length(title) between 1 and 80),
  constraint gifts_quote_length check (quote is null or char_length(quote) <= 120),
  constraint gifts_reserved_by_length check (
    reserved_by is null or char_length(reserved_by) between 1 and 40
  ),
  constraint gifts_tone_check check (tone in ('mint', 'violet', 'pink')),
  constraint gifts_illustration_check check (
    illustration in ('shirt', 'gift', 'balloons', 'cupcake', 'cake', 'mascot')
  ),
  constraint gifts_span_check check (span in ('tall', 'wide', 'small', 'portrait'))
);

alter table public.gifts enable row level security;

grant select, insert, update on table public.gifts to anon, authenticated;

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

create policy "Anyone can mark gifts"
  on public.gifts
  for update
  to anon, authenticated
  using (true)
  with check (true);

insert into public.gifts (title, quote, tone, illustration, span, sort_order)
values
  ('Camisa da festa', null, 'mint', 'shirt', 'tall', 0),
  ('Presente surpresa', null, 'violet', 'gift', 'wide', 1),
  ('Buquê de balões', null, 'pink', 'balloons', 'small', 2),
  ('Cupcake', null, 'pink', 'cupcake', 'small', 3),
  ('Bolo de aniversário', null, 'violet', 'cake', 'portrait', 4),
  ('Feliz aniversário!', 'Feliz aniversário!', 'violet', 'mascot', 'portrait', 5);
