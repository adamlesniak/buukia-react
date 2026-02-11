import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MAX_PAGINATION } from "@/constants";
import type { BuukiaAssistant } from "@/types";

import { assistantQueryKeys } from "./assistants-query-keys";

export function useDeleteAssistant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assistantId: string) => {
      const response = await fetch(`/api/assistants/${assistantId}`, {
        method: "DELETE",
      });

      return response.json();
    },
    onMutate: async (assistantId: string) => {
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
          [...(old || [])].filter((item) => item.id !== assistantId),
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
