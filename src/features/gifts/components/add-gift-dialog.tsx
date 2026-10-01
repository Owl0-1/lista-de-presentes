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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductImage } from "@/features/gifts/components/product-image"
import { wishlistCopy } from "@/features/gifts/copy"
import { parseHttpUrl, parsePriceToCents } from "@/features/gifts/format"
import { useCreateGift } from "@/features/gifts/hooks/use-gifts"

export function AddGiftDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [productUrl, setProductUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const createGift = useCreateGift()
  const imagePreview = parseHttpUrl(imageUrl)

  function resetForm() {
    setTitle("")
    setPrice("")
    setProductUrl("")
    setImageUrl("")
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const priceCents = parsePriceToCents(price)
    const parsedProductUrl = parseHttpUrl(productUrl)
    const parsedImageUrl = parseHttpUrl(imageUrl)

    if (priceCents === null) {
      toast.error("Informe um valor válido")
      return
    }

    if (!parsedProductUrl) {
      toast.error("Informe o link da loja")
      return
    }

    if (!parsedImageUrl) {
      toast.error("Informe o link da imagem")
      return
    }

    try {
      await createGift.mutateAsync({
        title,
        priceCents,
        productUrl: parsedProductUrl,
        imageUrl: parsedImageUrl,
      })
      resetForm()
      setOpen(false)
      toast.success("Presente adicionado")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar"
      toast.error(message)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) resetForm()
      }}
    >
      <DialogTrigger className="pixel-btn w-full sm:w-auto">
        {wishlistCopy.add}
      </DialogTrigger>
      <DialogContent className="pixel-window sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{wishlistCopy.add}</DialogTitle>
          <DialogDescription>{wishlistCopy.addTalk}</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
          <div className="grid gap-2">
            <Label htmlFor="gift-title">Nome</Label>
            <Input
              id="gift-title"
              value={title}
              maxLength={80}
              required
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gift-price">Valor</Label>
            <Input
              id="gift-price"
              value={price}
              inputMode="decimal"
              placeholder="249,90"
              required
              onChange={(event) => setPrice(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gift-link">Link da loja</Label>
            <Input
              id="gift-link"
              type="url"
              value={productUrl}
              placeholder="https://"
              required
              onChange={(event) => setProductUrl(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gift-image">Link da imagem</Label>
            <Input
              id="gift-image"
              type="url"
              value={imageUrl}
              placeholder="https://"
              required
              onChange={(event) => setImageUrl(event.target.value)}
            />
            {imagePreview ? (
              <ProductImage
                src={imagePreview}
                title={title || "Prévia"}
                className="size-16 border-4 border-[var(--pixel-line)]"
              />
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <DialogClose className="pixel-btn pixel-btn-quiet w-full sm:w-auto">
              {wishlistCopy.back}
            </DialogClose>
            <button type="submit" className="pixel-btn w-full sm:w-auto" disabled={createGift.isPending}>
              {createGift.isPending ? wishlistCopy.saving : wishlistCopy.save}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
