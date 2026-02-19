import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants";

import { accountQueryKeys } from "./account-query-keys";

export const useAccount = () => {
  const { isLoading, error, data, isFetching, refetch } = useQuery({
    queryKey: accountQueryKeys.settings(),
    queryFn: async () => {
      const response = await fetch(
        `/api/account`,
      );

      const result = await response.json();

      return result;
    },
    staleTime: STALE_TIME,
    retry: false,
  });

  return { isLoading, error, data, isFetching, refetch };
};
