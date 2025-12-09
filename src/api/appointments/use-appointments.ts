import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";

import type { BuukiaAppointment } from "@/types";

import { appointmentQueryKeys } from "./appointments-query-keys";

interface useAppointmentsParams {
  date?: string;
  startDate?: string;
  endDate?: string;
  assistantId?: string;
}

export const useAppointments = (params: useAppointmentsParams) => {
  const { isLoading, error, data, isFetching } = useQuery<BuukiaAppointment[]>({
    queryKey: appointmentQueryKeys.all,
    queryFn: async () => {
      const response = await fetch(
        `/api/appointments?${queryString.stringify(params)}`,
      );
      return response.json();
    },
    select: (data) => {
      return data as BuukiaAppointment[];
    },
  });

  return { isLoading, error, data, isFetching };
};
