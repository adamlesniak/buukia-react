import { createFileRoute } from "@tanstack/react-router";

import CalendarDaily from "@/containers/CalendarDaily";

export const Route = createFileRoute("/appointments/daily/$date")({
  component: CalendarDaily,
});
