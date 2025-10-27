import { useQuery } from "@tanstack/react-query";
import { assistantQueryKeys } from "./assistants-query-keys";
import type { Assistant } from "@/types";

export const useAssistants = () => {
  const { isLoading, error, data, isFetching } = useQuery<Assistant[]>({
    queryKey: assistantQueryKeys.all,
    queryFn: async () => {
      const response = await fetch("/api/assistants");
      return response.json();
    },
  });

  return { isLoading, error, data, isFetching };
};
