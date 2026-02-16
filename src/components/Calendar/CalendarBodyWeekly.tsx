import {
  addDays,
  addHours,
  addMinutes,
  startOfWeek,
  formatISO,
} from "date-fns";
import { memo, useMemo } from "react";

import type { BuukiaAppointment } from "@/types";
import { isoDateMatchDateTime } from "@/utils";

import { MemoizedAppointmentSlot } from "./MemoizedAppointmentSlot";
import { MemoizedColumnHeaderWeekly } from "./MemoizedColumnHeaderWeekly";
import { MemoizedPrimaryColumn } from "./MemoizedPrimaryColumn";
import { CalendarBodyColumn, CalendarBodyContainer } from "./styled";

export type CalendarBodyWeeklyProps = {
  columns: { id: string; name: string }[];
  hoursOpen: number;
  isLoading: boolean;
  items: BuukiaAppointment[];
  startDate: Date;
  onFieldSelect?: (data: { assistantId: string; time: string }) => void;
  onItemSelect?: (value: { id: string }) => void;
  onHeaderSelect?: (id: string) => void;
};

export const CalendarBodyWeekly = memo((props: CalendarBodyWeeklyProps) => {
  const weekStart = useMemo(
    () =>
      addHours(
        startOfWeek(props.startDate, { weekStartsOn: 0 }),
        props.startDate.getHours(),
      ),
    [props.startDate],
  );

  const appointmentDailyColumns = useMemo(
    () =>
      props.columns.map((column, columnIndex) => {
        const columnDate = formatISO(addDays(weekStart, columnIndex), {
          representation: "date",
        });
        const isToday =
          formatISO(new Date(), { representation: "date" }) === columnDate;

        const slots = Array.from({ length: props.hoursOpen * 4 }).map(
          (_, index) => ({
            time: addDays(addMinutes(props.startDate, index * 15), columnIndex),
          }),
        );

        return { id: column.id, columnDate, isToday, slots };
      }),
    [props.startDate, props.hoursOpen],
  );

  return (
    <CalendarBodyContainer>
      <MemoizedPrimaryColumn
        startDate={props.startDate}
        hoursOpen={props.hoursOpen}
      />
      {appointmentDailyColumns.map((column, columnIndex) => {
        const date = addDays(weekStart, columnIndex);

        return (
          <CalendarBodyColumn
            id={"date-" + formatISO(date, { representation: "date" })}
            key={"date-" + formatISO(date, { representation: "date" })}
            data-testid={"date-" + formatISO(date, { representation: "date" })}
          >
            <MemoizedColumnHeaderWeekly date={date} isToday={column.isToday} />
            {column.slots.map((slot) => {
              const matchedAppointment = props.items.find(
                (appointment) =>
                  appointment &&
                  appointment?.time &&
                  isoDateMatchDateTime(
                    appointment?.time,
                    slot.time.toISOString(),
                  ) &&
                  column.id === appointment?.assistant?.id,
              );

              const duration =
                matchedAppointment?.services.reduce(
                  (acc, service) => acc + Number(service.duration),
                  0,
                ) || 0;

              return (
                <MemoizedAppointmentSlot
                  key={slot.time.toISOString()}
                  time={slot.time}
                  assistantId={column.id}
                  appointmentClient={matchedAppointment?.client.name}
                  appointmentId={matchedAppointment?.id}
                  appointmentDuration={duration}
                  onFieldSelect={props.onFieldSelect}
                  onItemSelect={props.onItemSelect}
                  isLoading={props.isLoading}
                />
              );
            })}
          </CalendarBodyColumn>
        );
      })}
    </CalendarBodyContainer>
  );
});
