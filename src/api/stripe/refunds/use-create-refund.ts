import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MAX_PAGINATION } from "@/constants";
import type { CreateRefundBody } from "@/types";
import type { StripeCharge, StripeRefund } from "scripts/mocksStripe";

import { chargeQueryKeys } from "../charges/charges-query-keys";

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

      if (!response.ok) {
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
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: [...refundQueryKeys.all, MAX_PAGINATION, ""],
        }),
        queryClient.cancelQueries({
          queryKey: [...chargeQueryKeys.all, MAX_PAGINATION, ""],
        }),
      ]);

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
      queryClient.setQueryData(
        [...chargeQueryKeys.all, MAX_PAGINATION, ""],
        (charges: {
          object: "list";
          url: string;
          has_more: boolean;
          data: StripeCharge[];
        }) => ({
          object: "list",
          url: charges.url,
          has_more: charges.has_more,
          data: charges.data.map((charge) => {
            const optimisticCharge = {
              ...charge,
              refunded:
                newRefund.amount === charge.amount ? true : charge.refunded,
              refunds:
                charge.id === newRefund.charge
                  ? {
                      object: "list",
                      data: [...(charge.refunds?.data ?? []), item],
                      has_more: false,
                      url: `/v1/charges/${newRefund.charge}/refunds`,
                    }
                  : charge.refunds,
            };

            if (newRefund.charge === charge.id) {
              queryClient.setQueryData(
                chargeQueryKeys.detail(newRefund.charge),
                optimisticCharge,
              );
            }

            return optimisticCharge;
          }),
        }),
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(refundQueryKeys.detail(data.id), data);
      queryClient.setQueryData<{
        object: "list";
        url: string;
        has_more: boolean;
        data: StripeRefund[];
      }>(
        [...refundQueryKeys.all, MAX_PAGINATION, ""],
        (
          old:
            | {
                object: "list";
                url: string;
                has_more: boolean;
                data: StripeRefund[];
              }
            | undefined,
        ) =>
          old
            ? {
                object: "list",
                url: old.url,
                has_more: old.has_more,
                data: old.data.map((item) => {
                  if (item.id === "current-refund") {
                    return data;
                  }

                  return item;
                }),
              }
            : undefined,
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
