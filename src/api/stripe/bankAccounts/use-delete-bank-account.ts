import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MAX_PAGINATION } from "@/constants";
import type { StripeBankAccount, StripePagination } from "scripts/mocksStripe";

import { bankAccountQueryKeys } from "./bank-accounts-query-keys";

export function useDeleteBankAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { customerId: string; bankAccountId: string }) => {
      const response = await fetch(
        `/v1/customers/${data.customerId}/sources/${data.bankAccountId}`,
        {
          method: "DELETE",
        },
      );

      return response.json();
    },
    onMutate: async (data: { customerId: string; bankAccountId: string }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: [...bankAccountQueryKeys.all, MAX_PAGINATION, ""],
      });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<
        StripePagination<StripeBankAccount>
      >([...bankAccountQueryKeys.all, MAX_PAGINATION, ""]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        [...bankAccountQueryKeys.all, MAX_PAGINATION, ""],
        (old: StripePagination<StripeBankAccount> | undefined) => ({
          ...old,
          data: [...(old?.data || [])].filter(
            (item) => item.id !== data.bankAccountId,
          ),
        }),
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(bankAccountQueryKeys.detail(data.id), data);
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(
          [...bankAccountQueryKeys.all, MAX_PAGINATION, ""],
          context.previousItems,
        );
      }
    },
  });
}
