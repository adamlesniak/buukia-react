import { format } from "date-fns";
import { memo, useMemo } from "react";

import type {
  AppointmentFormValues,
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
  todaysAppointments: BuukiaAppointment[];
  onFormSubmit: (data: CreateAppointmentBody) => void;
  onClientSearch: (query: string) => void;
  onServicesSearch: (query: string) => void;
};

export const AppointmentDetail = memo(function AppointmentDetail(
  props: AppointmentDetailProps,
) {
  const formValues: AppointmentFormValues = useMemo(
    () => ({
      assistantName: props.appointment.assistant.name || "",
      clientName: props.appointment.client.name || "",
      time: format(new Date(props.appointment.time), "PPpp"),
      services: props.appointment.services || [],
    }),
    [props.appointment.id],
  );

  return (
    <AppointmentForm
      data-testid="appointment-form"
      appointmentId={props.appointment.id}
      values={formValues}
      assistantId={props.appointment.assistant.id}
      services={props.services}
      clients={props.clients}
      onClientsSearch={props.onClientSearch}
      onServicesSearch={props.onServicesSearch}
      onSubmit={props.onFormSubmit}
      todaysAppointments={props.todaysAppointments}
    />
  );
});
