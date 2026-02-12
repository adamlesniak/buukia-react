import { createFileRoute } from "@tanstack/react-router";

import AppointmentDetail from "@/containers/AppointmentDetail";

export const Route = createFileRoute(
  "/dashboard/$appointmentId",
)({
  component: AppointmentDetail,
});
