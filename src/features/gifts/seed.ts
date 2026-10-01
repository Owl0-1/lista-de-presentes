import type { Gift } from "@/features/gifts/types"

const createdAt = "2026-01-01T00:00:00.000Z"

const products: Array<Pick<Gift, "title" | "productUrl" | "priceCents" | "imageUrl">> = [
  {
    title: "Sagittarius Seiya FiguartsZERO",
    productUrl: "https://www.amazon.com.br/dp/B0D2KH7C7K",
    priceCents: 228986,
    imageUrl: "https://m.media-amazon.com/images/I/717Txp6IwXL._AC_SL500_.jpg",
  },
  {
    title: "Psicologia Forense",
    productUrl: "https://www.amazon.com.br/dp/8536324309",
    priceCents: 24108,
    imageUrl: "https://m.media-amazon.com/images/I/91wAysoZqML._SL500_.jpg",
  },
  {
    title: "Avaliação Psicológica no Contexto Forense",
    productUrl: "https://www.amazon.com.br/dp/8582715943",
    priceCents: 15780,
    imageUrl: "https://m.media-amazon.com/images/I/81q1fktIVuL._SL500_.jpg",
  },
  {
    title: "Freud: Neurose, psicose, perversão",
    productUrl: "https://www.amazon.com.br/dp/8582179855",
    priceCents: 6482,
    imageUrl: "https://m.media-amazon.com/images/I/51AYcW75IAL._SL500_.jpg",
  },
  {
    title: "Freud: Inibição, sintoma e angústia",
    productUrl: "https://www.amazon.com.br/dp/6559287645",
    priceCents: 6833,
    imageUrl: "https://m.media-amazon.com/images/I/71-lPLMJltL._SL500_.jpg",
  },
  {
    title: "iPad Air 13\" 128 GB",
    productUrl: "https://www.amazon.com.br/dp/B0DZK3VZVH",
    priceCents: 799990,
    imageUrl: "https://m.media-amazon.com/images/I/51q7uCdqy2L._AC_SL500_.jpg",
  },
  {
    title: "Baralho Black à prova d'água",
    productUrl: "https://www.amazon.com.br/dp/B0FGKS1VTY",
    priceCents: 4390,
    imageUrl: "https://m.media-amazon.com/images/I/616maN3Gt0L._AC_SL500_.jpg",
  },
  {
    title: "Bicicleta ergométrica spinning",
    productUrl: "https://www.amazon.com.br/dp/B0FDS8R6DW",
    priceCents: 85394,
    imageUrl: "https://m.media-amazon.com/images/I/61ln+QG9IML._AC_SL500_.jpg",
  },
  {
    title: "Sauvage Dior Eau de Parfum 200ml",
    productUrl: "https://www.amazon.com.br/dp/B07PHSB4L9",
    priceCents: 108196,
    imageUrl: "https://m.media-amazon.com/images/I/61YGnWUxG0L._AC_SL500_.jpg",
  },
  {
    title: "Kindle Paperwhite 16 GB",
    productUrl: "https://www.amazon.com.br/dp/B0CFPL6CFY",
    priceCents: 100957,
    imageUrl: "https://m.media-amazon.com/images/I/81-vCHKJb1L._AC_SL500_.jpg",
  },
  {
    title: "Relógio Casio LTP-V007L-9B",
    productUrl: "https://www.amazon.com.br/dp/B08DJ1F7XH",
    priceCents: 23339,
    imageUrl: "https://m.media-amazon.com/images/I/51mge8lyG7L._AC_SL500_.jpg",
  },
]

export function productImageUrl(productUrl: string | null) {
  if (!productUrl) return null
  return products.find((product) => product.productUrl === productUrl)?.imageUrl ?? null
}

export function createSeedGifts(): Gift[] {
  return products.map((product, index) => ({
    id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    title: product.title,
    imageUrl: product.imageUrl,
    productUrl: product.productUrl,
    priceCents: product.priceCents,
    sortOrder: index,
    isReserved: false,
    createdAt,
  }))
}
