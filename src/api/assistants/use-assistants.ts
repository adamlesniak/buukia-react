import { useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import { STALE_TIME } from "@/constants.ts";
import type { BuukiaAssistant } from "@/types";

import { assistantQueryKeys } from "./assistants-query-keys";

interface useAssistantsParams {
  limit: number;
  query: string;
}

export const useAssistants = (params: useAssistantsParams) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching } = useQuery<BuukiaAssistant[]>({
    queryKey: [...assistantQueryKeys.all, params.limit, params.query],
    queryFn: async () => {
      const response = await fetch(
        `/api/assistants?${queryString.stringify(params)}`,
      );

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
