import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MAX_PAGINATION } from "@/constants";
import type { BuukiaAssistant, UpdateAssistantBody } from "@/types";

import { assistantQueryKeys } from "./assistants-query-keys";

export function useUpdateAssistant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAssistantBody) => {
      const response = await fetch(`/api/assistants/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const item = await response.json();

      queryClient.setQueryData(assistantQueryKeys.detail(item.id), item);

      return item;
    },
    onMutate: async (assistant) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: [...assistantQueryKeys.all, MAX_PAGINATION, ""],
      });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<BuukiaAssistant[]>([
        ...assistantQueryKeys.all,
        MAX_PAGINATION,
        "",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        [...assistantQueryKeys.all, MAX_PAGINATION, ""],
        (old: BuukiaAssistant[]) =>
          [...(old || [])].map((item) => {
            if (item.id === assistant.id) {
              return {
                ...assistant,
              };
            }

            return item;
          }),
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(assistantQueryKeys.detail(data.id), data);
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(
          [...assistantQueryKeys.all, MAX_PAGINATION, ""],
          context.previousItems,
        );
      }
    },
  });
}
