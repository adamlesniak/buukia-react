import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useRouterState } from "@tanstack/react-router";
import { format, getUnixTime } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useClients,
  useServices,
  useUpdateAppointment,
  appointmentQueryKeys,
  useAppointment,
  useCreateAppointment,
  useAssistant,
  serviceQueryKeys,
  clientQueryKeys,
} from "@/api";
import { AppointmentForm } from "@/components/Appointments/AppointmentForm";
import { MAX_PAGINATION } from "@/constants";
import type {
  AppointmentFormValues,
  BuukiaAppointment,
  BuukiaClient,
  BuukiaService,
  CreateAppointmentBody,
  UpdateAppointmentBody,
} from "@/types";
import { isoDateMatchDate, getWeekStartEndDate } from "@/utils";

import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  MemoizedDrawerHeader,
} from "../components/Drawer";
import { ErrorDetail } from "../components/Error";

import { DetailNavigationTitleContent } from "./AssistantDrawer";

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
  const isNew = !appointmentId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [clientsQuery, setClientsQuery] = useState("");
  const [servicesQuery, setServicesQuery] = useState("");

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
          client: null as any,
          services: [],
          assistant,
          payments: [],
          stats: {},
          isLoading: false,
          error: undefined,
        },
      }
    : useAppointment(appointmentId);
  const {
    data: services = [],
    error: servicesError,
    isLoading: servicesLoading,
    refetch: refetchServices,
    isRefetching: servicesIsRefetching,
  } = useServices({ limit: MAX_PAGINATION, query: servicesQuery });
  const {
    data: clients = [],
    error: clientsError,
    isLoading: clientsLoading,
    refetch: refetchClients,
    isRefetching: clientsIsRefetching,
  } = useClients({ limit: MAX_PAGINATION, query: clientsQuery });

  const { start, end } = getWeekStartEndDate(
    new Date(
      Number(
        isNew ? time : date || getUnixTime(appointment?.time || new Date()),
      ),
    ).toISOString(),
  );

  const todaysAppointments = useMemo(
    () =>
      queryClient
        .getQueryData<
          BuukiaAppointment[]
        >([...appointmentQueryKeys.all, new Date(start).toISOString(), new Date(end).toISOString()])
        ?.filter(
          (item) =>
            isoDateMatchDate(
              item.time,
              isNew
                ? new Date(Number(time)).toISOString()
                : (appointment?.time as string),
            ) && appointment?.assistant?.id === item.assistant.id,
        ) || [],
    [appointment?.assistant?.id, time],
  );

  const onClose = () => {
    if (selected.includes("daily")) {
      navigate({ to: `/appointments/daily/${date}` });
    } else if (selected.includes("weekly")) {
      navigate({
        to: `/appointments/weekly/${date}/${assistantId}`,
      });
    }

    navigate({
      to: `/dashboard`,
    });
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
        {
          ...data,
          id: appointmentId,
          dashboard: !selected.includes("daily") && !selected.includes("weekly"),
        } as UpdateAppointmentBody,
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    },
    [appointmentId],
  );

  const clientsSearch = useCallback(
    (query: string) => setClientsQuery(query),
    [appointmentId],
  );

  useEffect(() => {
    const clients = queryClient.getQueryData<BuukiaClient[]>([
      ...clientQueryKeys.all,
      MAX_PAGINATION,
      clientsQuery,
    ]);

    if (!clients) {
      refetchClients();
    }
  }, [clientsQuery]);

  const servicesSearch = useCallback(
    (query: string) => setServicesQuery(query),
    [appointmentId],
  );

  useEffect(() => {
    const services = queryClient.getQueryData<BuukiaService[]>([
      ...serviceQueryKeys.all,
      MAX_PAGINATION,
      servicesQuery,
    ]);

    if (!services) {
      refetchServices({});
    }
  }, [servicesQuery]);

  const isLoading =
    servicesLoading || clientsLoading || appointmentLoading || assistantLoading;

  const isError =
    servicesError || clientsError || appointmentError || assistantError;

  const formValues: AppointmentFormValues = useMemo(
    () => ({
      assistantName: appointment?.assistant?.name || "",
      client: appointment?.client ? [appointment?.client] : [],
      time: format(
        appointment?.time ? new Date(appointment.time) : new Date(),
        "PPpp",
      ),
      services:
        appointment?.services.map((service) => ({
          ...service,
          price: service.price.toString(),
        })) || [],
    }),
    [appointment?.id, assistant?.id],
  );

  return (
    <Drawer onOverlayClick={onClose} drawer="right">
      <DrawerContent>
        <MemoizedDrawerHeader onClose={onClose} label={t("common.closeDrawer")}>
          <DetailNavigationTitleContent>
            <h2>{t("appointments.appointment")}</h2>
          </DetailNavigationTitleContent>
        </MemoizedDrawerHeader>
        <DrawerContentBody>
          {isError && (
            <ErrorDetail
              message={isError?.message || t("common.unknownError")}
            />
          )}
          {!isError && (
            <AppointmentForm
              appointmentId={appointment?.id || ""}
              values={{
                ...formValues,
                services: formValues.services.map((service) => ({
                  ...service,
                  price: service.price.toString(),
                })),
              }}
              assistantId={appointment?.assistant?.id || ""}
              services={services}
              clients={clients}
              onClientsSearch={clientsSearch}
              onServicesSearch={servicesSearch}
              onSubmit={submit}
              todaysAppointments={todaysAppointments}
              isLoading={isLoading}
              clientsRefetching={clientsIsRefetching}
              servicesRefetching={servicesIsRefetching}
            />
          )}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
