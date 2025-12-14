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
import { useCallback, useMemo } from "react";

import { useAppointments, useAssistant } from "@/api";
import { Calendar, CalendarBody, CalendarHeader } from "@/components/Calendar";
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

  // if (!assistant) {
  //   throw Error("Assistant not found");
  // }

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

  const previousDaySelect = useCallback(() => {
    navigate({
      to: `/appointments/weekly/${prevWeekStart}/${assistantId}/`,
    });
  }, [prevWeekStart, assistantId]);

  const nextDaySelect = useCallback(() => {
    navigate({
      to: `/appointments/weekly/${nextWeekStart}/${assistantId}/`,
    });
  }, [nextWeekStart, assistantId]);

  const viewToggle = useCallback(() => {
    navigate({
      to: `/appointments/daily/${todaysDate}/`,
    });
  }, [todaysDate]);

  const handleFieldSelect = useCallback(
    (data: { assistantId: string; time: string }) => {
      navigate({
        to: `/appointments/weekly/${weeksDate}/${data.assistantId}/new/${getUnixTime(new Date(data.time)) * 1000}/`,
      });
    },
    [weeksDate, navigate],
  );

  const onItemSelect = useCallback(
    (value: { id: string }) => {
      navigate({
        to: `/appointments/weekly/${weeksDate}/${assistantId}/${value.id}/`,
      });
    },
    [weeksDate, assistantId, navigate],
  );

  const columns = useMemo(
    () =>
      Array.from({ length: 7 }).map((_) => ({
        id: assistant?.id || "",
        name: "",
      })),
    [assistant?.id],
  );

  return (
    <>
      <Calendar>
        <CalendarHeader
          date={new Date(weeksDate)}
          nextDaySelect={nextDaySelect}
          previousDaySelect={previousDaySelect}
          viewToggle={viewToggle}
          viewType={ViewType.WEEK}
        />
        <CalendarBody
          columns={columns}
          endDate={endDate}
          items={appointments || []}
          onFieldSelect={handleFieldSelect}
          onItemSelect={onItemSelect}
          startDate={startDate}
          viewType={ViewType.WEEK}
        />
      </Calendar>
      <Outlet />
    </>
  );
}
