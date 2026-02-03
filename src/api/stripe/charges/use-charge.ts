import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants";
import type { StripeCharge } from "scripts/mocksStripe";

import { chargeQueryKeys } from "./charges-query-keys";

export const useCharge = (chargeId: string) => {
  const { isLoading, error, data, isFetching, isError } =
    useQuery<StripeCharge>({
      queryKey: chargeQueryKeys.detail(chargeId),
      queryFn: async () => {
        const response = await fetch(`/v1/charges/${chargeId}`);

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
