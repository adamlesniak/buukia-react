import { memo } from "react";

import {
  CalendarBodyColumnHeader,
  CalendarBodyColumnHeaderAvatar,
} from "./styled";

export const MemoizedColumnHeaderDay = memo(
  ({
    columnName,
    columnId,
    headerSelect,
  }: {
    columnName: string;
    columnId: string;
    headerSelect?: (id: string) => void;
  }) => {
    return (
      <CalendarBodyColumnHeader
        onClick={() => headerSelect && headerSelect(columnId)}
      >
        <CalendarBodyColumnHeaderAvatar>
          {columnName}
        </CalendarBodyColumnHeaderAvatar>
      </CalendarBodyColumnHeader>
    );
  },
);