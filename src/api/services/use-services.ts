import { useQuery, useQueryClient } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants.ts";
import type { BuukiaService } from "@/types";

import { serviceQueryKeys } from "./services-query-keys";

export const useServices = () => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery<BuukiaService[]>({
    queryKey: serviceQueryKeys.all,
    queryFn: async () => {
      const response = await fetch(`/api/services`);

      const result = await response.json();

      for (const item of result) {
        queryClient.setQueryData(serviceQueryKeys.detail(item.id), item);
      }

      return result;
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching };
};
