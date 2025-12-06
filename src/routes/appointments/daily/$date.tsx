import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import {
  startOfDay,
  addDays,
  addHours,
  addMinutes,
  subDays,
  getUnixTime,
  startOfWeek,
} from "date-fns";

import { useAppointments } from "@/api/appointments";
import { useAssistants } from "@/api/assistants/use-assistants";
import { Calendar } from "@/components/Calendar/Calendar";
import { CalendarBody } from "@/components/Calendar/CalendarBody";
import { CalendarHeader } from "@/components/Calendar/CalendarHeader";
import { ViewType } from "@/constants.ts";

export const Route = createFileRoute("/appointments/daily/$date")({
  component: RouteComponent,
});

function RouteComponent() {
  const { date } = Route.useParams();
  const navigate = useNavigate();

  const todaysDate = startOfDay(new Date(Number(date) * 1000));

  const {
    data: assistants,
    error: assistantsError,
    isLoading: assistantsLoading,
  } = useAssistants();
  const {
    data: appointments,
    error: appointmentsError,
    isLoading: appointmentsLoading,
  } = useAppointments({ date: todaysDate.toISOString() });

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
      to: `/appointments/daily/${getUnixTime(startOfDay(todaysDate))}/new/${data.assistantId}/${getUnixTime(new Date(data.time)).toString()}/`,
    });
  };

  const onHeaderSelect = (id: string) => {
    navigate({
      to: `/appointments/weekly/${getUnixTime(startOfWeek(todaysDate))}/${id}/`,
    });
  };

  const onItemSelect = (value: { id: string }) => {
    navigate({
      to: `/appointments/daily/${getUnixTime(startOfDay(todaysDate))}/${value.id}/`,
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
          previousDaySelect={(date) => {
            navigate({
              to: `/appointments/daily/${getUnixTime(subDays(date, 1))}/`,
            });
          }}
          nextDaySelect={(date) => {
            navigate({
              to: `/appointments/daily/${getUnixTime(addDays(date, 1))}/`,
            });
          }}
          date={todaysDate}
          viewToggle={() => {
            navigate({
              to: `/appointments/daily/${getUnixTime(startOfDay(todaysDate))}`,
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
