import { useQuery } from "@tanstack/react-query";

import type { Service } from "@/types";

import { serviceQueryKeys } from "./services-query-keys";


export const useService = (serviceId: string) => {
  const { isLoading, error, data, isFetching } = useQuery<Service>({
    queryKey: serviceQueryKeys.detail(serviceId),
    queryFn: async () => {
      const response = await fetch(`/api/services/${serviceId}`);
      return response.json();
    },
  });

  return { isLoading, error, data, isFetching };
};
