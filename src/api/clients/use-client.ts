import { useQuery } from "@tanstack/react-query";

import type { BuukiaClient } from "@/types";

import { clientQueryKeys } from "./clients-query-keys";

export const useClient = (clientId: string) => {
  const { isLoading, error, data, isFetching, isError } = useQuery<BuukiaClient>({
    queryKey: clientQueryKeys.detail(clientId),
    queryFn: async () => {
      const response = await fetch(`/api/clients/${clientId}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data;
    },
    retry: false,
  });

  return { isLoading, error, data, isFetching, isError };
};
