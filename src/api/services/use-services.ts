import { useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import { STALE_TIME } from "@/constants.ts";
import type { BuukiaService } from "@/types";

import { serviceQueryKeys } from "./services-query-keys";

interface useServicesParams {
  limit: number;
  query: string;
}

export const useServices = (params: useServicesParams) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching, refetch, isRefetching } =
    useQuery<BuukiaService[]>({
      queryKey: [serviceQueryKeys.all, params.limit, params.query],
      queryFn: async () => {
        const response = await fetch(
          `/api/services?${queryString.stringify(params)}`,
        );

        const result = await response.json();

        for (const item of result) {
          queryClient.setQueryData(serviceQueryKeys.detail(item.id), item);
        }

        return result;
      },
      staleTime: STALE_TIME,
    });

  return { isLoading, error, data, isFetching, refetch, isRefetching };
};
