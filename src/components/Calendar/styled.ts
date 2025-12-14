import styled from "styled-components";

export const CalendarBodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
`;

export const CalendarBodyColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
`;

export const CalendarBodyColumnHeader = styled.div`
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

export const CalendarBodyColumnHeaderAvatar = styled.div`
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

export const CalendarBodyColumnHeaderDay = styled.div`
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

export const CalendarBodyColumnItem = styled.div`
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

export const CalendarBodyColumnItemPrimary = styled(CalendarBodyColumnItem)`
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

export const AppointmentSlot = styled.div`
  position: relative;
  border-top: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: pointer;
  justify-content: space-between;

  &:hover {
    background: #fbfbfb;
  }

  span {
    padding-right: 12px;
  }
`;

export const AppointmentItem = styled.div`
  background: #fff0fa;
  flex: 1;
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  border-bottom: 1px solid #e0e0e0;
  top: 0px;
  flex-direction: column;
`;

export const AppointmentItemClient = styled.div`
  display: flex;

  svg {
    padding: 4px;
    padding-left: 6px;
  }

  span {
    padding: 6px;
    padding-left: 4px;
    font-size: 12px;
  }
`;
