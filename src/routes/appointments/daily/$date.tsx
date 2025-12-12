import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import {
  startOfDay,
  addDays,
  addHours,
  addMinutes,
  subDays,
  getUnixTime,
} from "date-fns";
import { useCallback, useMemo } from "react";

import { useAppointments } from "@/api/appointments";
import { useAssistants } from "@/api/assistants/use-assistants";
import { Calendar, CalendarBody, CalendarHeader } from "@/components/Calendar";
import { ViewType } from "@/constants.ts";

export const Route = createFileRoute("/appointments/daily/$date")({
  component: RouteComponent,
});

function RouteComponent() {
  const { date } = Route.useParams();
  const navigate = useNavigate();

  const [previousDay, nextDay, todaysDateUnix, todaysDate] = useMemo(
    () => [
      getUnixTime(subDays(startOfDay(new Date(Number(date))), 1)) * 1000,
      getUnixTime(addDays(startOfDay(new Date(Number(date))), 1)) * 1000,
      getUnixTime(startOfDay(new Date(Number(date)))) * 1000,
      startOfDay(new Date(Number(date))),
    ],
    [date],
  );

  const {
    data: assistants,
    error: assistantsError,
    isLoading: assistantsLoading,
  } = useAssistants();
  const {
    data: appointments,
    error: appointmentsError,
    isLoading: appointmentsLoading,
  } = useAppointments({
    startDate: subDays(startOfDay(new Date(todaysDate)), 7).toISOString(),
    endDate: addDays(startOfDay(new Date(todaysDate)), 7).toISOString(),
  });

  const startDate = useMemo(() => addMinutes(addHours(todaysDate, 8), 0), [todaysDate]);
  const endDate = useMemo(() => addMinutes(addHours(todaysDate, 21), 0), [todaysDate]);

  const handleFieldSelect = useCallback(
    (data: { assistantId: string; time: string }) => {
      navigate({
        to: `/appointments/daily/${todaysDateUnix}/new/${data.assistantId}/${getUnixTime(new Date(data.time)) * 1000}/`,
      });
    },
    [todaysDate],
  );

  const onHeaderSelect = useCallback(
    (id: string) => {
      navigate({
        to: `/appointments/weekly/${todaysDateUnix}/${id}/`,
      });
    },
    [todaysDate],
  );

  const onItemSelect = useCallback(
    (value: { id: string }) => {
      navigate({
        to: `/appointments/daily/${todaysDateUnix}/${value.id}/`,
      });
    },
    [todaysDate],
  );

  const previousDaySelect = useCallback(() => {
    navigate({
      to: `/appointments/daily/${previousDay}/`,
    });
  }, [previousDay]);

  const nextDaySelect = useCallback(() => {
    navigate({
      to: `/appointments/daily/${nextDay}/`,
    });
  }, [nextDay]);

  const viewToggleSelect = useCallback(() => {
    navigate({
      to: `/appointments/daily/${todaysDateUnix}`,
    });
  }, [todaysDate]);

  const columns = useMemo(
    () =>
      assistants
        ?.map((item) => ({
          id: item.id,
          name: item.initials,
        }))
        .slice(0, 4) || [],
    [assistants],
  );

  if (assistantsError || appointmentsError) {
    return (
      <div>Error: {assistantsError?.message || appointmentsError?.message}</div>
    );
  }

  if (assistantsLoading || appointmentsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Calendar>
        <CalendarHeader
          previousDaySelect={previousDaySelect}
          nextDaySelect={nextDaySelect}
          date={todaysDate}
          viewToggle={viewToggleSelect}
          viewType={ViewType.DAY}
        />
        <CalendarBody
          startDate={startDate}
          endDate={endDate}
          columns={columns}
          onFieldSelect={handleFieldSelect}
          viewType={ViewType.DAY}
          items={appointments || []}
          headerSelect={onHeaderSelect}
          onItemSelect={onItemSelect}
        />
      </Calendar>
      <Outlet />
    </>
  );
}
