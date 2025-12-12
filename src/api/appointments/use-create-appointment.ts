import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { BuukiaAppointment, BuukiaClient, BuukiaService } from "@/types";

import { clientQueryKeys } from "../clients/clients-query-keys";
import { serviceQueryKeys } from "../services/services-query-keys";

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
        id: "current-appointment",
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
        client: queryClient.getQueryData<BuukiaClient>(
          clientQueryKeys.detail(newAppointment.clientId),
        ),
        services: newAppointment.serviceIds.map((serviceId) => {
          const service = queryClient.getQueryData<BuukiaService>(
            serviceQueryKeys.detail(serviceId),
          );
          if (!service) {
            throw new Error("Service not found in cache");
          }
          return service;
        }),
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
        (old: BuukiaAppointment[]) =>
          [...(old || []), item].sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
          ),
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<BuukiaAppointment[]>(
        appointmentQueryKeys.all,
        (old: BuukiaAppointment[] | undefined) =>
          [...(old || [])].map((item) => {
            if (item.id === "current-appointment") {
              return data;
            }

            return item;
          }).sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
          ),
      );
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(
          appointmentQueryKeys.all,
          context.previousItems,
        );
      }
    },
  });
}
