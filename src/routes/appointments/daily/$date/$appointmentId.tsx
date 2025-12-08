import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { t } from "i18next";
import { X } from "lucide-react";

import { useClients, useServices, useUpdateAppointment } from "@/api";
import { useAppointment } from "@/api/appointments";
import { AppointmentDetail } from "@/components/Appointments/AppointmentDetail";
import { Button } from "@/components/Button";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerContentHeader,
} from "@/components/Drawer";
import type { UpdateAppointmentBody } from "@/types";

export const Route = createFileRoute(
  "/appointments/daily/$date/$appointmentId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { appointmentId, date } = Route.useParams();
  const navigate = useNavigate();

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
  } = useClients({ limit: 10 });

  const onClose = () => {
    navigate({ to: `/appointments/daily/${date}` });
  };

  const onSubmit = async (data: UpdateAppointmentBody) =>
    updateAppointmentMutation.mutate(data, {
      onSuccess: () => {


        // queryClient.setQueryData(
        //   appointmentQueryKeys.all,
        //   (old: BuukiaAppointment[]) => [
        //     ...(old || []).filter((a) => !a.id.includes("current-appointment")),
        //   ],
        // );
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
          />
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
