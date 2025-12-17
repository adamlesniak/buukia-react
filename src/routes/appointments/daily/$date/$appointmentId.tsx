import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useClients, useServices, useUpdateAppointment } from "@/api";
import { useAppointment } from "@/api/appointments";
import { appointmentQueryKeys } from "@/api/appointments/appointments-query-keys";
import { AppointmentDetail } from "@/components/Appointments/AppointmentDetail";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  MemoizedDrawerHeaderH2,
} from "@/components/Drawer";
import { ErrorDetail } from "@/components/Error";
import type { BuukiaAppointment, CreateAppointmentBody } from "@/types";
import { isoDateMatchDate } from "@/utils";

export const Route = createFileRoute(
  "/appointments/daily/$date/$appointmentId",
)({
  component: RouteComponent,
});

export function RouteComponent() {
  const { t } = useTranslation();
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
    data: services = [],
    error: servicesError,
    isLoading: servicesLoading,
  } = useServices();
  const {
    data: clients = [],
    error: clientsError,
    isLoading: clientsLoading,
  } = useClients({ limit: 100 });

  const todaysAppointments = useMemo(
    () =>
      queryClient
        .getQueryData<BuukiaAppointment[]>(appointmentQueryKeys.all)
        ?.filter(
          (item) =>
            isoDateMatchDate(item.time, new Date(Number(date)).toISOString()) &&
            appointment?.assistant.id === item.assistant.id,
        ) || [],
    [appointment?.assistant.id, date],
  );

  const onClose = () => {
    // queryClient.setQueryData(
    //   appointmentQueryKeys.all,
    //   (old: BuukiaAppointment[]) => [
    //     ...(old || []).map((item) => {
    //       if (item.id === appointmentId) {
    //         console.log(appointment, appointmentId);
    //         return appointment;
    //       }

    //       return item;
    //     }),
    //   ],
    // );
    navigate({ to: `/appointments/daily/${date}` });
  };

  const submit = useCallback(
    async (data: CreateAppointmentBody) =>
      updateAppointmentMutation.mutate(
        { ...data, id: appointmentId },
        {
          onSuccess: () => {
            onClose();
          },
        },
      ),
    [appointmentId],
  );

  const clientsSearch = useCallback((query: string) => {
    console.log("search query", query);
  }, []);

  const servicesSearch = useCallback((query: string) => {
    console.log("search query", query);
  }, []);

  const isLoading = servicesLoading || clientsLoading || appointmentLoading;

  const isError = servicesError || clientsError || appointmentError;

  return (
    <Drawer onOverlayClick={onClose} drawer="right">
      <DrawerContent>
        <MemoizedDrawerHeaderH2
          onClose={onClose}
          title={t("appointments.appointment")}
          label={t("common.closeDrawer")}
        />
        <DrawerContentBody>
          {isError && (
            <ErrorDetail
              message={isError?.message || t("common.unknownError")}
            />
          )}
          {!isError && (
            <AppointmentDetail
              appointment={appointment}
              services={services}
              clients={clients}
              onFormSubmit={submit}
              onClientSearch={clientsSearch}
              onServicesSearch={servicesSearch}
              todaysAppointments={todaysAppointments}
              isLoading={isLoading}
            />
          )}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
