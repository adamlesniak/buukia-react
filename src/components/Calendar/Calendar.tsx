import styled from "styled-components";

import { useServices } from "@/api/services/use-services";

export const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export function Calendar({ children }: { children: React.ReactNode }) {
  const { data } = useServices();
  console.log(data);
  return <CalendarContainer>{children}</CalendarContainer>;
}
