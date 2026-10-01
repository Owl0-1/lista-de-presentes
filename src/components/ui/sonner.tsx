"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const resolvedTheme =
    theme === "light" || theme === "dark" || theme === "system" ? theme : "system"

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      icons={{
        success: <span className="inline-block size-3 border-2 border-[#120c28] bg-[#5dffb0]" />,
        info: <span className="inline-block size-3 border-2 border-[#120c28] bg-[#ffe14a]" />,
        warning: <span className="inline-block size-3 border-2 border-[#120c28] bg-[#ffe14a]" />,
        error: <span className="inline-block size-3 border-2 border-[#120c28] bg-[#ff4f8b]" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--pixel-panel)",
          "--normal-text": "var(--pixel-ink)",
          "--normal-border": "var(--pixel-violet)",
          "--border-radius": "0px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
