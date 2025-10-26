import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import styled from "styled-components";

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
  padding: 0em 1em;

  h2 {
    margin: .2em 0px;
  }
`;

export function CalendarHeader() {
  return (
    <CalendarHeaderContainer>
      <CalendarHeaderItem>
        <Button type="button">
          <ChevronLeft />
        </Button>
        <Button type="button">
          <ChevronRight />
        </Button>
        <CalendarHeaderItem>
          <div>
            <h2>October 2025</h2>
            <small>Oct 26, 2025</small>
          </div>
          <OutlineButton style={{ marginLeft: "1em" }} type="button">
            <Users size={18} />
          </OutlineButton>
        </CalendarHeaderItem>
      </CalendarHeaderItem>
      <CalendarHeaderItem>
        <h2>Team Day View</h2>
      </CalendarHeaderItem>
    </CalendarHeaderContainer>
  );
}
