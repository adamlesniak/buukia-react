import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import {
  addDays,
  addHours,
  addMinutes,
  subDays,
  getUnixTime,
  startOfWeek,
  startOfDay,
} from "date-fns";

import { useAppointments, useAssistant } from "@/api";
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

  const weeksDate = getUnixTime(startOfWeek(new Date(Number(date)))) * 1000;
  const [todaysDate, prevWeekStart, nextWeekStart] = [
    getUnixTime(startOfDay(new Date().getTime())) * 1000,
    getUnixTime(subDays(weeksDate, 7)) * 1000,
    getUnixTime(addDays(weeksDate, 7)) * 1000,
  ];

  const navigate = useNavigate();
  const {
    data: assistant,
    error: assistantError,
    isLoading: assistantLoading,
  } = useAssistant(assistantId);
  const {
    data: appointments,
    error: appointmentsError,
    isLoading: appointmentsLoading,
  } = useAppointments({
    assistantId,
    startDate: new Date(weeksDate).toISOString(),
    endDate: new Date(nextWeekStart).toISOString(),
  });

  const error = assistantError || appointmentsError;
  const isLoading = assistantLoading || appointmentsLoading;

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const [startDate, endDate] = [
    addMinutes(addHours(weeksDate, 8), 0),
    addMinutes(addHours(weeksDate, 21), 0),
  ];

  const handleFieldSelect = (data: { assistantId: string; time: string }) => {
    navigate({
      to: `/appointments/weekly/${todaysDate}/${data.assistantId}/new/${getUnixTime(new Date(data.time)) * 1000}/`,
    });
  };

  const onItemSelect = (value: { id: string }) => {
    navigate({
      to: `/appointments/weekly/${todaysDate}/${assistantId}/${value.id}/`,
    });
  };

  if (!assistant) {
    throw Error("Assistant not found");
  }

  return (
    <>
      <Calendar>
        <CalendarHeader
          previousDaySelect={() => {
            navigate({
              to: `/appointments/weekly/${prevWeekStart}/${assistant.id}/`,
            });
          }}
          nextDaySelect={() => {
            navigate({
              to: `/appointments/weekly/${nextWeekStart}/${assistant.id}/`,
            });
          }}
          date={new Date(weeksDate)}
          viewToggle={() => {
            navigate({
              to: `/appointments/daily/${todaysDate}/`,
            });
          }}
          viewType={ViewType.WEEK}
        />
        <CalendarBody
          startDate={startDate}
          endDate={endDate}
          columns={Array.from({ length: 7 }).map((_) => ({
            id: assistant?.id || "",
            name: "",
          }))}
          onItemSelect={onItemSelect}
          onFieldSelect={handleFieldSelect}
          viewType={ViewType.WEEK}
          items={appointments || []}
        />
      </Calendar>
      <Outlet />
    </>
  );
}
