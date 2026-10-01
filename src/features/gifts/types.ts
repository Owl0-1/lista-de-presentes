export type Gift = {
  id: string
  title: string
  imageUrl: string | null
  productUrl: string | null
  priceCents: number | null
  sortOrder: number
  isReserved: boolean
  createdAt: string
}

export type CreateGiftInput = {
  title: string
  imageUrl: string
  productUrl: string
  priceCents: number
}
