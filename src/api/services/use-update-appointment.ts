import { useMutation } from "@tanstack/react-query";

interface UpdateAppointmentBody {
  id: string;
  assistantId: string;
  clientId: string;
  time: string;
  serviceIds: string[];
}

export function useUpdateAppointment() {
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
  });
}
