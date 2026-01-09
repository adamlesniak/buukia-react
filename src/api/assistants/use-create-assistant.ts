import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MAX_PAGINATION } from "@/constants.ts";
import type { BuukiaAssistant, CreateAssistantBody } from "@/types";

import { assistantQueryKeys } from "./assistants-query-keys";

export function useCreateAssistant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAssistantBody) => {
      const response = await fetch(`/api/assistants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response.json();
    },
    onMutate: async (newAssistant) => {
      const item: CreateAssistantBody = {
        id: "current-assistant",
        firstName: newAssistant.firstName,
        lastName: newAssistant.lastName,
        email: newAssistant.email,
        categories: newAssistant.categories,
        availability: newAssistant.availability,
      } as BuukiaAssistant;

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
        (old: BuukiaAssistant[]) => [item, ...(old || [])],
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(assistantQueryKeys.detail(data.id), data);
      queryClient.setQueryData<BuukiaAssistant[]>(
        [...assistantQueryKeys.all, MAX_PAGINATION, ""],
        (old: BuukiaAssistant[] | undefined) =>
          [...(old || [])].map((item) => {
            if (item.id === "current-assistant") {
              return data;
            }

            return item;
          }),
      );
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
