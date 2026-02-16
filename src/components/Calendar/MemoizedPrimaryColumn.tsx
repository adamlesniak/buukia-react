import { memo, useMemo } from "react";

import {
  CalendarBodyColumn,
  CalendarBodyColumnHeader,
  CalendarBodyColumnItemPrimary,
} from "./styled";

export type MemoizedPrimaryColumnProps = {
  startDate: Date;
  hoursOpen: number;
};

export const MemoizedPrimaryColumn = memo(
  (props: MemoizedPrimaryColumnProps) => {
    const { startDate, hoursOpen } = props;

    const rows = useMemo(
      () =>
        Array.from({ length: hoursOpen }, (_, index) => {
          const hour = startDate.getHours() + index;

          return (
            <CalendarBodyColumnItemPrimary key={hour}>
              <div>
                <span>{String(hour).padStart(2, "0") + ":00"}</span>
              </div>
              <div></div>
              <div></div>
              <div></div>
            </CalendarBodyColumnItemPrimary>
          );
        }),
      [hoursOpen],
    );

    return (
      <CalendarBodyColumn style={{ maxWidth: "190px" }} key={"primary"}>
        <CalendarBodyColumnHeader></CalendarBodyColumnHeader>
        {rows}
      </CalendarBodyColumn>
    );
  },
);
