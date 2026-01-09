import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MAX_PAGINATION } from "@/constants.ts";
import type { BuukiaService } from "@/types";

import { serviceQueryKeys } from "./services-query-keys";

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });

      return response.json();
    },
    onMutate: async (serviceId: string) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: [...serviceQueryKeys.all, MAX_PAGINATION, ""],
      });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<BuukiaService[]>([
        ...serviceQueryKeys.all,
        MAX_PAGINATION,
        "",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        [...serviceQueryKeys.all, MAX_PAGINATION, ""],
        (old: BuukiaService[]) =>
          [...(old || [])].filter((item) => item.id !== serviceId),
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(serviceQueryKeys.detail(data.id), data);
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(
          [...serviceQueryKeys.all, MAX_PAGINATION, ""],
          context.previousItems,
        );
      }
    },
  });
}
