import type { Gift } from "@/features/gifts/types"

const createdAt = "2026-01-01T00:00:00.000Z"

export function createSeedGifts(): Gift[] {
  return [
    {
      id: "00000000-0000-4000-8000-000000000001",
      title: "Cafeteira elétrica",
      imageUrl:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=480&h=480&q=80",
      productUrl: "https://www.magazineluiza.com.br/busca/cafeteira+eletrica/",
      priceCents: 24990,
      sortOrder: 0,
      isReserved: false,
      createdAt,
    },
    {
      id: "00000000-0000-4000-8000-000000000002",
      title: "Jogo de panelas",
      imageUrl:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=480&h=480&q=80",
      productUrl: "https://www.magazineluiza.com.br/busca/jogo+de+panelas/",
      priceCents: 39900,
      sortOrder: 1,
      isReserved: false,
      createdAt,
    },
    {
      id: "00000000-0000-4000-8000-000000000003",
      title: "Jogo de cama casal",
      imageUrl:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=480&h=480&q=80",
      productUrl: "https://www.magazineluiza.com.br/busca/jogo+de+cama+casal/",
      priceCents: 28990,
      sortOrder: 2,
      isReserved: false,
      createdAt,
    },
    {
      id: "00000000-0000-4000-8000-000000000004",
      title: "Conjunto de taças",
      imageUrl:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=480&h=480&q=80",
      productUrl: "https://www.magazineluiza.com.br/busca/conjunto+de+tacas/",
      priceCents: 12990,
      sortOrder: 3,
      isReserved: false,
      createdAt,
    },
    {
      id: "00000000-0000-4000-8000-000000000005",
      title: "Jogo de toalhas",
      imageUrl:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=480&h=480&q=80",
      productUrl: "https://www.magazineluiza.com.br/busca/jogo+de+toalhas/",
      priceCents: 15990,
      sortOrder: 4,
      isReserved: false,
      createdAt,
    },
  ]
}
