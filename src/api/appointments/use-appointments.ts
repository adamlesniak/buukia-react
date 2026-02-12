import { useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import { STALE_TIME } from "@/constants";
import type { BuukiaAppointment, SortOrder } from "@/types";

import { appointmentQueryKeys } from "./appointments-query-keys";

interface useAppointmentsParams {
  sort?: SortOrder;
  limit: number;
  startDate: string;
  endDate: string;
  assistantId?: string;
}

export const useAppointments = (params: useAppointmentsParams) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data, isFetching, refetch } = useQuery<
    BuukiaAppointment[]
  >({
    queryKey: [...appointmentQueryKeys.all, params.startDate, params.endDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/appointments?${queryString.stringify({ ...params, sortOrder: params.sort ? params.sort : "desc" })}`,
      );

      const result = await response.json();

      for (const item of result) {
        queryClient.setQueryData(appointmentQueryKeys.detail(item.id), item);
      }

      return result;
    },
    staleTime: STALE_TIME,
    retry: false,
  });

  return { isLoading, error, data, isFetching, refetch };
};
