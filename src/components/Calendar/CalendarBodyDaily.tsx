import { addMinutes } from "date-fns/addMinutes";
import { useMemo } from "react";

import type { BuukiaAppointment } from "@/types";
import { isoDateMatchDateTime } from "@/utils";

import { MemoizedAppointmentSlot } from "./MemoizedAppointmentSlot";
import { MemoizedColumnHeaderDay } from "./MemoizedColumnHeaderDay";
import { MemoizedPrimaryColumn } from "./MemoizedPrimaryColumn";
import { CalendarBodyColumn, CalendarBodyContainer } from "./styled";

export type CalendarBodyDailyProps = {
  columns: { id: string; name: string }[];
  hoursOpen: number;
  isLoading: boolean;
  items: BuukiaAppointment[];
  startDate: Date;
  onFieldSelect?: (data: { assistantId: string; time: string }) => void;
  onItemSelect?: (value: { id: string }) => void;
  onHeaderSelect?: (id: string) => void;
};

export const CalendarBodyDaily = (props: CalendarBodyDailyProps) => {
  const appointmentSlotsDaily = useMemo(
    () =>
      Array.from({ length: props.hoursOpen * 4 }).map((_, index) => ({
        time: addMinutes(props.startDate, index * 15),
      })),
    [props.startDate, props.hoursOpen],
  );

  return (
    <CalendarBodyContainer>
      <MemoizedPrimaryColumn
        startDate={props.startDate}
        hoursOpen={props.hoursOpen}
      />
      {props.columns?.map((column) => (
        <CalendarBodyColumn data-testid={column.id} key={column.id}>
          <MemoizedColumnHeaderDay
            columnName={column.name}
            columnId={"assistant-" + column.id}
            headerSelect={() => props.onHeaderSelect?.(column.id)}
          />
          {appointmentSlotsDaily.map((slot) => {
            const matchedAppointment = props.items.find((appointment) => {
              return (
                appointment &&
                appointment?.time &&
                isoDateMatchDateTime(
                  appointment?.time,
                  slot.time.toISOString(),
                ) &&
                column.id === appointment?.assistant?.id
              );
            });

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
      ))}
    </CalendarBodyContainer>
  );
};
