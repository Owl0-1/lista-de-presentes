"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { forgetMyReservation, rememberMyReservation } from "@/features/gifts/my-reservations"
import { createSeedGifts } from "@/features/gifts/seed"
import type { CreateGiftInput, Gift } from "@/features/gifts/types"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { createGift, listGifts, releaseGift, reserveGift } from "@/services/gifts"

export const giftQueryKey = ["gifts"] as const

export function useGifts() {
  const configured = isSupabaseConfigured()

  return useQuery({
    queryKey: giftQueryKey,
    queryFn: listGifts,
    staleTime: configured ? 15_000 : Infinity,
    ...(configured ? {} : { initialData: createSeedGifts() }),
  })
}

export function useCreateGift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateGiftInput) => createGift(input),
    onSuccess: async (gift) => {
      queryClient.setQueryData<Gift[]>(giftQueryKey, (current) =>
        [...(current ?? []), gift].sort((left, right) => left.sortOrder - right.sortOrder),
      )
    },
  })
}

export function useReserveGift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, buyerName }: { id: string; buyerName: string }) =>
      reserveGift(id, buyerName),
    onSuccess: async ({ gift, releaseToken }) => {
      rememberMyReservation(gift.id, releaseToken)
      queryClient.setQueryData<Gift[]>(giftQueryKey, (current) =>
        (current ?? []).map((item) => (item.id === gift.id ? gift : item)),
      )
    },
  })
}

export function useReleaseGift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, releaseToken }: { id: string; releaseToken: string }) =>
      releaseGift(id, releaseToken),
    onSuccess: async (gift) => {
      forgetMyReservation(gift.id)
      queryClient.setQueryData<Gift[]>(giftQueryKey, (current) =>
        (current ?? []).map((item) => (item.id === gift.id ? gift : item)),
      )
    },
  })
}
