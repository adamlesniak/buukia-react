import { useMutation } from "@tanstack/react-query";

interface CreateAppointmentBody {
  assistantId: string;
  clientId: string;
  time: string;
  serviceIds: string[];
}

export function useCreateAppointment() {
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
  });
}
