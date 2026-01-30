import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MAX_PAGINATION } from "@/constants";
import type { BuukiaPayout, UpdatePayoutBody } from "@/types";

import { payoutQueryKeys } from "./payouts-query-keys";

export function useUpdatePayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePayoutBody) => {
      const response = await fetch(`/api/payouts/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response.json();
    },
    onMutate: async (payout) => {
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
            if (item.id === payout.id) {
              return {
                ...payout,
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
