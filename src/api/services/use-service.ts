import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants";
import type { BuukiaService } from "@/types";

import { serviceQueryKeys } from "./services-query-keys";

export const useService = (serviceId: string) => {
  const { isLoading, error, data, isFetching } = useQuery<BuukiaService>({
    queryKey: serviceQueryKeys.detail(serviceId),
    queryFn: async () => {
      const response = await fetch(`/api/services/${serviceId}`);
      return response.json();
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching };
};
