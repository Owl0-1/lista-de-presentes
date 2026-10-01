"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HostAvatar } from "@/features/gifts/components/host-avatar"
import { ProductImage } from "@/features/gifts/components/product-image"
import { wishlistCopy } from "@/features/gifts/copy"
import { getMyReservationToken, isMyReservation } from "@/features/gifts/my-reservations"
import { formatPrice } from "@/features/gifts/format"
import { useReleaseGift, useReserveGift } from "@/features/gifts/hooks/use-gifts"
import type { Gift } from "@/features/gifts/types"

export function ReserveDialog({
  gift,
  onOpenChange,
}: {
  gift: Gift | null
  onOpenChange: (open: boolean) => void
}) {
  const [buyerName, setBuyerName] = useState("")
  const [shownGift, setShownGift] = useState<Gift | null>(null)
  const reserveGift = useReserveGift()
  const releaseGift = useReleaseGift()
  const pending = reserveGift.isPending || releaseGift.isPending
  const activeGift = gift ?? shownGift
  const mine =
    activeGift !== null && isMyReservation(activeGift.id, activeGift.isReserved)

  if (
    gift &&
    (shownGift?.id !== gift.id ||
      shownGift?.isReserved !== gift.isReserved ||
      shownGift?.title !== gift.title)
  ) {
    setShownGift(gift)
  }

  async function handleReserve(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activeGift) return

    try {
      await reserveGift.mutateAsync({ id: activeGift.id, buyerName })
      setBuyerName("")
      onOpenChange(false)
      toast.success("Presente marcado")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível marcar"
      toast.error(message)
    }
  }

  async function handleRelease() {
    if (!activeGift) return

    const releaseToken = getMyReservationToken(activeGift.id)
    if (!releaseToken) {
      toast.error("Não foi possível desmarcar")
      return
    }

    try {
      await releaseGift.mutateAsync({ id: activeGift.id, releaseToken })
      onOpenChange(false)
      toast.success("Marcação removida")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível desmarcar"
      toast.error(message)
    }
  }

  return (
    <Dialog
      open={gift !== null}
      onOpenChange={(open) => {
        if (!open) setBuyerName("")
        onOpenChange(open)
      }}
    >
      <DialogContent className="pixel-window sm:max-w-md" showCloseButton={false}>
        {activeGift ? (
          <>
            <DialogHeader>
              <DialogTitle>{activeGift.title}</DialogTitle>
            </DialogHeader>
            <div className="flex gap-3">
              <HostAvatar animated={false} className="size-16 sm:size-16" />
              <div className="min-w-0">
                <p className="font-display text-[0.7rem] leading-[1.8] text-[var(--pixel-gold)]">
                  {wishlistCopy.speaker}
                </p>
                <DialogDescription className="mt-2">
                  {activeGift.isReserved
                    ? mine
                      ? wishlistCopy.reservedByYou
                      : wishlistCopy.reservedTalk
                    : wishlistCopy.reserveTalk}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-3 border-4 border-[var(--pixel-line)] bg-[var(--pixel-slot)] p-3">
              <ProductImage
                src={activeGift.imageUrl}
                title={activeGift.title}
                className="size-16 shrink-0 border-4 border-[var(--pixel-line)]"
              />
              <div className="min-w-0">
                <p className="text-base text-[var(--pixel-gold)] tabular-nums">
                  {activeGift.priceCents === null ? "—" : formatPrice(activeGift.priceCents)}
                </p>
                {activeGift.productUrl ? (
                  <a
                    href={activeGift.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex text-base text-[var(--pixel-gold)] underline decoration-[var(--pixel-line)] underline-offset-4"
                  >
                    {wishlistCopy.viewProduct} {">>"}
                  </a>
                ) : null}
              </div>
            </div>
            {activeGift.isReserved ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <DialogClose className="pixel-btn pixel-btn-quiet w-full sm:w-auto">
                  {wishlistCopy.back}
                </DialogClose>
                {mine ? (
                  <button
                    type="button"
                    className="pixel-btn w-full sm:w-auto"
                    disabled={pending}
                    onClick={() => void handleRelease()}
                  >
                    {pending ? wishlistCopy.saving : wishlistCopy.release}
                  </button>
                ) : null}
              </div>
            ) : (
              <form className="grid gap-4" onSubmit={(event) => void handleReserve(event)}>
                <div className="grid gap-2">
                  <Label htmlFor="buyer-name">Seu nome</Label>
                  <Input
                    id="buyer-name"
                    value={buyerName}
                    autoComplete="name"
                    maxLength={40}
                    required
                    onChange={(event) => setBuyerName(event.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <DialogClose className="pixel-btn pixel-btn-quiet w-full sm:w-auto">
                    {wishlistCopy.back}
                  </DialogClose>
                  <button type="submit" className="pixel-btn w-full sm:w-auto" disabled={pending}>
                    {pending ? wishlistCopy.saving : wishlistCopy.confirm}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
