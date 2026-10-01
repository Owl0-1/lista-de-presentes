delete from public.gifts
where title in (
  'Pinto de borracha',
  'zOLPIDEM',
  'Puteiro homossexual'
);

drop policy if exists "Anyone can add gifts" on public.gifts;

revoke insert on table public.gifts from anon, authenticated;
