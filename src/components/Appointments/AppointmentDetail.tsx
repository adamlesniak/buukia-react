import { format } from "date-fns";

import type { BuukiaAppointment, BuukiaClient, BuukiaService } from "@/types";

import { AppointmentForm } from "./AppointmentForm";

type AppointmentDetailProps = {
  appointment: BuukiaAppointment;
  clients: BuukiaClient[];
  services: BuukiaService[];
};

export function AppointmentDetail(props: AppointmentDetailProps) {
  return (
    <AppointmentForm
      data-testid="appointment-form"
      values={{
        assistantName: props.appointment.assistant.name || "",
        clientName: props.appointment.client.name || "",
        time: format(new Date(props.appointment.time), "PPpp"),
        services: props.appointment.services || [],
      }}
      assistantId={props.appointment.assistant.id}
      services={props.services || []}
      clients={props.clients || []}
      onClientsSearch={() => {}}
      onSubmit={(data) => {
        console.log(data);
      }}
    />
  );
}
