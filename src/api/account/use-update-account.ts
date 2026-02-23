import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateAccountBody } from "@/types";

import { accountQueryKeys } from "./account-query-keys";

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAccountBody) => {
      const response = await fetch(`/api/account`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response.json();
    },
    onMutate: async (updateAccountBody) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: accountQueryKeys.all });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData(accountQueryKeys.all);

      // Optimistically update to the new value
      queryClient.setQueryData(accountQueryKeys.all, updateAccountBody);

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    // onSuccess: (data) => {
    //   queryClient.setQueryData(accountQueryKeys.detail(data.id), data);
    // },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(accountQueryKeys.all, context.previousItems);
      }
    },
  });
}
