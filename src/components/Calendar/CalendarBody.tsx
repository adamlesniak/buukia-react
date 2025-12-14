import { differenceInHours } from "date-fns";
import { useMemo } from "react";

import { ViewType } from "@/constants.ts";
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

export function CalendarBody({
  columns,
  endDate,
  onFieldSelect,
  onItemSelect,
  startDate,
  viewType,
  items,
  headerSelect,
}: CalendarBodyProps) {
  const hoursOpen = useMemo(
    () => differenceInHours(endDate, startDate),
    [endDate, startDate],
  );

  return (
    <CalendarBodyContainer>
      {viewType === ViewType.WEEK && (
        <CalendarBodyWeekly
          columns={columns}
          items={items}
          startDate={startDate}
          hoursOpen={hoursOpen}
          onFieldSelect={onFieldSelect}
          onItemSelect={onItemSelect}
          onHeaderSelect={headerSelect}
        />
      )}
      {viewType === ViewType.DAY && (
        <CalendarBodyDaily
          columns={columns}
          items={items}
          startDate={startDate}
          hoursOpen={hoursOpen}
          onFieldSelect={onFieldSelect}
          onItemSelect={onItemSelect}
          onHeaderSelect={headerSelect}
        />
      )}
    </CalendarBodyContainer>
  );
}
