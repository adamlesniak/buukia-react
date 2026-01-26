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

  const { isLoading, error, data, isFetching } = useQuery<BuukiaPayment[]>({
    queryKey: [...paymentQueryKeys.all, params.limit, params.query],
    queryFn: async () => {
      const response = await fetch(
        `/api/payments?${queryString.stringify(params)}`,
      );

      const result = await response.json();

      for (const item of result) {
        queryClient.setQueryData(paymentQueryKeys.detail(item.id), item);
      }

      return result;
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching };
};
