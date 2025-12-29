import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { BuukiaService, CreateServiceBody } from "@/types";

import { serviceQueryKeys } from "./services-query-keys";

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateServiceBody) => {
      const response = await fetch(`/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response.json();
    },
    onMutate: async (newService) => {
      const item: CreateServiceBody = {
        id: "current-service",
        duration: newService.duration,
        category: newService.category,
        name: newService.name,
        price: newService.price,
        description: newService.description,
      } as BuukiaService;

      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: serviceQueryKeys.all });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<BuukiaService[]>(
        serviceQueryKeys.all,
      );

      // Optimistically update to the new value
      queryClient.setQueryData(serviceQueryKeys.all, (old: BuukiaService[]) => [
        ...(old || []),
        item,
      ]);

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(serviceQueryKeys.detail(data.id), data);
      queryClient.setQueryData<BuukiaService[]>(
        [...serviceQueryKeys.all],
        (old: BuukiaService[] | undefined) =>
          [...(old || [])].map((item) => {
            if (item.id === "current-service") {
              return data;
            }

            return item;
          }),
      );
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(
          [...serviceQueryKeys.all],
          context.previousItems,
        );
      }
    },
  });
}
