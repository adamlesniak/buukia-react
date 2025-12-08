import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { BuukiaAppointment } from "@/types";

import { appointmentQueryKeys } from "./appointments-query-keys";

interface CreateAppointmentBody {
  assistantId: string;
  clientId: string;
  time: string;
  serviceIds: string[];
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentBody) => {
      const response = await fetch(`/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response.json();
    },
    onMutate: async (newAppointment) => {
      const item = {
        id: "new",
        assistant: {
          id: newAppointment.assistantId,
          firstName: "",
          lastName: "",
          name: "",
          initials: "",
          availability: {
            regular: [],
            exceptions: [],
            holidays: [],
          },
          business: "",
          type: "",
        },
        time: newAppointment.time,
        client: {
          id: newAppointment.clientId,
          firstName: "",
          lastName: "",
          name: "",
          email: "",
          phone: "",
          appointments: [],
        },
        services: [],
      } as BuukiaAppointment;

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
        (old: BuukiaAppointment[]) => {
          console.log([...(old || []), item]);
          return [...(old || []), item];
        },
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
