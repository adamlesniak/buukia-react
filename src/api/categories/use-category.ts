import { useQuery } from "@tanstack/react-query";

import type { BuukiaCategory } from "@/types";

import { categoryQueryKeys } from "./categories-query-keys";

export const useCategory = (categoryId: string) => {
  const { isLoading, error, data, isFetching, isError } = useQuery<BuukiaCategory>({
    queryKey: categoryQueryKeys.detail(categoryId),
    queryFn: async () => {
      const response = await fetch(`/api/categories/${categoryId}`);

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
