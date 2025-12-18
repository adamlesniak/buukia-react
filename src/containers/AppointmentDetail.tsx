import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useRouterState } from "@tanstack/react-router";
import { format, getUnixTime } from "date-fns";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  useClients,
  useServices,
  useUpdateAppointment,
  appointmentQueryKeys,
  useAppointment,
  useCreateAppointment,
  useAssistant,
} from "@/api";
import { AppointmentForm } from "@/components/Appointments/AppointmentForm";
import type {
  AppointmentFormValues,
  BuukiaAppointment,
  CreateAppointmentBody,
  UpdateAppointmentBody,
} from "@/types";
import { isoDateMatchDate } from "@/utils";

import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  MemoizedDrawerHeaderH2,
} from "../components/Drawer";
import { ErrorDetail } from "../components/Error";


export default function AppointmentDetail() {
  const { t } = useTranslation();
  const {
    appointmentId,
    date,
    time,
    assistantId,
  }: {
    appointmentId: string;
    date: string;
    time: string;
    assistantId: string;
  } = useParams({
    strict: false,
  });
  const selected = useRouterState({
    select: (state) => state.location.href,
  });
  const isNew = selected.includes("new");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [createAppointment, updateAppointment] = [
    useCreateAppointment(),
    useUpdateAppointment(),
  ];

  const {
    data: assistant,
    error: assistantError,
    isLoading: assistantLoading,
  } = isNew
    ? useAssistant(assistantId)
    : { data: undefined, error: undefined, isLoading: false };
  const {
    data: appointment,
    isLoading: appointmentLoading,
    error: appointmentError,
  } = isNew
    ? {
        data: {
          id: "",
          time: new Date(
            getUnixTime(new Date(Number(time))) * 1000,
          ).toISOString(),
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
        } as BuukiaAppointment,
        isLoading: false,
        error: undefined,
      }
    : useAppointment(appointmentId);
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
            appointment?.assistant?.id === item.assistant.id,
        ) || [],
    [appointment?.assistant?.id, date],
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
    if (selected.includes("daily")) {
      navigate({ to: `/appointments/daily/${date}` });
    } else {
      navigate({
        to: `/appointments/weekly/${date}/${appointment?.assistant.id}`,
      });
    }
  };

  const submit = useCallback(
    async (data: CreateAppointmentBody) => {
      if (isNew) {
        return createAppointment.mutate(data, {
          onSuccess: () => {
            onClose();
          },
        });
      }

      return updateAppointment.mutate(
        { ...data, id: appointmentId } as UpdateAppointmentBody,
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    },
    [appointmentId],
  );

  const clientsSearch = useCallback((query: string) => {
    console.log("search query", query);
  }, []);

  const servicesSearch = useCallback((query: string) => {
    console.log("search query", query);
  }, []);

  const isLoading =
    servicesLoading || clientsLoading || appointmentLoading || assistantLoading;

  const isError =
    servicesError || clientsError || appointmentError || assistantError;

  const formValues: AppointmentFormValues = useMemo(
    () => ({
      assistantName: appointment?.assistant?.name || "",
      clientName: appointment?.client?.name || "",
      time: format(
        appointment?.time ? new Date(appointment.time) : new Date(),
        "PPpp",
      ),
      services: appointment?.services || [],
    }),
    [appointment?.id],
  );

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
            <AppointmentForm
              appointmentId={appointment?.id || ""}
              values={formValues}
              assistantId={appointment?.assistant?.id || ""}
              services={services}
              clients={clients}
              onClientsSearch={clientsSearch}
              onServicesSearch={servicesSearch}
              onSubmit={submit}
              todaysAppointments={todaysAppointments}
              isLoading={isLoading}
            />
          )}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
