const priceFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function formatPrice(cents: number) {
  return priceFormat.format(cents / 100)
}
