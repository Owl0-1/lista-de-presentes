const priceFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function formatPrice(cents: number) {
  return priceFormat.format(cents / 100)
}

export function parsePriceToCents(raw: string) {
  const compact = raw.trim().replace(/\s/g, "")
  if (compact.length === 0) return null

  const normalized = compact.includes(",")
    ? compact.replace(/\./g, "").replace(",", ".")
    : compact

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null

  const value = Number(normalized)
  if (!Number.isFinite(value) || value <= 0 || value > 100_000) return null

  return Math.round(value * 100)
}

export function parseHttpUrl(raw: string) {
  const trimmed = raw.trim()
  if (trimmed.length === 0 || trimmed.length > 2000) return null

  try {
    const url = new URL(trimmed)
    if (url.protocol !== "http:" && url.protocol !== "https:") return null
    return url.toString()
  } catch {
    return null
  }
}
