import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants";
import type { BuukiaPayout } from "@/types";

import { payoutQueryKeys } from "./payouts-query-keys";

export const usePayout = (payoutId: string) => {
  const { isLoading, error, data, isFetching, isError } =
    useQuery<BuukiaPayout>({
      queryKey: payoutQueryKeys.detail(payoutId),
      queryFn: async () => {
        const response = await fetch(`/api/payout/${payoutId}`);

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
