import { differenceInHours } from "date-fns";
import { useMemo } from "react";

import { ViewType } from "@/constants";
import type { BuukiaAppointment } from "@/types";

import { CalendarBodyDaily } from "./CalendarBodyDaily";
import { CalendarBodyWeekly } from "./CalendarBodyWeekly";
import { CalendarBodyContainer } from "./styled";

export type CalendarBodyProps = {
  startDate: Date;
  endDate: Date;
  columns: { id: string; name: string }[];
  items: BuukiaAppointment[];
  viewType: ViewType;
  isLoading: boolean;
  onFieldSelect: (data: { assistantId: string; time: string }) => void;
  onItemSelect: (value: { id: string }) => void;
  headerSelect?: (id: string) => void;
};

export function CalendarBody(props: CalendarBodyProps) {
  const hoursOpen = useMemo(
    () => differenceInHours(props.endDate, props.startDate),
    [props.endDate, props.startDate],
  );

  return (
    <CalendarBodyContainer data-testid="calendar-body">
      {props.viewType === ViewType.WEEK && (
        <CalendarBodyWeekly
          columns={props.columns}
          hoursOpen={hoursOpen}
          isLoading={props.isLoading}
          items={props.items}
          onFieldSelect={props.onFieldSelect}
          onHeaderSelect={props.headerSelect}
          onItemSelect={props.onItemSelect}
          startDate={props.startDate}
        />
      )}
      {props.viewType === ViewType.DAY && (
        <CalendarBodyDaily
          columns={props.columns}
          hoursOpen={hoursOpen}
          isLoading={props.isLoading}
          items={props.items}
          onFieldSelect={props.onFieldSelect}
          onHeaderSelect={props.headerSelect}
          onItemSelect={props.onItemSelect}
          startDate={props.startDate}
        />
      )}
    </CalendarBodyContainer>
  );
}
