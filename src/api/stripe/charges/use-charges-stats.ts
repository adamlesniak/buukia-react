import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants";

import { chargeQueryKeys } from "./charges-query-keys";

export const useChargesStats = () => {
  const { isLoading, error, data, isFetching } = useQuery<{
      totalPayments: number;
      totalAmount: number;
      averagePayment: number;
      failed: number;
    }>({
    queryKey: [...chargeQueryKeys.stats()],
    queryFn: async () => {
      const response = await fetch(`/api/charges/stats`);
      const result = await response.json();

      return result;
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching };
};
