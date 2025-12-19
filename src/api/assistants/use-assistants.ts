import { useQuery, useQueryClient } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants.ts";
import type { BuukiaAssistant } from "@/types";

import { assistantQueryKeys } from "./assistants-query-keys";


export const useAssistants = () => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery<BuukiaAssistant[]>({
    queryKey: assistantQueryKeys.all,
    queryFn: async () => {
      const response = await fetch("/api/assistants");

      const result = await response.json();

      for (const item of result) {
        queryClient.setQueryData(assistantQueryKeys.detail(item.id), item);
      }

      return result;
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching };
};
