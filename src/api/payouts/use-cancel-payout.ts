import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MAX_PAGINATION } from "@/constants";
import type { BuukiaPayout } from "@/types";
import { PayoutStatus } from "@/utils";

import { payoutQueryKeys } from "./payouts-query-keys";

export function useCancelPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payoutId: string) => {
      const response = await fetch(`/api/payouts/${payoutId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.json();
    },
    onMutate: async (payoutId) => {
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
        (old: BuukiaPayout[]) =>
          [...(old || [])].map((item) => {
            if (item.id === payoutId) {
              return {
                ...item,
                status: PayoutStatus.Canceled,
              };
            }

            return item;
          }),
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(payoutQueryKeys.detail(data.id), data);
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
