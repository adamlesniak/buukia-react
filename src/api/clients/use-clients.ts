import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { BuukiaClient } from "@/types";

import { clientQueryKeys } from "./clients-query-keys";

interface useClientsParams {
  limit: number;
}

export const useClients = (params: useClientsParams) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery<BuukiaClient[]>({
    queryKey: clientQueryKeys.all,
    queryFn: async () => {
      const response = await fetch(`/api/clients?limit=${params.limit}`);

      const result = await response.json();

      for (const item of result) {
        queryClient.setQueryData(clientQueryKeys.detail(item.id), item);
      }

      return result;
    },
  });

  return { isLoading, error, data, isFetching };
};
