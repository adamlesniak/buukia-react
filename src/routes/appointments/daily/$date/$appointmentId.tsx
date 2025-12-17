import { createFileRoute } from "@tanstack/react-router";

import EditAppointment from "@/components/Appointments/EditAppointment";

export const Route = createFileRoute(
  "/appointments/daily/$date/$appointmentId",
)({
  component: EditAppointment,
});
