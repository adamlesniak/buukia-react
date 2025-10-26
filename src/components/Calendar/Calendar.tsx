import styled from "styled-components";

export const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export function Calendar({ children }: { children: React.ReactNode }) {
  return <CalendarContainer>{children}</CalendarContainer>;
}
