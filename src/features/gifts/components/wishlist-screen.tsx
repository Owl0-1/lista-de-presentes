"use client"

import { useState } from "react"
import { AddGiftDialog } from "@/features/gifts/components/add-gift-dialog"
import { HostAvatar } from "@/features/gifts/components/host-avatar"
import { GiftList } from "@/features/gifts/components/gift-list"
import { ReserveDialog } from "@/features/gifts/components/reserve-dialog"
import { wishlistCopy } from "@/features/gifts/copy"
import { useGifts } from "@/features/gifts/hooks/use-gifts"
import type { Gift } from "@/features/gifts/types"

export function WishlistScreen() {
  const giftsQuery = useGifts()
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)
  const gifts = giftsQuery.data ?? []
  const currentGift = gifts.find((gift) => gift.id === selectedGift?.id) ?? null
  const reservedCount = gifts.filter((gift) => gift.isReserved).length
  const hostLine =
    gifts.length === 0
      ? wishlistCopy.lineEmpty
      : reservedCount === 0
        ? wishlistCopy.lineFresh
        : reservedCount === gifts.length
          ? wishlistCopy.lineDone
          : wishlistCopy.lineProgress

  return (
    <div className="pixel-screen flex flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <main className="pixel-frame mx-auto w-full max-w-3xl p-4 sm:p-6">
        <section
          className="flex gap-3 border-4 border-[var(--pixel-line)] bg-[var(--pixel-slot)] p-3 shadow-[4px_4px_0_var(--pixel-line)]"
          aria-label={wishlistCopy.speaker}
        >
          <div className="shrink-0 border-4 border-[var(--pixel-line)] bg-[#241448] p-1">
            <HostAvatar />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="font-display text-[0.7rem] leading-[1.8] text-[var(--pixel-gold)] sm:text-xs">
              {wishlistCopy.speaker}
            </p>
            <p className="mt-2 max-w-[38rem] text-base leading-relaxed text-[var(--pixel-ink)]">
              {hostLine}
              <span
                aria-hidden="true"
                className="pixel-cursor ml-2 inline-block h-3.5 w-2.5 bg-[var(--pixel-gold)] align-middle"
              />
            </p>
          </div>
        </section>
        <header className="mt-5 flex flex-col gap-4 border-b-4 border-[var(--pixel-line)] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-[0.7rem] leading-[1.8] text-balance sm:text-xs">
              {wishlistCopy.title}
            </h1>
            {gifts.length > 0 ? (
              <p className="mt-3 flex flex-wrap items-center gap-2 text-base text-[var(--pixel-gold)]">
                <span>{wishlistCopy.quest}</span>
                <span className="flex gap-1" aria-hidden="true">
                  {gifts.map((gift) => (
                    <span
                      key={gift.id}
                      className={
                        gift.isReserved
                          ? "size-3 border-2 border-[var(--pixel-line)] bg-[var(--pixel-mint)]"
                          : "size-3 border-2 border-[var(--pixel-line)] bg-[var(--pixel-bg)]"
                      }
                    />
                  ))}
                </span>
                <span>
                  {reservedCount}/{gifts.length}
                </span>
              </p>
            ) : null}
          </div>
          <AddGiftDialog />
        </header>
        <GiftList
          gifts={gifts}
          isLoading={giftsQuery.isPending && gifts.length === 0}
          errorMessage={giftsQuery.isError ? wishlistCopy.loadError : null}
          onRetry={() => void giftsQuery.refetch()}
          onSelect={setSelectedGift}
        />
      </main>
      <ReserveDialog
        gift={currentGift}
        onOpenChange={(open) => {
          if (!open) setSelectedGift(null)
        }}
      />
    </div>
  )
}
