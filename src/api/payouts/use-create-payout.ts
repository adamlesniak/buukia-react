import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MAX_PAGINATION } from "@/constants";
import type { BuukiaPayout, CreatePayoutBody } from "@/types";

import { payoutQueryKeys } from "./payouts-query-keys";

export function useCreatePayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePayoutBody) => {
      const response = await fetch(`/api/payouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response.json();
    },
    onMutate: async (newItem: CreatePayoutBody) => {

      const item = {
        id: "current-payout",
        amount: newItem.amount,
        currency: "EUR",
        description: newItem.description,
        provider: "stripe",
        sourceId: "",
        sourceType: "bank_account",
        status: "pending",
        createdAt: new Date().toISOString(),
        arrivalDate: "",
        type: "card",
      } as BuukiaPayout;

      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: [...payoutQueryKeys.all, MAX_PAGINATION, ""],
      });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<BuukiaPayout[]>([
        ...payoutQueryKeys.all,
        MAX_PAGINATION,
        "",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        [...payoutQueryKeys.all, MAX_PAGINATION, ""],
        (old: BuukiaPayout[]) => [item, ...(old || [])],
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(payoutQueryKeys.detail(data.id), data);
      queryClient.setQueryData<BuukiaPayout[]>(
        [...payoutQueryKeys.all, MAX_PAGINATION, ""],
        (old: BuukiaPayout[] | undefined) =>
          [...(old || [])].map((item) => {
            if (item.id === "current-payout") {
              return data;
            }

            return item;
          }),
      );
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(
          [...payoutQueryKeys.all, MAX_PAGINATION, ""],
          context.previousItems,
        );
      }
    },
  });
}
