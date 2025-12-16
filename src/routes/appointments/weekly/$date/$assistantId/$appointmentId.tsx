import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { endOfDay, startOfDay } from "date-fns";
import { t } from "i18next";
import { X } from "lucide-react";

import {
  useClients,
  useServices,
  useUpdateAppointment,
  appointmentQueryKeys,
  useAppointment,
} from "@/api";
import { AppointmentDetail } from "@/components/Appointments/AppointmentDetail";
import { Button } from "@/components/Button";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerContentHeader,
} from "@/components/Drawer";
import { ErrorDetail } from "@/components/Error";
import type { BuukiaAppointment, UpdateAppointmentBody } from "@/types";
import { isoDateMatchDate } from "@/utils";

export const Route = createFileRoute(
  "/appointments/weekly/$date/$assistantId/$appointmentId",
)({
  component: RouteComponent,
});

export function RouteComponent() {
  const { appointmentId, date, assistantId } = Route.useParams();
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

  const appointmentDaysAppointments = queryClient
    .getQueryData<BuukiaAppointment[]>(appointmentQueryKeys.all)
    ?.filter(
      (item) =>
        appointment?.time &&
        item.assistant.id === appointment?.assistant.id &&
        isoDateMatchDate(item.time, appointment?.time),
    )
    ?.filter((item) => {
      const appointmentDate = new Date(item.time);
      return (
        appointmentDate >= startOfDay(appointmentDate) &&
        appointmentDate <= endOfDay(appointmentDate) &&
        item.assistant.id === appointment?.assistant.id
      );
    });

  const onClose = () => {
    // queryClient.setQueryData(
    //   appointmentQueryKeys.all,
    //   (old: BuukiaAppointment[]) => [
    //     ...(old || []).map((item) => {
    //       if (item.id === appointmentId) {
    //         return appointment;
    //       }

    //       return item;
    //     }),
    //   ],
    // );
    navigate({ to: `/appointments/weekly/${date}/${assistantId}` });
  };

  const onSubmit = async (data: UpdateAppointmentBody) =>
    updateAppointmentMutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });

  const isLoading = servicesLoading || clientsLoading || appointmentLoading;

  const isError = servicesError || clientsError || appointmentError;

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
              todaysAppointments={appointmentDaysAppointments || []}
              isLoading={isLoading}
            />
          )}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
