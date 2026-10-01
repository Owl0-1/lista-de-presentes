"use client"

import { ProductImage } from "@/features/gifts/components/product-image"
import { wishlistCopy } from "@/features/gifts/copy"
import { formatPrice } from "@/features/gifts/format"
import type { Gift } from "@/features/gifts/types"
import { cn } from "@/lib/utils"

export function GiftRow({
  gift,
  index,
  onSelect,
}: {
  gift: Gift
  index: number
  onSelect: (gift: Gift) => void
}) {
  const reservedLabel = gift.isReserved ? wishlistCopy.reserved : null

  return (
    <li
      className={cn(
        "flex gap-3 border-4 bg-[var(--pixel-slot)] p-3 shadow-[4px_4px_0_var(--pixel-line)]",
        gift.isReserved ? "border-[var(--pixel-mint)]" : "border-[var(--pixel-line)]",
      )}
    >
      <ProductImage
        src={gift.imageUrl}
        title={gift.title}
        className="size-[4.5rem] shrink-0 border-4 border-[var(--pixel-line)] sm:size-20"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-base text-[var(--pixel-gold)]">{String(index + 1).padStart(2, "0")}</p>
          <h2 className="text-base leading-snug text-balance sm:text-lg">{gift.title}</h2>
          {gift.productUrl ? (
            <a
              href={gift.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex text-base text-[var(--pixel-gold)] underline decoration-[var(--pixel-line)] underline-offset-4"
            >
              {wishlistCopy.viewProduct} {">>"}
            </a>
          ) : null}
          {reservedLabel ? (
            <p className="mt-2 text-base text-[var(--pixel-mint)]">{reservedLabel}</p>
          ) : null}
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:items-end">
          <p className="text-base text-[var(--pixel-gold)] tabular-nums">
            {gift.priceCents === null ? "—" : formatPrice(gift.priceCents)}
          </p>
          <button
            type="button"
            className={cn("pixel-btn w-full whitespace-nowrap sm:w-auto", gift.isReserved && "pixel-btn-quiet")}
            onClick={() => onSelect(gift)}
          >
            {gift.isReserved ? wishlistCopy.seeReservation : wishlistCopy.reserve}
          </button>
        </div>
      </div>
    </li>
  )
}
