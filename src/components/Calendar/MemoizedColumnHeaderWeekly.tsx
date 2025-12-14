import { addDays, format, getDate } from "date-fns";
import { memo } from "react";

import {
  CalendarBodyColumnHeader,
  CalendarBodyColumnHeaderDay,
} from "./styled";

export const MemoizedColumnHeaderWeekly = memo(
  ({
    weekStart,
    columnIndex,
    isToday,
  }: {
    weekStart: Date;
    columnIndex: number;
    isToday: boolean;
  }) => {
    return (
      <CalendarBodyColumnHeader>
        <h4>{format(addDays(weekStart, columnIndex), "EEE")}</h4>
        <CalendarBodyColumnHeaderDay className={isToday ? "today" : ""}>
          {getDate(addDays(weekStart, columnIndex))}
        </CalendarBodyColumnHeaderDay>
      </CalendarBodyColumnHeader>
    );
  },
);