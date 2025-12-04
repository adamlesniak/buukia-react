import { useQuery } from "@tanstack/react-query";

import type { BuukiaAssistant } from "@/types";

import { assistantQueryKeys } from "./assistants-query-keys";


export const useAssistants = () => {
  const { isLoading, error, data, isFetching } = useQuery<BuukiaAssistant[]>({
    queryKey: assistantQueryKeys.all,
    queryFn: async () => {
      const response = await fetch("/api/assistants");
      return response.json();
    },
  });

  return { isLoading, error, data, isFetching };
};
