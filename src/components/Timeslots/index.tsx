import styled from "styled-components";

export const Timeslot = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 6px 0px;
  width: 100%;

  h4 {
    margin: 0px;
    margin-bottom: 8px;
  }

  input {
    margin: 0px 12px 0px 12px;
  }
`;

export const TimeslotActions = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  position: relative;
`;

export const TimeslotField = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const TimeslotFieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 4px 0px;
`;

export const TimeslotsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: end;
`;
