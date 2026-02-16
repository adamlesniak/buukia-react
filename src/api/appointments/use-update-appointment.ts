import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type { BuukiaAppointment, BuukiaService } from "@/types";
import { getWeekStartEndDate } from "@/utils";

import { clientQueryKeys } from "../clients";
import { serviceQueryKeys } from "../services/services-query-keys";

import { appointmentQueryKeys } from "./appointments-query-keys";

const updateBuukiaAppointment = (
  appointment: UpdateAppointmentBody,
  item: BuukiaAppointment,
  queryClient: QueryClient,
) => {
  return {
    ...item,
    assistant: {
      ...item.assistant,
      id: appointment.assistantId,
    },
    client: queryClient.getQueryData(
      clientQueryKeys.detail(appointment.clientId),
    ),
    time: appointment.time,
    services: appointment.serviceIds.map((serviceId) =>
      queryClient.getQueryData(serviceQueryKeys.detail(serviceId)),
    ),
    stats: {
      services: {
        duration: (
          appointment.serviceIds.map((serviceId) =>
            queryClient.getQueryData(serviceQueryKeys.detail(serviceId)),
          ) as BuukiaService[]
        ).reduce(
          (sum: number, service: BuukiaService) =>
            sum + parseInt(service.duration),
          0,
        ),
        price: (
          appointment.serviceIds.map((serviceId) =>
            queryClient.getQueryData(serviceQueryKeys.detail(serviceId)),
          ) as BuukiaService[]
        ).reduce(
          (sum: number, service: BuukiaService) => sum + service.price,
          0,
        ),
      },
    },
  };
};

interface UpdateAppointmentBody {
  id: string;
  dashboard: boolean;
  assistantId: string;
  clientId: string;
  time: string;
  serviceIds: string[];
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAppointmentBody) => {
      const response = await fetch(`/api/appointments/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response.json();
    },
    onMutate: async (appointment) => {
      const { start, end } = getWeekStartEndDate(appointment.time);

      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: appointmentQueryKeys.all });

      if (appointment.dashboard) {
        // Snapshot the previous value
        const previousItems = queryClient.getQueryData<BuukiaAppointment[]>(
          appointmentQueryKeys.dashboard(),
        );

        // Optimistically update to the new value
        queryClient.setQueryData(
          appointmentQueryKeys.dashboard(),
          (old: BuukiaAppointment[]) =>
            [...(old || [])].map((item) => {
              if (item.id === appointment.id) {
                return updateBuukiaAppointment(appointment, item, queryClient);
              }

              return item;
            }),
        );
        return { previousItems };
      } else {
        // Snapshot the previous value
        const previousItems = queryClient.getQueryData<BuukiaAppointment[]>([
          ...appointmentQueryKeys.all,
          new Date(start).toISOString(),
          new Date(end).toISOString(),
        ]);

        // Optimistically update to the new value
        queryClient.setQueryData(
          [
            ...appointmentQueryKeys.all,
            new Date(start).toISOString(),
            new Date(end).toISOString(),
          ],
          (old: BuukiaAppointment[]) =>
            [...(old || [])].map((item) => {
              if (item.id === appointment.id) {
                return updateBuukiaAppointment(appointment, item, queryClient);
              }

              return item;
            }),
        );

        // Return a context object with the snapshotted value
        return { previousItems };
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(appointmentQueryKeys.detail(data.id), data);
    },
    onError: (_error, variables, context) => {
      const { start, end } = getWeekStartEndDate(variables.time);

      if (context) {
        queryClient.setQueryData(
          [
            ...appointmentQueryKeys.all,
            new Date(start).toISOString(),
            new Date(end).toISOString(),
          ],
          context.previousItems,
        );
      }
    },
  });
}
