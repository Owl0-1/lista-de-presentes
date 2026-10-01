import { parseHttpUrl, parsePriceToCents } from "@/features/gifts/format"
import { createSeedGifts, productImageUrl } from "@/features/gifts/seed"
import type { CreateGiftInput, Gift } from "@/features/gifts/types"
import {
  createSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client"

const GIFT_COLUMNS =
  "id, title, image_url, product_url, price_cents, sort_order, created_at, is_reserved"

const replacedTitles = new Set([
  "Cafeteira elétrica",
  "Jogo de panelas",
  "Jogo de cama casal",
  "Conjunto de taças",
  "Jogo de toalhas",
  "Teste item",
])

type LocalGift = Gift & { reservationToken: string | null }

let localGifts: LocalGift[] = createSeedGifts().map((gift) => ({
  ...gift,
  reservationToken: null,
}))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function readString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Campo inválido: ${field}`)
  }
  return value
}

function readOptionalString(value: unknown) {
  if (value === null || value === undefined) return null
  if (typeof value !== "string") {
    throw new Error("Campo inválido")
  }
  const trimmed = value.trim()
  return trimmed.length === 0 ? null : trimmed
}

function readNumber(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error("Ordem inválida")
  }
  return value
}

function readOptionalCents(value: unknown) {
  if (value === null || value === undefined) return null
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error("Valor inválido")
  }
  return value
}

function readBoolean(value: unknown) {
  return value === true
}

export function parseGift(value: unknown): Gift {
  if (!isRecord(value)) {
    throw new Error("Presente inválido")
  }

  return {
    id: readString(value.id, "id"),
    title: readString(value.title, "title"),
    imageUrl: readOptionalString(value.image_url),
    productUrl: readOptionalString(value.product_url),
    priceCents: readOptionalCents(value.price_cents),
    sortOrder: readNumber(value.sort_order),
    isReserved: readBoolean(value.is_reserved),
    createdAt: readString(value.created_at, "created_at"),
  }
}

function toPublicGift(gift: LocalGift): Gift {
  const { reservationToken: _token, ...publicGift } = gift
  return publicGift
}

function sortedLocalGifts() {
  return [...localGifts].sort((left, right) => left.sortOrder - right.sortOrder)
}

export async function listGifts(): Promise<Gift[]> {
  if (!isSupabaseConfigured()) {
    return sortedLocalGifts().map(toPublicGift)
  }

  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("gifts")
    .select(GIFT_COLUMNS)
    .order("sort_order", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  if (!Array.isArray(data)) {
    throw new Error("Resposta inválida")
  }

  return data
    .map(parseGift)
    .filter((gift) => !replacedTitles.has(gift.title))
    .map((gift) =>
      gift.imageUrl ? gift : { ...gift, imageUrl: productImageUrl(gift.productUrl) },
    )
}

async function nextSortOrder() {
  if (!isSupabaseConfigured()) {
    return localGifts.reduce((max, gift) => Math.max(max, gift.sortOrder), -1) + 1
  }

  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("gifts")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)

  if (error) {
    throw new Error(error.message)
  }

  if (!Array.isArray(data) || data.length === 0) {
    return 0
  }

  const first = data[0]
  if (!isRecord(first)) {
    return 0
  }

  return readNumber(first.sort_order) + 1
}

export async function createGift(input: CreateGiftInput): Promise<Gift> {
  const title = input.title.trim()
  const imageUrl = parseHttpUrl(input.imageUrl)
  const productUrl = parseHttpUrl(input.productUrl)
  const priceCents = Number.isInteger(input.priceCents)
    ? input.priceCents
    : parsePriceToCents(String(input.priceCents))

  if (title.length === 0 || title.length > 80) {
    throw new Error("Dê um nome ao presente")
  }

  if (priceCents === null || priceCents <= 0 || priceCents > 10_000_000) {
    throw new Error("Informe um valor válido")
  }

  if (!productUrl) {
    throw new Error("Informe o link da loja")
  }

  if (!imageUrl) {
    throw new Error("Informe o link da imagem")
  }

  const sortOrder = await nextSortOrder()
  const payload = {
    title,
    image_url: imageUrl,
    product_url: productUrl,
    price_cents: priceCents,
    sort_order: sortOrder,
  }

  if (!isSupabaseConfigured()) {
    const gift: LocalGift = {
      id: crypto.randomUUID(),
      title: payload.title,
      imageUrl: payload.image_url,
      productUrl: payload.product_url,
      priceCents: payload.price_cents,
      sortOrder: payload.sort_order,
      isReserved: false,
      reservationToken: null,
      createdAt: new Date().toISOString(),
    }
    localGifts = [...localGifts, gift]
    return toPublicGift(gift)
  }

  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("gifts")
    .insert(payload)
    .select(GIFT_COLUMNS)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return parseGift(data)
}

export type ReserveGiftResult = {
  gift: Gift
  releaseToken: string
}

export async function reserveGift(id: string, buyerName: string): Promise<ReserveGiftResult> {
  const trimmedName = buyerName.trim()

  if (trimmedName.length === 0 || trimmedName.length > 40) {
    throw new Error("Diga quem vai comprar")
  }

  if (!isSupabaseConfigured()) {
    const current = localGifts.find((gift) => gift.id === id)
    if (!current) {
      throw new Error("Presente não encontrado")
    }
    if (current.isReserved) {
      throw new Error("Presente indisponível")
    }
    const releaseToken = crypto.randomUUID()
    const updated: LocalGift = {
      ...current,
      isReserved: true,
      reservationToken: releaseToken,
    }
    localGifts = localGifts.map((gift) => (gift.id === id ? updated : gift))
    return { gift: toPublicGift(updated), releaseToken }
  }

  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase.rpc("reserve_gift", {
    p_gift_id: id,
    p_buyer_name: trimmedName,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (typeof data !== "string" || data.trim().length === 0) {
    throw new Error("Resposta inválida")
  }

  const releaseToken = data
  const { data: giftRow, error: fetchError } = await supabase
    .from("gifts")
    .select(GIFT_COLUMNS)
    .eq("id", id)
    .single()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  return { gift: parseGift(giftRow), releaseToken }
}

export async function releaseGift(id: string, releaseToken: string): Promise<Gift> {
  const token = releaseToken.trim()
  if (token.length === 0) {
    throw new Error("Não foi possível liberar")
  }

  if (!isSupabaseConfigured()) {
    const current = localGifts.find((gift) => gift.id === id)
    if (!current) {
      throw new Error("Presente não encontrado")
    }
    if (!current.isReserved || current.reservationToken !== token) {
      throw new Error("Não foi possível liberar")
    }
    const updated: LocalGift = {
      ...current,
      isReserved: false,
      reservationToken: null,
    }
    localGifts = localGifts.map((gift) => (gift.id === id ? updated : gift))
    return toPublicGift(updated)
  }

  const supabase = createSupabaseBrowserClient()
  const { error } = await supabase.rpc("release_gift", {
    p_gift_id: id,
    p_token: token,
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data: giftRow, error: fetchError } = await supabase
    .from("gifts")
    .select(GIFT_COLUMNS)
    .eq("id", id)
    .single()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  return parseGift(giftRow)
}
