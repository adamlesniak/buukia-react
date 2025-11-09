import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { startOfDay, addDays, addHours, addMinutes, subDays } from "date-fns";
import { useState } from "react";

import { useAssistants } from "@/api/assistants/use-assistants";
import { Calendar } from "@/components/Calendar/Calendar";
import { CalendarBody } from "@/components/Calendar/CalendarBody";
import { CalendarHeader } from "@/components/Calendar/CalendarHeader";
import { ViewType } from "@/constants.ts";

export const Route = createFileRoute("/appointments/$assistantId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [todaysDate, setTodaysDate] = useState(startOfDay(new Date()));
  const { error, isLoading } = useAssistants();
  const { assistantId } = Route.useParams();
  const navigate = useNavigate();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const startDate = addMinutes(addHours(todaysDate, 8), 0);
  const endDate = addMinutes(addHours(todaysDate, 21), 0);

  const handleFieldSelect = (data: unknown) => {
    console.log("Selected field:", data);
  };

  return (
    <Calendar>
      <CalendarHeader
        previousDaySelect={(date) => setTodaysDate(subDays(date, 7))}
        nextDaySelect={(date) => setTodaysDate(addDays(date, 7))}
        date={todaysDate}
        viewToggle={() => {
          navigate({ to: `/appointments` });
        }}
      />
      <CalendarBody
        startDate={startDate}
        endDate={endDate}
        columns={Array.from({ length: 7 }).map((_) => ({
          id: assistantId,
          name: "",
        }))}
        onFieldSelect={handleFieldSelect}
        viewType={ViewType.DAY}
      />
    </Calendar>
  );
}
