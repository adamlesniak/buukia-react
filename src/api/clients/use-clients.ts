import { useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import { STALE_TIME } from "@/constants";
import type { BuukiaClient } from "@/types";

import { clientQueryKeys } from "./clients-query-keys";

interface useClientsParams {
  limit: number;
  query: string;
}

export const useClients = (params: useClientsParams) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching, refetch, isRefetching } =
    useQuery<BuukiaClient[]>({
      queryKey: [...clientQueryKeys.all, params.limit, params.query],
      queryFn: async () => {
        const response = await fetch(
          `/api/clients?${queryString.stringify(params)}`,
        );

        const result = await response.json();

        for (const item of result) {
          queryClient.setQueryData(clientQueryKeys.detail(item.id), item);
        }

        return result;
      },
      staleTime: STALE_TIME,
    });

  return { isLoading, error, data, isFetching, refetch, isRefetching };
};
