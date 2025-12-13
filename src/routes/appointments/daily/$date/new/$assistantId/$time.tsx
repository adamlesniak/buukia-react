import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getUnixTime, startOfDay, endOfDay } from "date-fns";
import { t } from "i18next";
import { useCallback } from "react";

import {
  useAssistant,
  useClients,
  useCreateAppointment,
  useServices,
} from "@/api";
import { appointmentQueryKeys } from "@/api/appointments/appointments-query-keys";
import { AppointmentDetail } from "@/components/Appointments/AppointmentDetail";
import {
  DrawerContentBody,
  Drawer,
  DrawerContent,
  MemoizedDrawerHeaderH2,
} from "@/components/Drawer";
import { ErrorDetail } from "@/components/Error";
import type { BuukiaAppointment, CreateAppointmentBody } from "@/types";

export const Route = createFileRoute(
  "/appointments/daily/$date/new/$assistantId/$time",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { assistantId, time, date } = Route.useParams();

  const [unixDate, unixTime] = [
    getUnixTime(new Date(Number(date))) * 1000,
    getUnixTime(new Date(Number(time))) * 1000,
  ];

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createAppointmentMutation = useCreateAppointment();
  const {
    data: assistant,
    error: assistantError,
    isLoading: assistantLoading,
  } = useAssistant(assistantId);
  const {
    data: services = [],
    error: servicesError,
    isLoading: servicesLoading,
  } = useServices();
  const {
    data: clients = [],
    error: clientsError,
    isLoading: clientsLoading,
  } = useClients({ limit: 100 });

  const todaysAppointments = queryClient
    .getQueryData<BuukiaAppointment[]>(appointmentQueryKeys.all)
    ?.filter((appointment) => {
      const appointmentDate = new Date(appointment.time);
      return (
        appointmentDate >= startOfDay(new Date(appointment.time)) &&
        appointmentDate <= endOfDay(new Date(appointment.time)) &&
        appointment.assistant.id === assistantId
      );
    });

  const isLoading = assistantLoading || servicesLoading || clientsLoading;
  const isError = assistantError || servicesError || clientsError;

  const onClose = useCallback(() => {
    // queryClient.setQueryData(
    //   appointmentQueryKeys.all,
    //   (old: BuukiaAppointment[] | undefined) => [
    //     ...(old || []).filter((a) => !a.id.includes("current-appointment")),
    //   ],
    // );
    navigate({ to: `/appointments/daily/${unixDate}` });
  }, [unixDate]);

  const submit = useCallback(
    async (data: CreateAppointmentBody) =>
      createAppointmentMutation.mutate(data, {
        onSuccess: () => {
          navigate({ to: `/appointments/daily/${unixDate}` });
        },
      }),
    [unixDate],
  );

  const clientsSearch = useCallback((query: string) => {
    console.log("search query", query);
  }, []);

  const servicesSearch = useCallback((query: string) => {
    console.log("search query", query);
  }, []);

  return (
    <Drawer onOverlayClick={onClose} drawer="right">
      <DrawerContent>
        <MemoizedDrawerHeaderH2
          onClose={onClose}
          title={t("appointments.appointment")}
        />
        <DrawerContentBody>
          {isError && (
            <ErrorDetail
              message={isError?.message || t("common.unknownError")}
            />
          )}
          {!isError && (
            <AppointmentDetail
              appointment={
                {
                  id: "",
                  time: new Date(unixTime).toISOString(),
                  client: {
                    id: "",
                    firstName: "",
                    lastName: "",
                    name: "",
                    email: "",
                    phone: "",
                    appointments: [],
                  },
                  services: [],
                  assistant,
                } as BuukiaAppointment
              }
              services={services}
              clients={clients}
              onFormSubmit={submit}
              onClientSearch={clientsSearch}
              onServicesSearch={servicesSearch}
              todaysAppointments={todaysAppointments || []}
              isLoading={isLoading}
            />
          )}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
