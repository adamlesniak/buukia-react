import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import { useAssistant, useServices, useClients } from "@/api";

import { AppointmentForm } from "./AppointmentForm";

type AppointmentDetailProps = {
  id: string;
  time: string;
};

export function AppointmentDetail(props: AppointmentDetailProps) {
  const { t } = useTranslation();

  const {
    data: assistant,
    error: assistantError,
    isLoading: assistantLoading,
  } = useAssistant(props.id);
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

  if (assistantLoading || servicesLoading || clientsLoading) {
    return <div>{t("common.loading")}</div>;
  }

  if (assistantError || servicesError || clientsError) {
    return (
      <div>
        {t("common.error")}:{" "}
        {assistantError?.message ||
          servicesError?.message ||
          clientsError?.message}
      </div>
    );
  }

  return (
    <AppointmentForm
      data-testid="appointment-form"
      values={{
        assistantName: assistant?.name || "",
        clientName: "",
        time: format(new Date(parseInt(props.time) * 1000), "PPpp"),
        services: [],
      }}
      assistant={assistant || {}}
      services={services || []}
      clients={clients || []}
      onClientsSearch={() => {}}
      onSubmit={(data) => {
        console.log(data);
      }}
    />
  );
}
