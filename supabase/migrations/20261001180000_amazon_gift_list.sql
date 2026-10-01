delete from public.gifts
where title in (
  'Cafeteira elétrica',
  'Jogo de panelas',
  'Jogo de cama casal',
  'Conjunto de taças',
  'Jogo de toalhas',
  'Teste item'
);

insert into public.gifts (title, product_url, price_cents, sort_order)
select title, product_url, price_cents, sort_order
from (
  values
    ('Sagittarius Seiya FiguartsZERO'::text, 'https://www.amazon.com.br/dp/B0D2KH7C7K'::text, 228986, 0),
    ('Psicologia Forense'::text, 'https://www.amazon.com.br/dp/8536324309'::text, 24108, 1),
    ('Avaliação Psicológica no Contexto Forense'::text, 'https://www.amazon.com.br/dp/8582715943'::text, 15780, 2),
    ('Freud: Neurose, psicose, perversão'::text, 'https://www.amazon.com.br/dp/8582179855'::text, 6482, 3),
    ('Freud: Inibição, sintoma e angústia'::text, 'https://www.amazon.com.br/dp/6559287645'::text, 6833, 4),
    ('iPad Air 13" 128 GB'::text, 'https://www.amazon.com.br/dp/B0DZK3VZVH'::text, 799990, 5),
    ('Baralho Black à prova d''água'::text, 'https://www.amazon.com.br/dp/B0FGKS1VTY'::text, 4390, 6),
    ('Bicicleta ergométrica spinning'::text, 'https://www.amazon.com.br/dp/B0FDS8R6DW'::text, 85394, 7),
    ('Sauvage Dior Eau de Parfum 200ml'::text, 'https://www.amazon.com.br/dp/B07PHSB4L9'::text, 108196, 8),
    ('Kindle Paperwhite 16 GB'::text, 'https://www.amazon.com.br/dp/B0CFPL6CFY'::text, 100957, 9),
    ('Relógio Casio LTP-V007L-9B'::text, 'https://www.amazon.com.br/dp/B08DJ1F7XH'::text, 23339, 10)
) as seed(title, product_url, price_cents, sort_order)
where not exists (
  select 1 from public.gifts where gifts.product_url = seed.product_url
);

update public.gifts as gifts
set image_url = seed.image_url
from (
  values
    ('https://www.amazon.com.br/dp/B0D2KH7C7K'::text, 'https://m.media-amazon.com/images/I/717Txp6IwXL._AC_SL500_.jpg'::text),
    ('https://www.amazon.com.br/dp/8536324309'::text, 'https://m.media-amazon.com/images/I/91wAysoZqML._SL500_.jpg'::text),
    ('https://www.amazon.com.br/dp/8582715943'::text, 'https://m.media-amazon.com/images/I/81q1fktIVuL._SL500_.jpg'::text),
    ('https://www.amazon.com.br/dp/8582179855'::text, 'https://m.media-amazon.com/images/I/51AYcW75IAL._SL500_.jpg'::text),
    ('https://www.amazon.com.br/dp/6559287645'::text, 'https://m.media-amazon.com/images/I/71-lPLMJltL._SL500_.jpg'::text),
    ('https://www.amazon.com.br/dp/B0DZK3VZVH'::text, 'https://m.media-amazon.com/images/I/51q7uCdqy2L._AC_SL500_.jpg'::text),
    ('https://www.amazon.com.br/dp/B0FGKS1VTY'::text, 'https://m.media-amazon.com/images/I/616maN3Gt0L._AC_SL500_.jpg'::text),
    ('https://www.amazon.com.br/dp/B0FDS8R6DW'::text, 'https://m.media-amazon.com/images/I/61ln+QG9IML._AC_SL500_.jpg'::text),
    ('https://www.amazon.com.br/dp/B07PHSB4L9'::text, 'https://m.media-amazon.com/images/I/61YGnWUxG0L._AC_SL500_.jpg'::text),
    ('https://www.amazon.com.br/dp/B0CFPL6CFY'::text, 'https://m.media-amazon.com/images/I/81-vCHKJb1L._AC_SL500_.jpg'::text),
    ('https://www.amazon.com.br/dp/B08DJ1F7XH'::text, 'https://m.media-amazon.com/images/I/51mge8lyG7L._AC_SL500_.jpg'::text)
) as seed(product_url, image_url)
where gifts.product_url = seed.product_url
  and gifts.image_url is null;
