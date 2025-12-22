import { Outlet, useNavigate, useParams } from "@tanstack/react-router";
import {
  startOfDay,
  addDays,
  addHours,
  addMinutes,
  subDays,
  getUnixTime,
  endOfDay,
} from "date-fns";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useAppointments, useAssistants } from "@/api";
import {
  Calendar,
  CalendarBody,
  CalendarError,
  CalendarHeader,
} from "@/components/Calendar";
import { ErrorDetail } from "@/components/Error";
import { MAX_ASSISTANTS, ViewType } from "@/constants.ts";

// TODO: Handle error and pagination
export default function CalendarDaily() {
  const { t } = useTranslation();

  const {
    date,
  }: {
    date: string;
  } = useParams({
    strict: false,
  });
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
    refetch: refetchAppointments,
  } = useAppointments({
    startDate: startOfDay(new Date(todaysDate)).toISOString(),
    endDate: endOfDay(new Date(todaysDate)).toISOString(),
  });
  const startDate = useMemo(
    () => addMinutes(addHours(todaysDate, 8), 0),
    [todaysDate],
  );
  const endDate = useMemo(
    () => addMinutes(addHours(todaysDate, 21), 0),
    [todaysDate],
  );

  useEffect(() => {
    refetchAppointments();
  }, [date]);

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
        .slice(0, MAX_ASSISTANTS) ||
      Array.from({ length: MAX_ASSISTANTS }, (_, i) => ({
        id: `assistant-${i}`,
        name: `A${i + 1}`,
      })),
    [assistants],
  );

  const isError = assistantsError || appointmentsError;
  const isLoading = assistantsLoading || appointmentsLoading;

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
              date={todaysDate}
              nextDaySelect={nextDaySelect}
              previousDaySelect={previousDaySelect}
              viewToggle={viewToggleSelect}
              viewType={ViewType.DAY}
            />
            <CalendarBody
              columns={columns}
              endDate={endDate}
              headerSelect={onHeaderSelect}
              items={appointments || []}
              onFieldSelect={handleFieldSelect}
              onItemSelect={onItemSelect}
              startDate={startDate}
              viewType={ViewType.DAY}
              isLoading={isLoading}
            />
          </Calendar>
          <Outlet />
        </>
      )}
    </>
  );
}
