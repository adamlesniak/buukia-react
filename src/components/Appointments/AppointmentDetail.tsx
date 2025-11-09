import { format } from "date-fns";

import { useAssistant } from "@/api/assistants";

import { AppointmentForm } from "./AppointmentForm";

type AppointmentDetailProps = {
  id: string;
  time: string;
};

export function AppointmentDetail(props: AppointmentDetailProps) {
  const { data, error, isLoading } = useAssistant(props.id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <AppointmentForm
      values={{
        assistantName: data?.name || "",
        clientName: "",
        serviceName: "",
        time: format(new Date(props.time), "PPpp"),
      }}
      onSubmit={(data) => {
        console.log(data);
      }}
    />
  );
}
