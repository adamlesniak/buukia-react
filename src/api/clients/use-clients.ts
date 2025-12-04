import { useQuery } from "@tanstack/react-query";

import type { BuukiaClient } from "@/types";

import { clientQueryKeys } from "./clients-query-keys";

interface useClientsParams {
  limit: number;
}

export const useClients = (params: useClientsParams) => {
  const { isLoading, error, data, isFetching } = useQuery<BuukiaClient[]>({
    queryKey: clientQueryKeys.all,
    queryFn: async () => {
      const response = await fetch(`/api/clients?limit=${params.limit}`);
      return response.json();
    },
  });

  return { isLoading, error, data, isFetching };
};
