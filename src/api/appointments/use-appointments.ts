import { useQuery } from "@tanstack/react-query";

import type { BuukiaAppointment } from "@/types";

import { appointmentQueryKeys } from "./appointments-query-keys";

interface useAppointmentsParams {
  date: string;
}


export const useAppointments = (params: useAppointmentsParams) => {
  const { isLoading, error, data, isFetching } = useQuery<BuukiaAppointment[]>({
    queryKey: appointmentQueryKeys.all,
    queryFn: async () => {
      const response = await fetch(`/api/appointments?date=${params.date}`);
      return response.json();
    },
  });

  return { isLoading, error, data, isFetching };
};
