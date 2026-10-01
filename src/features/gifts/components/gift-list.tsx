import { GiftRow } from "@/features/gifts/components/gift-row"
import { wishlistCopy } from "@/features/gifts/copy"
import type { Gift } from "@/features/gifts/types"

export function GiftList({
  gifts,
  isLoading,
  errorMessage,
  onRetry,
  onSelect,
}: {
  gifts: Gift[]
  isLoading: boolean
  errorMessage: string | null
  onRetry: () => void
  onSelect: (gift: Gift) => void
}) {
  if (isLoading) {
    return (
      <ul className="mt-5 grid gap-4" aria-busy="true" aria-label={wishlistCopy.title}>
        {Array.from({ length: 4 }, (_, index) => (
          <li
            key={index}
            className="flex gap-3 border-4 border-[var(--pixel-line)] bg-[var(--pixel-slot)] p-3"
          >
            <div className="size-[4.5rem] border-4 border-[var(--pixel-line)] bg-[var(--pixel-panel)]" />
            <div className="flex flex-1 flex-col justify-center gap-3">
              <div className="h-4 w-40 bg-[var(--pixel-panel)]" />
              <div className="h-4 w-24 bg-[var(--pixel-panel)]" />
            </div>
          </li>
        ))}
      </ul>
    )
  }

  if (errorMessage) {
    return (
      <div className="mt-6 flex flex-col items-start gap-4">
        <p>{errorMessage}</p>
        <button type="button" className="pixel-btn" onClick={onRetry}>
          {wishlistCopy.retry}
        </button>
      </div>
    )
  }

  if (gifts.length === 0) {
    return <p className="mt-6 text-base text-[var(--pixel-muted)]">{wishlistCopy.empty}</p>
  }

  return (
    <ul className="mt-5 grid gap-4" aria-label={wishlistCopy.title}>
      {gifts.map((gift, index) => (
        <GiftRow key={gift.id} gift={gift} index={index} onSelect={onSelect} />
      ))}
    </ul>
  )
}
