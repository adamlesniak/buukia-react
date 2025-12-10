import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { BuukiaAppointment } from "@/types";

import { serviceQueryKeys } from "../services/services-query-keys";

import { appointmentQueryKeys } from "./appointments-query-keys";

interface UpdateAppointmentBody {
  id: string;
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
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: appointmentQueryKeys.all });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<BuukiaAppointment[]>(
        appointmentQueryKeys.all,
      );

      // Optimistically update to the new value
      queryClient.setQueryData(
        appointmentQueryKeys.all,
        (old: BuukiaAppointment[]) =>
          [...(old || [])].map((item) => {
            if (item.id === appointment.id) {
              return {
                ...item,
                assistant: {
                  ...item.assistant,
                  id: appointment.assistantId,
                },
                client: {
                  ...item.client,
                  id: appointment.clientId,
                },
                time: appointment.time,
                services: item.services.map((service) =>
                  queryClient.getQueryData(serviceQueryKeys.detail(service.id)),
                ),
              };
            }

            return item;
          }),
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(
          appointmentQueryKeys.all,
          context.previousItems,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.all });
    },
  });
}
