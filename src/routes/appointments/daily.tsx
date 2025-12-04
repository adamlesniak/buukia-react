import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import {
  startOfDay,
  addDays,
  addHours,
  addMinutes,
  subDays,
  getUnixTime,
} from "date-fns";
import { useState } from "react";

import { useAssistants } from "@/api/assistants/use-assistants";
import { Calendar } from "@/components/Calendar/Calendar";
import { CalendarBody } from "@/components/Calendar/CalendarBody";
import { CalendarHeader } from "@/components/Calendar/CalendarHeader";
import { ViewType } from "@/constants.ts";

export const Route = createFileRoute("/appointments/daily")({
  component: RouteComponent,
});

function RouteComponent() {
  const [todaysDate, setTodaysDate] = useState(startOfDay(new Date()));
  const { data, error, isLoading } = useAssistants();
  const navigate = useNavigate();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const startDate = addMinutes(addHours(todaysDate, 8), 0);
  const endDate = addMinutes(addHours(todaysDate, 21), 0);

  const handleFieldSelect = (data: { assistantId: string; time: string }) => {
    navigate({
      to: `/appointments/daily/${data.assistantId}/${getUnixTime(new Date(data.time)).toString()}/`,
    });
  };

  const onHeaderSelect = (id: string) => {
    navigate({
      to: `/appointments/weekly/${id}/`,
    });
  }

  const columns =
    data?.map((item) => ({
      id: item.id,
      name: item.initials,
    })) || [];

  return (
    <>
      <Calendar>
        <CalendarHeader
          previousDaySelect={(date) => setTodaysDate(subDays(date, 7))}
          nextDaySelect={(date) => setTodaysDate(addDays(date, 7))}
          date={todaysDate}
          viewToggle={() => {
            navigate({ to: `/appointments/daily` });
          }}
        />
        <CalendarBody
          startDate={startDate}
          endDate={endDate}
          columns={columns.slice(0, 4)}
          onFieldSelect={handleFieldSelect}
          viewType={ViewType.WEEK}
          headerSelect={onHeaderSelect}
        />
      </Calendar>
      <Outlet />
    </>
  );
}
