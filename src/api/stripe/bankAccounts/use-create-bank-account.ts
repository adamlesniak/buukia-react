import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MAX_PAGINATION } from "@/constants";
import type {
  CreateStripeBankAccountBody,
  StripeBankAccount,
  StripePagination,
} from "@/types";

import { bankAccountQueryKeys } from "./bank-accounts-query-keys";

export function useCreateBankAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateStripeBankAccountBody & { customer_id: string },
    ) => {
      const response = await fetch(
        `/v1/customers/${data.customer_id}/sources`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to create bank account");
      }

      return response.json();
    },
    onMutate: async (newBankAccount) => {
      const item: StripeBankAccount = {
        id: "current-bank-account",
        object: "bank_account",
        account_holder_name: newBankAccount.source.account_holder_name,
        account_holder_type: newBankAccount.source.account_holder_type,
        bank_name: "",
        country: newBankAccount.source.country,
        currency: newBankAccount.source.currency,
        customer: "",
        fingerprint: "",
        last4: "",
        metadata: {},
        routing_number: newBankAccount.source.routing_number,
        status: "new",
      };

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
          data: [item, ...(old?.data || [])],
        }),
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(bankAccountQueryKeys.detail(data.id), data);
      queryClient.setQueryData<StripePagination<StripeBankAccount>>(
        [...bankAccountQueryKeys.all, MAX_PAGINATION, ""],
        (old: StripePagination<StripeBankAccount> | undefined) => ({
          object: old?.object || "list",
          url: old?.url || "",
          has_more: old?.has_more || false,
          data: [...(old?.data || [])].map((item) => {
            if (item.id === "current-bank-account") {
              return data;
            }

            return item;
          }),
        }),
      );
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
