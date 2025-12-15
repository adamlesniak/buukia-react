import { format, getDate } from "date-fns";
import { memo } from "react";

import {
  CalendarBodyColumnHeader,
  CalendarBodyColumnHeaderDay,
} from "./styled";

type MemoizedColumnHeaderWeeklyProps = {
  date: Date;
  isToday: boolean;
};

export const MemoizedColumnHeaderWeekly = memo(
  (props: MemoizedColumnHeaderWeeklyProps) => {
    return (
      <CalendarBodyColumnHeader>
        <h4>{format(props.date, "EEE")}</h4>
        <CalendarBodyColumnHeaderDay className={props.isToday ? "today" : ""}>
          {getDate(props.date)}
        </CalendarBodyColumnHeaderDay>
      </CalendarBodyColumnHeader>
    );
  },
);
