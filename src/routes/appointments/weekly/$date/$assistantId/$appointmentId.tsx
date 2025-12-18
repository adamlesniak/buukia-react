import { createFileRoute } from "@tanstack/react-router";

import AppointmentDetail from "@/containers/AppointmentDetail";

export const Route = createFileRoute(
  "/appointments/weekly/$date/$assistantId/$appointmentId",
)({
  component: AppointmentDetail,
});
