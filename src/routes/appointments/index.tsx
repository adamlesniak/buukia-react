import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "@/components/Calendar/Calendar";
import { CalendarBody } from "@/components/Calendar/CalendarBody";
import { CalendarHeader } from "@/components/Calendar/CalendarHeader";

export const Route = createFileRoute("/appointments/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Calendar>
      <CalendarHeader />
      <CalendarBody />
    </Calendar>
  );
}
