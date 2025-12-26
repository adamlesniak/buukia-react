import { useQuery, useQueryClient } from "@tanstack/react-query";
import queryString from "query-string";

import { STALE_TIME } from "@/constants.ts";
import type { BuukiaAppointment } from "@/types";

import { appointmentQueryKeys } from "./appointments-query-keys";

interface useAppointmentsParams {
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
        `/api/appointments?${queryString.stringify(params)}`,
      );

      const result = await response.json();

      for (const item of result) {
        queryClient.setQueryData(appointmentQueryKeys.detail(item.id), item);
      }

      return result;
    },
    staleTime: STALE_TIME,
  });

  return { isLoading, error, data, isFetching, refetch };
};
