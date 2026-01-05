import { useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import { STALE_TIME } from "@/constants.ts";
import type { BuukiaCategory } from "@/types";

import { categoryQueryKeys } from "./categories-query-keys";

interface useCategoriesParams {
  limit: number;
  query: string;
}

export const useCategories = (params: useCategoriesParams) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching, refetch, isRefetching } =
    useQuery<BuukiaCategory[]>({
      queryKey: [...categoryQueryKeys.all, params.limit, params.query],
      queryFn: async () => {
        const response = await fetch(
          `/api/categories?${queryString.stringify(params)}`,
        );

        const result = await response.json();

        for (const item of result) {
          queryClient.setQueryData(categoryQueryKeys.detail(item.id), item);
        }

        return result;
      },
      staleTime: STALE_TIME,
    });

  return { isLoading, error, data, isFetching, refetch, isRefetching };
};
