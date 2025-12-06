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
import { CircleUserRound } from "lucide-react";
import styled from "styled-components";

import { ViewType } from "@/constants.ts";
import type { BuukiaAppointment } from "@/types";
import { isoDateMatchDateTime } from "@/utils";

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
  border-radius: 100px;
  padding: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e0e0e0;
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
  position: relative;

  div {
    display: flex;
    text-align: right;

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

const AppointmentSlot = styled.div`
  position: relative;
  display: flex;
  border-top: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
`;

const AppointmentItem = styled.div`
  background: #fff0fa;
  flex: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  border-bottom: 1px solid #e0e0e0;
  top: 0px;
  flex-direction: column;
`;

const AppointmentItemClient = styled.div`
  svg {
    padding: 4px;
    padding-left: 6px;
  }

  span {
    padding: 4px;
    padding-left: 0px;
    font-size: 12px;
  }
`;

export type CalendarBodyProps = {
  startDate: Date;
  endDate: Date;
  columns: { id: string; name: string }[];
  items: BuukiaAppointment[];
  viewType: ViewType;
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
  const hoursOpen = differenceInHours(endDate, startDate);
  const weekStart = addHours(
    startOfWeek(startDate, { weekStartsOn: 0 }),
    startDate.getHours(),
  );

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
        columns.map((column, columnIndex) => {
          const columnDate = formatISO(addDays(weekStart, columnIndex), {
            representation: "date",
          });
          const isToday =
            formatISO(new Date(), { representation: "date" }) === columnDate;
          return (
            <CalendarBodyColumn key={columnIndex}>
              <CalendarBodyColumnHeader>
                <h4>{format(addDays(weekStart, columnIndex), "EEE")}</h4>
                <CalendarBodyColumnHeaderDay className={isToday ? "today" : ""}>
                  {getDate(addDays(weekStart, columnIndex))}
                </CalendarBodyColumnHeaderDay>
              </CalendarBodyColumnHeader>
              {Array.from({ length: hoursOpen }, (_, hourIndex) => {
                const hour = weekStart.getHours() + hourIndex;

                return (
                  <CalendarBodyColumnItem key={hour}>
                    {Array.from({ length: 4 }, (_, index) => {
                      const time = addDays(
                        addMinutes(addHours(weekStart, hourIndex), index * 15),
                        columnIndex,
                      );

                      return (
                        <AppointmentSlot
                          onClick={($event) => {
                            if (onFieldSelect) {
                              onFieldSelect({
                                time: time.toISOString(),
                                assistantId: column.id,
                              });
                            }
                            $event.preventDefault();
                            $event.stopPropagation();
                          }}
                          key={index}
                        ></AppointmentSlot>
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
            <CalendarBodyColumnHeader
              onClick={() => headerSelect && headerSelect(column.id)}
            >
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

                    const matchedAppointments = items.filter(
                      (appointment) =>
                        isoDateMatchDateTime(
                          appointment.time,
                          time.toISOString(),
                        ) && column.id === appointment?.assistant?.id,
                    );

                    return (
                      <AppointmentSlot
                        onClick={($event) => {
                          if (onFieldSelect) {
                            onFieldSelect({
                              time: time.toISOString(),
                              assistantId: column.id,
                            });
                          }
                          $event.preventDefault();
                          $event.stopPropagation();
                        }}
                        key={index}
                      >
                        {matchedAppointments.map((appointment) => {
                          const duration = appointment.services.reduce(
                            (acc, service) => acc + service.duration,
                            0,
                          );
                          const heightValue = duration / 15;

                          return (
                            <AppointmentItem
                              key={appointment.id}
                              style={{
                                height: heightValue * 100 + "%",
                                paddingBottom: heightValue - 1 + "px",
                              }}
                              onClick={($event) => {
                                if (onItemSelect) {
                                  onItemSelect({
                                    id: appointment.id,
                                  });
                                }
                                $event.preventDefault();
                                $event.stopPropagation();
                              }}
                            >
                              <AppointmentItemClient>
                                <CircleUserRound size={16} />
                                <span>{`${appointment.client.firstName} ${appointment.client.lastName}`}</span>
                              </AppointmentItemClient>
                              {/* <AppointmentItemMeta>
                                <span>
                                  {appointment.services
                                    .map((service) => service.name)
                                    .join(", ")}
                                </span>
                              </AppointmentItemMeta> */}
                            </AppointmentItem>
                          );
                        })}
                      </AppointmentSlot>
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
