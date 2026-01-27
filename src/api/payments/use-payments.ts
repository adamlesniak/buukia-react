import { useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import { STALE_TIME } from "@/constants.ts";
import type { BuukiaPayment } from "@/types";

import { paymentQueryKeys } from "./payments-query-keys";

interface usePaymentsParams {
  limit: number;
  query: string;
}

export const usePayments = (params: usePaymentsParams) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery<{
    items: BuukiaPayment[];
    stats: {
      totalPayments: number;
      totalAmount: number;
      averagePayment: number;
      failed: number;
    };
  }>({
    queryKey: [...paymentQueryKeys.all, params.limit, params.query],
    queryFn: async () => {
      const response = await Promise.all([
        fetch(`/api/payments?${queryString.stringify(params)}`),
        fetch(`/api/payments/stats`),
      ]);

      const result = await Promise.all([
        response[0].json(),
        response[1].json(),
      ]);

      for (const item of result[0] as BuukiaPayment[]) {
        queryClient.setQueryData(paymentQueryKeys.detail(item.id), item);
      }

      return { items: result[0], stats: result[1] };
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching };
};
