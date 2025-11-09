import styled from "styled-components";

const DrawerContentBodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export type DrawerContentBodyProps = {
  children: React.ReactNode;
};

export function DrawerContentBody(props: DrawerContentBodyProps) {
  return <DrawerContentBodyContainer>{props.children}</DrawerContentBodyContainer>;
}
