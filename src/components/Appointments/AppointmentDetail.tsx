import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import { useAssistant } from "@/api/assistants";

import { AppointmentForm } from "./AppointmentForm";

type AppointmentDetailProps = {
  id: string;
  time: string;
};

export function AppointmentDetail(props: AppointmentDetailProps) {
  const { t } = useTranslation();

  const { data, error, isLoading } = useAssistant(props.id);

  if (isLoading) {
    return <div>{t("common.loading")}</div>;
  }

  if (error) {
    return (
      <div>
        {t("common.error")}: {error.message}
      </div>
    );
  }

  return (
    <AppointmentForm
      data-testid="appointment-form"
      values={{
        assistantName: data?.name || "",
        clientName: "",
        time: format(new Date(props.time), "PPpp"),
        services: [],
      }}
      onSubmit={(data) => {
        console.log(data);
      }}
    />
  );
}
