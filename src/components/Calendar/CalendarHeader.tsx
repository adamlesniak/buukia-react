import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { ViewType } from "@/constants";

const Button = styled.button`
  border: 0px;
  background: transparent;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  height: 48px;
  width: 48px;

  &:hover {
    background: #fbfbfb;
  }
`;

const OutlineButton = styled(Button)`
  outline: 1px solid #f4f4f4;
  border-radius: 24px;
`;

const CalendarHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  max-height: 120px;
`;

const CalendarHeaderItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  h2 {
    margin: 0.2em 0px;
  }
`;

type CalendarHeaderProps = {
  date: Date;
  nextDaySelect?: (date: Date) => void;
  previousDaySelect?: (date: Date) => void;
  viewToggle?: () => void;
  viewType: ViewType;
};

export const CalendarHeader = memo(function CalendarHeader({
  date,
  nextDaySelect,
  previousDaySelect,
  viewToggle,
  viewType,
}: CalendarHeaderProps) {
  const { t } = useTranslation();

  return (
    <CalendarHeaderContainer data-testid="calendar-header">
      <CalendarHeaderItem>
        {previousDaySelect && (
          <Button
            aria-label={
              viewType === ViewType.DAY
                ? t("calendar.previousDay")
                : t("calendar.previousWeek")
            }
            data-testid="calendar-header-button-previous"
            type="button"
            onClick={() => previousDaySelect?.(date)}
          >
            <ChevronLeft />
          </Button>
        )}
        {nextDaySelect && (
          <Button
            aria-label={
              viewType === ViewType.DAY
                ? t("calendar.nextDay")
                : t("calendar.nextWeek")
            }
            data-testid="calendar-header-button-next"
            type="button"
            onClick={() => nextDaySelect?.(date)}
          >
            <ChevronRight />
          </Button>
        )}
        <CalendarHeaderItem style={{ marginLeft: "1em" }}>
          <div>
            <h2>{format(date, "MMMM yyyy")}</h2>
            <small>{format(date, "MMM dd, yyyy")}</small>
          </div>
          {viewType === ViewType.WEEK && (
            <OutlineButton
              aria-label={t("calendar.toggleViewDay")}
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                viewToggle && viewToggle();
              }}
              style={{ marginLeft: "2em" }}
              type="button"
            >
              <Users size={18} />
            </OutlineButton>
          )}
        </CalendarHeaderItem>
      </CalendarHeaderItem>
      <CalendarHeaderItem>
        {viewType === ViewType.DAY ? (
          <h2>{t("calendar.teamDayView")}</h2>
        ) : (
          <h2>{t("calendar.teamWeekView")}</h2>
        )}
      </CalendarHeaderItem>
    </CalendarHeaderContainer>
  );
});
