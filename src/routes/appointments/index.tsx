import { createFileRoute } from "@tanstack/react-router";
import { startOfDay, addDays, addHours, addMinutes, subDays } from "date-fns";
import { useState } from "react";

import { useAssistants } from "@/api/assistants/use-assistants";
import { Calendar } from "@/components/Calendar/Calendar";
import { CalendarBody } from "@/components/Calendar/CalendarBody";
import { CalendarHeader } from "@/components/Calendar/CalendarHeader";

export const Route = createFileRoute("/appointments/")({
  component: RouteComponent,
});

export enum ViewType {
  DAY = "day",
  WEEK = "week",
}

function RouteComponent() {
  const [todaysDate, setTodaysDate] = useState(startOfDay(new Date()));
  const { data, error, isLoading } = useAssistants();
  const [viewType, setViewType] = useState<ViewType>(ViewType.WEEK);

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

  const columns =
    data?.map((item) => ({
      id: item.id,
      name: item.initials,
    })) || [];

  return (
    <Calendar>
      <CalendarHeader
        previousDaySelect={(date) => setTodaysDate(subDays(date, 1))}
        nextDaySelect={(date) => setTodaysDate(addDays(date, 1))}
        date={todaysDate}
        viewToggle={() =>
          viewType === ViewType.DAY
            ? setViewType(ViewType.WEEK)
            : setViewType(ViewType.DAY)
        }
      />
      <CalendarBody
        startDate={startDate}
        endDate={endDate}
        columns={columns}
        onFieldSelect={handleFieldSelect}
        viewType={viewType}
      />
    </Calendar>
  );
}
