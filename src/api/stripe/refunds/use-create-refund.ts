import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MAX_PAGINATION } from "@/constants";
import type { CreateRefundBody } from "@/types";
import type { StripeRefund } from "scripts/mocksStripe";

import { refundQueryKeys } from "./refunds-query-keys";

export function useCreateRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRefundBody) => {
      const response = await fetch(`/v1/refunds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if(!response.ok) {
        throw new Error(response.statusText || "Failed to create refund");
      }

      return response.json();
    },
    onMutate: async (newRefund) => {
      const item: StripeRefund = {
        id: "current-refund",
        amount: newRefund.amount,
        charge: newRefund.charge,
        reason: newRefund.reason,
        payment_intent: null,
        metadata: {
          description: newRefund.metadata.description,
        },
        balance_transaction: "",
        created: Date.now(),
        currency: "usd",
        destination_details: {
          card: {
            reference: "",
            reference_status: "",
            reference_type: "",
            type: "",
          },
          type: "",
        },
        receipt_number: "",
        source_transfer_reversal: "",
        status: "pending",
        transfer_reversal: "",
        object: "refund",
      };

      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: [...refundQueryKeys.all, MAX_PAGINATION, ""],
      });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<StripeRefund[]>([
        ...refundQueryKeys.all,
        MAX_PAGINATION,
        "",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        [...refundQueryKeys.all, MAX_PAGINATION, ""],
        (old: StripeRefund[]) => [item, ...(old || [])],
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(refundQueryKeys.detail(data.id), data);
      queryClient.setQueryData<StripeRefund[]>(
        [...refundQueryKeys.all, MAX_PAGINATION, ""],
        (old: StripeRefund[] | undefined) =>
          [...(old || [])].map((item) => {
            if (item.id === "current-refund") {
              return data;
            }

            return item;
          }),
      );
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(
          [...refundQueryKeys.all, MAX_PAGINATION, ""],
          context.previousItems,
        );
      }
    },
  });
}
