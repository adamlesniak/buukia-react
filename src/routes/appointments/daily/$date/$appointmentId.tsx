import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { t } from "i18next";
import { X } from "lucide-react";

import { useClients, useServices } from "@/api";
import { useAppointment } from "@/api/appointments";
import { AppointmentDetail } from "@/components/Appointments/AppointmentDetail";
import { Button } from "@/components/Button";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerContentHeader,
} from "@/components/Drawer";

export const Route = createFileRoute(
  "/appointments/daily/$date/$appointmentId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { appointmentId, date } = Route.useParams();
  const navigate = useNavigate();

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
    <Drawer
      onOverlayClick={() => {
        navigate({ to: `/appointments/daily/${date}` });
      }}
      drawer="right"
    >
      <DrawerContent>
        <DrawerContentHeader>
          <h2>{t("appointments.appointment")}</h2>
          <Button
            variant="transparent"
            aria-label={t("common.closeDrawer")}
            tabIndex={0}
            type="button"
            onClick={() => {
              navigate({ to: `/appointments/daily/${date}` });
            }}
          >
            <X />
          </Button>
        </DrawerContentHeader>
        <DrawerContentBody>
          <AppointmentDetail
            appointment={appointment!}
            services={services || []}
            clients={clients || []}
          />
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
