import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants";

import { payoutQueryKeys } from "./payouts-query-keys";

export const usePayoutsStats = () => {
  const { isLoading, error, data, isFetching } = useQuery<{
      totalPayouts: number;
      totalAmount: number;
      averagePayout: number;
      failed: number;
    }>({
    queryKey: [...payoutQueryKeys.stats()],
    queryFn: async () => {
      const response = await fetch(`/api/payouts/stats`);
      const result = await response.json();

      return result;
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching };
};
