import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants.ts";
import type { BuukiaPayment } from "@/types";

import { paymentQueryKeys } from "./payments-query-keys";

export const usePayment = (paymentId: string) => {
  const { isLoading, error, data, isFetching, isError } =
    useQuery<BuukiaPayment>({
      queryKey: paymentQueryKeys.detail(paymentId),
      queryFn: async () => {
        const response = await fetch(`/api/payments/${paymentId}`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        return data;
      },
      staleTime: STALE_TIME,
    });

  return { isLoading, error, data, isFetching, isError };
};
