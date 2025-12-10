import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { endOfDay, startOfDay } from "date-fns";
import { t } from "i18next";
import { X } from "lucide-react";

import { useClients, useServices, useUpdateAppointment } from "@/api";
import { useAppointment } from "@/api/appointments";
import { appointmentQueryKeys } from "@/api/appointments/appointments-query-keys";
import { AppointmentDetail } from "@/components/Appointments/AppointmentDetail";
import { Button } from "@/components/Button";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerContentHeader,
} from "@/components/Drawer";
import type { BuukiaAppointment, UpdateAppointmentBody } from "@/types";


export const Route = createFileRoute(
  "/appointments/daily/$date/$appointmentId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { appointmentId, date } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateAppointmentMutation = useUpdateAppointment();
  const {
    data: appointment,
    isLoading: appointmentLoading,
    error: appointmentError,
  } = useAppointment(appointmentId);
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
        appointmentDate >= startOfDay(new Date()) &&
        appointmentDate <= endOfDay(new Date()) &&
        appointment.assistant.id === appointment.assistant.id
      );
    });

  const onClose = () => {
    queryClient.setQueryData(
      appointmentQueryKeys.all,
      (old: BuukiaAppointment[]) => [
        ...(old || []).map((item) => {
          if (item.id === appointmentId) {
            return appointment;
          }

          return item;
        }),
      ],
    );
    navigate({ to: `/appointments/daily/${date}` });
  };

  const onSubmit = async (data: UpdateAppointmentBody) =>
    updateAppointmentMutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });

  const isLoading = servicesLoading || clientsLoading || appointmentLoading;

  const isError = servicesError || clientsError || appointmentError;

  if (isLoading) {
    return <div>{t("common.loading")}</div>;
  }

  if (isError) {
    return (
      <div>
        {t("common.error")}:{" "}
        {servicesError?.message ||
          clientsError?.message ||
          appointmentError?.message}
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
            appointment={appointment!}
            services={services || []}
            clients={clients || []}
            onFormSubmit={(data) =>
              onSubmit({
                ...data,
                id: appointmentId,
              })
            }
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
