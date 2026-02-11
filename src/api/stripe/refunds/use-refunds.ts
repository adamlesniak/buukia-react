import { useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import { STALE_TIME } from "@/constants";
import type { StripeRefund } from "@/types";

import { refundQueryKeys } from "./refunds-query-keys";

interface useRefundsParams {
  limit: number;
  query: string;
}

export const useRefunds = (params: useRefundsParams) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery<{
    object: "list";
    url: string;
    has_more: boolean;
    data: StripeRefund[];
  }>({
    queryKey: [...refundQueryKeys.all, params.limit, params.query],
    queryFn: async () => {
      const response = await fetch(
        `/v1/refunds?${queryString.stringify(params)}`,
      );

      const result = await response.json();

      for (const item of result.data as StripeRefund[]) {
        queryClient.setQueryData(refundQueryKeys.detail(item.id), item);
      }

      return result;
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching };
};
