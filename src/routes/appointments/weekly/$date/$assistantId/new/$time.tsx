import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { endOfDay, startOfDay } from "date-fns";
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
import { ErrorDetail } from "@/components/Error/ErrorDetail";
import type { BuukiaAppointment, CreateAppointmentBody } from "@/types";
import { isoDateMatchDate } from "@/utils";

export const Route = createFileRoute(
  "/appointments/weekly/$date/$assistantId/new/$time",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { assistantId, time, date } = Route.useParams();
  const appointmentTime = new Date(Number(time)).toISOString();
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

  const appointmentDaysAppointments = queryClient
    .getQueryData<BuukiaAppointment[]>(appointmentQueryKeys.all)
    ?.filter(
      (item) =>
        appointmentTime &&
        item.assistant.id === assistantId &&
        isoDateMatchDate(item.time, appointmentTime),
    )
    ?.filter((item) => {
      const appointmentDate = new Date(item.time);
      return (
        appointmentDate >= startOfDay(appointmentDate) &&
        appointmentDate <= endOfDay(appointmentDate)
      );
    });

  const onClose = () => {
    // queryClient.setQueryData(
    //   appointmentQueryKeys.all,
    //   (old: BuukiaAppointment[]) => [
    //     ...(old || []).filter((a) => !a.id.includes("current-appointment")),
    //   ],
    // );
    navigate({ to: `/appointments/weekly/${date}/${assistantId}/` });
  };

  const onSubmit = async (data: CreateAppointmentBody) =>
    createAppointmentMutation.mutate(data, {
      onSuccess: () => {
        navigate({ to: `/appointments/weekly/${date}/${assistantId}/` });
      },
    });

  const isLoading = assistantLoading || servicesLoading || clientsLoading;
  const isError = assistantError || servicesError || clientsError;

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
                  time: new Date(Number(time)).toISOString(),
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
              todaysAppointments={appointmentDaysAppointments || []}
              isLoading={isLoading}
            />
          )}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
