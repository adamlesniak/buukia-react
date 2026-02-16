import { useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInMinutes } from "date-fns";
import queryString from "query-string";

import { STALE_TIME } from "@/constants";
import type { BuukiaAppointment, SortOrder } from "@/types";
import { isWithinDay } from "@/utils";

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
    queryKey: isWithinDay(params.startDate, params.endDate)
      ? appointmentQueryKeys.dashboard()
      : [...appointmentQueryKeys.all, params.startDate, params.endDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/appointments?${queryString.stringify({ ...params, sortOrder: params.sort ? params.sort : "desc" })}`,
      );

      const result = await response.json();

      for (const item of result) {
        queryClient.setQueryData(appointmentQueryKeys.detail(item.id), item);
      }

      if (
        differenceInMinutes(
          new Date(params.endDate),
          new Date(params.startDate),
        ) <=
        24 * 60
      ) {
        queryClient.setQueryData(appointmentQueryKeys.dashboard(), result);
      }

      return result;
    },
    staleTime: STALE_TIME,
    retry: false,
  });

  return { isLoading, error, data, isFetching, refetch };
};
