import { useQuery } from "@tanstack/react-query";

import type { Service } from "@/types";

import { serviceQueryKeys } from "./services-query-keys";


export const useServices = () => {
  const { isLoading, error, data, isFetching } = useQuery<Service[]>({
    queryKey: serviceQueryKeys.all,
    queryFn: async () => {
      const response = await fetch("/api/services");
      return response.json();
    },
  });

  return { isLoading, error, data, isFetching };
};
