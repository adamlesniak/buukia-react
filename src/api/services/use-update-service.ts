import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { BuukiaService, UpdateServiceBody } from "@/types";

import { serviceQueryKeys } from "./services-query-keys";

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateServiceBody) => {
      const response = await fetch(`/api/services/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response.json();
    },
    onMutate: async (service) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: serviceQueryKeys.all });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<BuukiaService[]>(
        serviceQueryKeys.all,
      );

      // Optimistically update to the new value
      queryClient.setQueryData(serviceQueryKeys.all, (old: BuukiaService[]) =>
        [...(old || [])].map((item) => {
          if (item.id === service.id) {
            return {
              ...item,
            };
          }

          return item;
        }),
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
          [...serviceQueryKeys.all],
          context.previousItems,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKeys.all });
    },
  });
}
