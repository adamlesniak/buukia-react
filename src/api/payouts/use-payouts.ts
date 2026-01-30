import { useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import { STALE_TIME } from "@/constants";
import type { BuukiaPayout } from "@/types";

import { payoutQueryKeys } from "./payouts-query-keys";

interface usePayoutsParams {
  limit: number;
  query: string;
}

export const usePayouts = (params: usePayoutsParams) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery<BuukiaPayout[]>({
    queryKey: [...payoutQueryKeys.all, params.limit, params.query],
    queryFn: async () => {
      const response = await fetch(
        `/api/payouts?${queryString.stringify(params)}`,
      );

      const result = await response.json();

      for (const item of result as BuukiaPayout[]) {
        queryClient.setQueryData(payoutQueryKeys.detail(item.id), item);
      }

      return result;
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching };
};
