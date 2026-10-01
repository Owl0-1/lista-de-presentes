import { cn } from "@/lib/utils"

const palette = {
  k: "#120c28",
  h: "#140e0c",
  H: "#3a2a22",
  s: "#8f5a3a",
  a: "#5a3824",
  l: "#d4a07a",
  f: "#2c1c14",
  p: "#a34a42",
  e: "#1a100c",
  w: "#fff8ee",
  n: "#3f2418",
  v: "#6a5cff",
  d: "#4636b8",
  g: "#ffe14a",
  m: "#5dffb0",
} as const

const sprite = [
  "........kkkkkkkk........",
  "......kkhhhhhhhhkk......",
  ".....khhHhhhhhhHhhk.....",
  "....khhhhhhhhhhhhhhk....",
  "....khhsssssssssshhk....",
  "....khsssssllssssshk....",
  "....khsshhhssshhhshk....",
  "....khsswewssswewshk....",
  "....khsssasssssasshk....",
  "....khsssslnlssssshk....",
  "....khssssannaassshk....",
  "....khsssffffffssshk....",
  "....khssssppppsssshk....",
  "....khssffffffffsshk....",
  "....kkhffffffffffhkk....",
  "......kkffffffffkk......",
  ".......kkkkkkkkk........",
  ".......kssssssssk.......",
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
      shapeRendering="crispEdges"
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
