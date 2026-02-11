import { useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import { STALE_TIME } from "@/constants";
import { type StripeCharge } from "@/types";

import { chargeQueryKeys } from "./charges-query-keys";

interface useChargesParams {
  limit: number;
  query: string;
}

export const useCharges = (params: useChargesParams) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery<{
    object: "list";
    url: string;
    has_more: boolean;
    data: StripeCharge[];
  }>({
    queryKey: [...chargeQueryKeys.all, params.limit, params.query],
    queryFn: async () => {
      const response = await fetch(
        `/v1/charges?${queryString.stringify(params)}`,
      );

      const result = await response.json();

      for (const item of result.data as StripeCharge[]) {
        queryClient.setQueryData(chargeQueryKeys.detail(item.id), item);
      }

      return result;
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching };
};
