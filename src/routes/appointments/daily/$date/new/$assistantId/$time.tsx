import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getUnixTime, startOfDay, endOfDay } from "date-fns";
import { t } from "i18next";
import { X } from "lucide-react";

import {
  useAssistant,
  useClients,
  useCreateAppointment,
  useServices,
} from "@/api";
import { appointmentQueryKeys } from "@/api/appointments/appointments-query-keys";
import { AppointmentDetail } from "@/components/Appointments/AppointmentDetail";
import { Button } from "@/components/Button";
import {
  DrawerContentBody,
  Drawer,
  DrawerContent,
  DrawerContentHeader,
} from "@/components/Drawer";
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
    data: services,
    error: servicesError,
    isLoading: servicesLoading,
  } = useServices();
  const {
    data: clients,
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

  const onClose = () => {
    queryClient.setQueryData(
      appointmentQueryKeys.all,
      (old: BuukiaAppointment[] | undefined) => [
        ...(old || []).filter((a) => !a.id.includes("current-appointment")),
      ],
    );
    navigate({ to: `/appointments/daily/${unixDate}` });
  };

  const onSubmit = async (data: CreateAppointmentBody) =>
    createAppointmentMutation.mutate(data, {
      onSuccess: () => {
        navigate({ to: `/appointments/daily/${unixDate}` });
      },
    });

  if (isLoading) {
    return <div>{t("common.loading")}</div>;
  }

  if (isError) {
    return (
      <div>
        {t("common.error")}:{" "}
        {assistantError?.message ||
          servicesError?.message ||
          clientsError?.message}
      </div>
    );
  }

  return (
    <Drawer onOverlayClick={onClose} drawer="right">
      <DrawerContent>
        <DrawerContentHeader>
          <h2>{t("appointments.appointment")}</h2>
          <Button
            variant="transparent"
            aria-label={t("common.closeDrawer")}
            tabIndex={0}
            type="button"
            onClick={onClose}
          >
            <X />
          </Button>
        </DrawerContentHeader>
        <DrawerContentBody>
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
            services={services || []}
            clients={clients || []}
            onFormSubmit={onSubmit}
            onClientSearch={(query) => {
              console.log("search query", query);
            }}
            onServicesSearch={(query) => {
              console.log("search query", query);
            }}
            todaysAppointments={todaysAppointments || []}
          />
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
