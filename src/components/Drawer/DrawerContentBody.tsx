import styled from "styled-components";

const DrawerContentBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  overflow: hidden;
  z-index: 10;
`;

export type DrawerContentBodyProps = {
  children: React.ReactNode;
};

export function DrawerContentBody(props: DrawerContentBodyProps) {
  return (
    <DrawerContentBodyContainer>{props.children}</DrawerContentBodyContainer>
  );
}
