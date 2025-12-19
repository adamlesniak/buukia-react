import { createFileRoute } from "@tanstack/react-router";

import CalendarWeekly from "@/containers/CalendarWeekly";

export const Route = createFileRoute("/appointments/weekly/$date/$assistantId")(
  {
    component: CalendarWeekly,
  },
);