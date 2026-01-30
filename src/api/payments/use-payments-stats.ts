import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants";

import { paymentQueryKeys } from "./payments-query-keys";

export const usePaymentsStats = () => {
  const { isLoading, error, data, isFetching } = useQuery<{
      totalPayments: number;
      totalAmount: number;
      averagePayment: number;
      failed: number;
    }>({
    queryKey: [...paymentQueryKeys.stats()],
    queryFn: async () => {
      const response = await fetch(`/api/payments/stats`);
      const result = await response.json();

      return result;
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching };
};
