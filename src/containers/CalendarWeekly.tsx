import { Outlet, useNavigate, useParams } from "@tanstack/react-router";
import {
  addDays,
  addHours,
  addMinutes,
  subDays,
  getUnixTime,
  startOfWeek,
  startOfDay,
} from "date-fns";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useAppointments } from "@/api";
import {
  Calendar,
  CalendarBody,
  CalendarError,
  CalendarHeader,
} from "@/components/Calendar";
import { ErrorDetail } from "@/components/Error";
import { ViewType } from "@/constants.ts";


export default function CalendarWeekly() {
  const { t } = useTranslation();

  const {
    date,
    assistantId,
  }: {
    date: string;
    assistantId: string;
  } = useParams({
    strict: false,
  });

  const weeksDate = getUnixTime(startOfWeek(new Date(Number(date)))) * 1000;

  const [todaysDate, prevWeekStart, nextWeekStart] = [
    getUnixTime(startOfDay(new Date().getTime())) * 1000,
    getUnixTime(subDays(weeksDate, 7)) * 1000,
    getUnixTime(addDays(weeksDate, 7)) * 1000,
  ];

  const navigate = useNavigate();

  const {
    data: appointments,
    error: appointmentsError,
    isLoading: appointmentsLoading,
    refetch: refetchAppointments,
  } = useAppointments({
    assistantId,
    startDate: new Date(weeksDate).toISOString(),
    endDate: new Date(nextWeekStart).toISOString(),
  });

  const isError = appointmentsError;
  const isLoading = appointmentsLoading;

  // if (!assistant) {
  //   throw Error("Assistant not found");
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  const [startDate, endDate] = useMemo(
    () => [
      addMinutes(addHours(weeksDate, 8), 0),
      addMinutes(addHours(weeksDate, 21), 0),
    ],
    [date],
  );

  useEffect(() => {
    refetchAppointments();
  }, [date]);

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
        id: assistantId,
        name: "",
      })),
    [assistantId],
  );

  return (
    <>
      {isError && (
        <CalendarError>
          <ErrorDetail message={t("common.unknownError")} />
        </CalendarError>
      )}
      {!isError && (
        <>
          <Calendar>
            <CalendarHeader
              date={startDate}
              nextDaySelect={nextDaySelect}
              previousDaySelect={previousDaySelect}
              viewToggle={viewToggle}
              viewType={ViewType.WEEK}
            />
            <CalendarBody
              startDate={startDate}
              columns={columns}
              endDate={endDate}
              isLoading={isLoading}
              items={appointments || []}
              viewType={ViewType.WEEK}
              onFieldSelect={handleFieldSelect}
              onItemSelect={onItemSelect}
            />
          </Calendar>
          <Outlet />
        </>
      )}
    </>
  );
}
