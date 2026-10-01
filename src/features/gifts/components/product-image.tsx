"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function ProductImage({
  src,
  title,
  className,
}: {
  src: string | null
  title: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const showFallback = !src || failed

  return (
    <div className={cn("overflow-hidden bg-[var(--pixel-slot)]", className)}>
      {showFallback ? (
        <div className="flex size-full items-center justify-center text-base text-[var(--pixel-muted)]">
          <span aria-hidden="true">{title.slice(0, 1).toUpperCase() || "?"}</span>
        </div>
      ) : (
        // Product photos come from whatever store the guest pastes, so the host is not known ahead of time.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="block size-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
