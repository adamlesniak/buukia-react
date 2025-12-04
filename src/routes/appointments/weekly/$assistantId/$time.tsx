import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { t } from "i18next";
import { X } from "lucide-react";

import { AppointmentDetail } from "@/components/Appointments/AppointmentDetail";
import { Button } from "@/components/Button";
import { DrawerContentBody } from "@/components/Drawer";
import { Drawer } from "@/components/Drawer/Drawer";
import { DrawerContent } from "@/components/Drawer/DrawerContent";
import { DrawerContentHeader } from "@/components/Drawer/DrawerContentHeader";

export const Route = createFileRoute("/appointments/weekly/$assistantId/$time")({
  component: RouteComponent,
});

function RouteComponent() {
  const { assistantId, time } = Route.useParams();
  const navigate = useNavigate();

  return (
    <Drawer
      onOverlayClick={() => {
        navigate({ to: `/appointments/weekly/${assistantId}` });
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
          <AppointmentDetail id={assistantId} time={time} />
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
