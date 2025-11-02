import {
  addHours,
  addMinutes,
  differenceInHours,
  startOfWeek,
  addDays,
  formatISO,
  getDate,
  format,
} from "date-fns";
import styled from "styled-components";

import { ViewType } from "@/routes/appointments";

const CalendarBodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
`;

const CalendarBodyColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
`;

const CalendarBodyColumnHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-basis: 110px;

  h4 {
    margin-bottom: 8px;
    margin-top: 8px;
  }
`;

const CalendarBodyColumnHeaderAvatar = styled.div`
  cursor: pointer;
`;

const CalendarBodyColumnHeaderDay = styled.div`
  border-radius: 100px;
  padding: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 21px;

  &.today {
    background: #f4f4f4;
  }
`;

const CalendarBodyColumnItem = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;

  div {
    display: flex;
    text-align: right;
    border-top: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    flex-basis: 30px;
    cursor: pointer;

    &:hover {
      background: #fbfbfb;
    }

    span {
      padding-right: 12px;
    }
  }
`;

const CalendarBodyColumnItemPrimary = styled(CalendarBodyColumnItem)`
  div {
    display: flex;
    border: 0px;
    flex-basis: 30px;
    justify-content: flex-end;
    align-items: center;
    border-right: 1px solid #e0e0e0;
    cursor: initial;

    &:hover {
      background: transparent;
    }
  }

  div:first-child {
    border-top: 1px solid #e0e0e0;
  }
`;

export type CalendarBodyProps = {
  startDate: Date;
  endDate: Date;
  columns: { id: string; name: string }[];
  viewType: ViewType;
  onFieldSelect: (data: unknown) => void;
};

export function CalendarBody({
  columns,
  endDate,
  onFieldSelect,
  startDate,
  viewType,
}: CalendarBodyProps) {
  const hoursOpen = differenceInHours(endDate, startDate);
  const weekStart = startOfWeek(startDate, { weekStartsOn: 0 });

  return (
    <CalendarBodyContainer>
      <CalendarBodyColumn key={"primary"}>
        <CalendarBodyColumnHeader></CalendarBodyColumnHeader>
        {Array.from({ length: hoursOpen }, (_, index) => {
          const hour = startDate.getHours() + index;

          return (
            <CalendarBodyColumnItemPrimary key={hour}>
              <div>
                <span>{hour}:00</span>
              </div>
              <div></div>
              <div></div>
              <div></div>
            </CalendarBodyColumnItemPrimary>
          );
        })}
      </CalendarBodyColumn>
      {viewType === ViewType.WEEK &&
        Array.from({ length: 7 }, (_, index) => {
          const columnDate = formatISO(addDays(weekStart, index), {
            representation: "date",
          });
          const isToday =
            formatISO(new Date(), { representation: "date" }) === columnDate;
          return (
            <CalendarBodyColumn key={index}>
              <CalendarBodyColumnHeader>
                <h4>{format(addDays(weekStart, index), "EEE")}</h4>
                <CalendarBodyColumnHeaderDay className={isToday ? "today" : ""}>
                  {getDate(addDays(weekStart, index))}
                </CalendarBodyColumnHeaderDay>
              </CalendarBodyColumnHeader>
              {Array.from({ length: hoursOpen }, (_, hourIndex) => {
                const hour = startDate.getHours() + hourIndex;

                return (
                  <CalendarBodyColumnItem key={hour}>
                    {Array.from({ length: 4 }, (_, index) => {
                      const time = addMinutes(
                        addHours(startDate, hourIndex),
                        index * 15,
                      );
                      return (
                        <div
                          onClick={($event) => {
                            if (onFieldSelect) {
                              onFieldSelect({
                                time,
                                id: "test-id",
                              });
                            }
                            $event.preventDefault();
                            $event.stopPropagation();
                          }}
                          key={index}
                        ></div>
                      );
                    })}
                  </CalendarBodyColumnItem>
                );
              })}
            </CalendarBodyColumn>
          );
        })}
      {viewType === ViewType.DAY &&
        columns?.map((column) => (
          <CalendarBodyColumn key={column.id}>
            <CalendarBodyColumnHeader>
              <CalendarBodyColumnHeaderAvatar>
                {column.name}
              </CalendarBodyColumnHeaderAvatar>
            </CalendarBodyColumnHeader>
            {Array.from({ length: hoursOpen }, (_, hourIndex) => {
              const hour = startDate.getHours() + hourIndex;

              return (
                <CalendarBodyColumnItem key={hour}>
                  {Array.from({ length: 4 }, (_, index) => {
                    const time = addMinutes(
                      addHours(startDate, hourIndex),
                      index * 15,
                    );
                    return (
                      <div
                        onClick={($event) => {
                          if (onFieldSelect) {
                            onFieldSelect({
                              time,
                              id: column.id,
                            });
                          }
                          $event.preventDefault();
                          $event.stopPropagation();
                        }}
                        key={index}
                      ></div>
                    );
                  })}
                </CalendarBodyColumnItem>
              );
            })}
          </CalendarBodyColumn>
        ))}
    </CalendarBodyContainer>
  );
}
