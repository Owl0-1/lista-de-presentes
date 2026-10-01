import { cn } from "@/lib/utils"

const palette = {
  k: "#120c28",
  h: "#2a1848",
  H: "#7a6cff",
  s: "#ffc9a3",
  b: "#ff8fb8",
  e: "#1a1230",
  w: "#f6f1ff",
  v: "#6a5cff",
  d: "#4636b8",
  g: "#ffe14a",
  m: "#5dffb0",
  c: "#1a1230",
} as const

const sprite = [
  "........kkkkkkkk........",
  "......kkhhhhhhhhkk......",
  ".....khhhhhhhhhhhk......",
  "....khhhHhhhhhhHhhhk....",
  "....khsssssssssssshk....",
  "....khssewwsssewwshk....",
  "....khssessssssesshk....",
  "....khsssssssssssshk....",
  "....khsssskkkksssshk....",
  "....khsbbssssssbbshk....",
  "....kksssssssssssskk....",
  ".....kssssssssssssk.....",
  "......kkkkkkkkkkkk......",
  "......kvvvvvvvvvvk......",
  ".....kvvvvggggvvvvk.....",
  "....kvvvvvvvvvvvvvvk....",
  "....kvvdvvvvvvvdvvvk....",
  "....kvvmmvvvvvvmmvvk....",
  "....kvvvvvvvvvvvvvvk....",
  ".....kkkkkkkkkkkkkk.....",
]

type Pixel = keyof typeof palette

export function HostAvatar({
  className,
  animated = true,
}: {
  className?: string
  animated?: boolean
}) {
  const width = sprite[0]?.length ?? 0

  return (
    <svg
      viewBox={`0 0 ${width} ${sprite.length}`}
      className={cn("block size-24 sm:size-28", animated && "pixel-bob", className)}
      aria-hidden="true"
    >
      {sprite.flatMap((row, y) =>
        [...row].flatMap((cell, x) => {
          if (cell === "." || !(cell in palette)) return []
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={palette[cell as Pixel]}
            />
          )
        }),
      )}
    </svg>
  )
}
