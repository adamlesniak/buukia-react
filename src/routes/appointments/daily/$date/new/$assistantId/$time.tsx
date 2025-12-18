import { createFileRoute } from "@tanstack/react-router";

import AppointmentDetail from "@/containers/AppointmentDetail";

export const Route = createFileRoute(
  "/appointments/daily/$date/new/$assistantId/$time",
)({
  component: AppointmentDetail,
});
