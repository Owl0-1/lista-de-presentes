alter table public.gifts
  drop column if exists quote,
  drop column if exists tone,
  drop column if exists illustration,
  drop column if exists span;

alter table public.gifts
  add column if not exists image_url text,
  add column if not exists product_url text,
  add column if not exists price_cents integer;

alter table public.gifts
  drop constraint if exists gifts_image_url_length,
  drop constraint if exists gifts_product_url_length,
  drop constraint if exists gifts_price_cents_check;

alter table public.gifts
  add constraint gifts_image_url_length check (
    image_url is null or char_length(image_url) between 1 and 2000
  ),
  add constraint gifts_product_url_length check (
    product_url is null or char_length(product_url) between 1 and 2000
  ),
  add constraint gifts_price_cents_check check (
    price_cents is null or (price_cents > 0 and price_cents <= 10000000)
  );

delete from public.gifts
where title in (
  'Camisa da festa',
  'Presente surpresa',
  'Buquê de balões',
  'Cupcake',
  'Bolo de aniversário',
  'Feliz aniversário!'
);

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
