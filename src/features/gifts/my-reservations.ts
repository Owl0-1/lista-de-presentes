const STORAGE_KEY = "wishlist-my-reservation-tokens"

type ReservationMap = Record<string, string>

function readMap(): ReservationMap {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null) return {}
    const map: ReservationMap = {}
    for (const [giftId, token] of Object.entries(parsed)) {
      if (typeof token === "string" && token.trim().length > 0) {
        map[giftId] = token.trim()
      }
    }
    return map
  } catch {
    return {}
  }
}

function writeMap(map: ReservationMap) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function rememberMyReservation(giftId: string, releaseToken: string) {
  const map = readMap()
  map[giftId] = releaseToken.trim()
  writeMap(map)
}

export function forgetMyReservation(giftId: string) {
  const map = readMap()
  delete map[giftId]
  writeMap(map)
}

export function getMyReservationToken(giftId: string): string | null {
  return readMap()[giftId] ?? null
}

export function isMyReservation(giftId: string, isReserved: boolean): boolean {
  if (!isReserved) return false
  return getMyReservationToken(giftId) !== null
}
