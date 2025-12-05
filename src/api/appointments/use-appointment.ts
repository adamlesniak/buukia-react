import { useQuery } from "@tanstack/react-query";

import type { BuukiaAppointment } from "@/types";

import { appointmentQueryKeys } from "./appointments-query-keys";

export const useAppointment = (appointmentId: string) => {
  const { isLoading, error, data, isFetching, isError } = useQuery<BuukiaAppointment>({
    queryKey: appointmentQueryKeys.detail(appointmentId),
    queryFn: async () => {
      const response = await fetch(`/api/appointments/${appointmentId}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data;
    },
    retry: false,
  });

  return { isLoading, error, data, isFetching, isError };
};
