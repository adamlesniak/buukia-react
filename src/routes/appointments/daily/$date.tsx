import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import {
  startOfDay,
  addDays,
  addHours,
  addMinutes,
  subDays,
  getUnixTime,
} from "date-fns";

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

  const [previousDay, nextDay, todaysDate] = [
    getUnixTime(subDays(startOfDay(new Date(Number(date))), 1)) * 1000,
    getUnixTime(addDays(startOfDay(new Date(Number(date))), 1)) * 1000,
    getUnixTime(startOfDay(new Date(Number(date)))) * 1000,
  ];

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

  if (assistantsError || appointmentsError) {
    return (
      <div>Error: {assistantsError?.message || appointmentsError?.message}</div>
    );
  }

  if (assistantsLoading || appointmentsLoading) {
    return <div>Loading...</div>;
  }

  const startDate = addMinutes(addHours(todaysDate, 8), 0);
  const endDate = addMinutes(addHours(todaysDate, 21), 0);

  const handleFieldSelect = (data: { assistantId: string; time: string }) => {
    navigate({
      to: `/appointments/daily/${todaysDate}/new/${data.assistantId}/${getUnixTime(new Date(data.time)) * 1000}/`,
    });
  };

  const onHeaderSelect = (id: string) => {
    navigate({
      to: `/appointments/weekly/${todaysDate}/${id}/`,
    });
  };

  const onItemSelect = (value: { id: string }) => {
    navigate({
      to: `/appointments/daily/${todaysDate}/${value.id}/`,
    });
  };

  const columns =
    assistants?.map((item) => ({
      id: item.id,
      name: item.initials,
    })) || [];

  return (
    <>
      <Calendar>
        <CalendarHeader
          previousDaySelect={() => {
            navigate({
              to: `/appointments/daily/${previousDay}/`,
            });
          }}
          nextDaySelect={() => {
            navigate({
              to: `/appointments/daily/${nextDay}/`,
            });
          }}
          date={new Date(todaysDate)}
          viewToggle={() => {
            navigate({
              to: `/appointments/daily/${todaysDate}`,
            });
          }}
          viewType={ViewType.DAY}
        />
        <CalendarBody
          startDate={startDate}
          endDate={endDate}
          columns={columns.slice(0, 4)}
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
