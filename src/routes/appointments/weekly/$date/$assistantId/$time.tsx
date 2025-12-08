import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { t } from "i18next";
import { X } from "lucide-react";

import { useAssistant, useClients, useServices } from "@/api";
import { AppointmentDetail } from "@/components/Appointments/AppointmentDetail";
import { Button } from "@/components/Button";
import { DrawerContentBody } from "@/components/Drawer";
import { Drawer } from "@/components/Drawer/Drawer";
import { DrawerContent } from "@/components/Drawer/DrawerContent";
import { DrawerContentHeader } from "@/components/Drawer/DrawerContentHeader";
import type { BuukiaAppointment } from "@/types";

export const Route = createFileRoute(
  "/appointments/weekly/$date/$assistantId/$time",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { assistantId, time, date } = Route.useParams();
  const navigate = useNavigate();

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
  } = useClients({ limit: 10 });

  const isLoading = assistantLoading || servicesLoading || clientsLoading;
  const error = assistantError || servicesError || clientsError;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <Drawer
      onOverlayClick={() => {
        navigate({
          to: `/appointments/weekly/${date}/${assistantId}/`,
        });
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
              navigate({ to: `/appointments/weekly/${assistantId}` });
            }}
          >
            <X />
          </Button>
        </DrawerContentHeader>
        <DrawerContentBody>
          <AppointmentDetail
            appointment={
              {
                id: "",
                time: new Date(Number(time) * 1000).toISOString(),
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
            onFormSubmit={(data) => {
              console.log("data", data);
            }}
            onClientSearch={(query) => {
              console.log("search query", query);
            }}
          />
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
