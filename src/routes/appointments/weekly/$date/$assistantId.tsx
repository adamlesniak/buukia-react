import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import {
  addDays,
  addHours,
  addMinutes,
  subDays,
  getUnixTime,
  startOfWeek,
} from "date-fns";

import { useAssistant } from "@/api";
import { Calendar } from "@/components/Calendar/Calendar";
import { CalendarBody } from "@/components/Calendar/CalendarBody";
import { CalendarHeader } from "@/components/Calendar/CalendarHeader";
import { ViewType } from "@/constants.ts";

export const Route = createFileRoute("/appointments/weekly/$date/$assistantId")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { assistantId, date } = Route.useParams();
  const todaysDate = startOfWeek(new Date(Number(date) * 1000));
  const { data, error, isLoading } = useAssistant(assistantId);
  const navigate = useNavigate();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const [startDate, endDate] = [
    addMinutes(addHours(todaysDate, 8), 0),
    addMinutes(addHours(todaysDate, 21), 0),
  ];

  const handleFieldSelect = (data: { assistantId: string; time: string }) => {
    navigate({
      to: `/appointments/weekly/${getUnixTime(todaysDate)}/${data.assistantId}/${getUnixTime(new Date(data.time)).toString()}/`,
    });
  };

  if (!data) {
    throw Error("Assistant not found");
  }

  return (
    <>
      <Calendar>
        <CalendarHeader
          previousDaySelect={(date) => {
            navigate({
              to: `/appointments/weekly/${getUnixTime(subDays(date, 7))}/${data.id}/`,
            });
          }}
          nextDaySelect={(date) => {
            navigate({
              to: `/appointments/weekly/${getUnixTime(addDays(date, 7))}/${data.id}/`,
            });
          }}
          date={todaysDate}
          viewToggle={() => {
            navigate({ to: `/appointments/daily/${date}` });
          }}
          viewType={ViewType.WEEK}
        />
        <CalendarBody
          startDate={startDate}
          endDate={endDate}
          columns={Array.from({ length: 7 }).map((_) => ({
            id: data?.id || "",
            name: "",
          }))}
          onFieldSelect={handleFieldSelect}
          viewType={ViewType.WEEK}
          items={[]}
        />
      </Calendar>
      <Outlet />
    </>
  );
}
