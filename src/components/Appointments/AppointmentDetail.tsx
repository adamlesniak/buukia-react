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
  appointment?: BuukiaAppointment;
  clients: BuukiaClient[];
  isLoading: boolean;
  services: BuukiaService[];
  todaysAppointments: BuukiaAppointment[];
  onClientSearch: (query: string) => void;
  onFormSubmit: (data: CreateAppointmentBody) => void;
  onServicesSearch: (query: string) => void;
};

export const AppointmentDetail = memo(function AppointmentDetail(
  props: AppointmentDetailProps,
) {
  const formValues: AppointmentFormValues = useMemo(
    () => ({
      assistantName: props.appointment?.assistant.name || "",
      clientName: props.appointment?.client.name || "",
      time: format(props.appointment?.time ? new Date(props.appointment.time) : new Date(), "PPpp"),
      services: props.appointment?.services || [],
    }),
    [props.appointment?.id],
  );

  return (
    <AppointmentForm
      data-testid="appointment-form"
      appointmentId={props.appointment?.id || ''}
      values={formValues}
      assistantId={props.appointment?.assistant?.id || ''}
      services={props.services}
      clients={props.clients}
      onClientsSearch={props.onClientSearch}
      onServicesSearch={props.onServicesSearch}
      onSubmit={props.onFormSubmit}
      todaysAppointments={props.todaysAppointments}
      isLoading={props.isLoading}
    />
  );
});
