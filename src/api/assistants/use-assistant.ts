import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants";
import type { BuukiaAssistant } from "@/types";

import { assistantQueryKeys } from "./assistants-query-keys";

export const useAssistant = (assistantId: string) => {
  const { isLoading, error, data, isFetching, isError } =
    useQuery<BuukiaAssistant>({
      queryKey: assistantQueryKeys.detail(assistantId),
      queryFn: async () => {
        const response = await fetch(`/api/assistants/${assistantId}`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        return data;
      },
      staleTime: STALE_TIME,
    });

  return { isLoading, error, data, isFetching, isError };
};
