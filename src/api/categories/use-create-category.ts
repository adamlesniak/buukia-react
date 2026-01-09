import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MAX_PAGINATION } from "@/constants.ts";
import type { BuukiaCategory, CreateCategoryBody } from "@/types";

import { categoryQueryKeys } from "./categories-query-keys";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryBody) => {
      const response = await fetch(`/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response.json();
    },
    onMutate: async (newItem) => {
      const item: CreateCategoryBody = {
        id: "current-category",
        name: newItem.name,
      } as BuukiaCategory;

      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: [...categoryQueryKeys.all, MAX_PAGINATION, ""],
      });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<BuukiaCategory[]>([
        ...categoryQueryKeys.all,
        MAX_PAGINATION,
        "",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        [...categoryQueryKeys.all, MAX_PAGINATION, ""],
        (old: BuukiaCategory[]) => [item, ...(old || [])],
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(categoryQueryKeys.detail(data.id), data);
      queryClient.setQueryData<BuukiaCategory[]>(
        [...categoryQueryKeys.all, MAX_PAGINATION, ""],
        (old: BuukiaCategory[] | undefined) =>
          [...(old || [])].map((item) => {
            if (item.id === "current-category") {
              return data;
            }

            return item;
          }),
      );
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(
          [...categoryQueryKeys.all, MAX_PAGINATION, ""],
          context.previousItems,
        );
      }
    },
  });
}
