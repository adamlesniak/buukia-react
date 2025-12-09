import { format } from "date-fns";

import type {
  BuukiaAppointment,
  BuukiaClient,
  BuukiaService,
  CreateAppointmentBody,
} from "@/types";

import { AppointmentForm } from "./AppointmentForm";

type AppointmentDetailProps = {
  appointment: BuukiaAppointment;
  clients: BuukiaClient[];
  services: BuukiaService[];
  onFormSubmit: (data: CreateAppointmentBody) => void;
  onClientSearch: (query: string) => void;
};

export function AppointmentDetail(props: AppointmentDetailProps) {
  return (
    <AppointmentForm
      data-testid="appointment-form"
      appointmentId={props.appointment.id}
      values={{
        assistantName: props.appointment.assistant.name || "",
        clientName: props.appointment.client.name || "",
        time: format(new Date(props.appointment.time), "PPpp"),
        services: props.appointment.services || [],
      }}
      assistantId={props.appointment.assistant.id}
      services={props.services || []}
      clients={props.clients || []}
      onClientsSearch={props.onClientSearch}
      onSubmit={props.onFormSubmit}
    />
  );
}
