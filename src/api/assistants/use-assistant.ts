import { useQuery } from "@tanstack/react-query";

import type { Assistant } from "@/types";

import { assistantQueryKeys } from "./assistants-query-keys";


export const useAssistant = (assistantId: string) => {
  const { isLoading, error, data, isFetching } = useQuery<Assistant>({
    queryKey: assistantQueryKeys.detail(assistantId),
    queryFn: async () => {
      const response = await fetch(`/api/assistants/${assistantId}`);
      return response.json();
    },
  });

  return { isLoading, error, data, isFetching };
};
