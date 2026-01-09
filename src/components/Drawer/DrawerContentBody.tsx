import styled from "styled-components";

const DrawerContentBodyContainer = styled.div<{
  $justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around";
}>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => props.$justifyContent || "center"};
  align-items: center;
  flex: 1;
  overflow: hidden;
  z-index: 10;
`;

export type DrawerContentBodyProps = {
  children: React.ReactNode;
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around";
};

export function DrawerContentBody(props: DrawerContentBodyProps) {
  return (
    <DrawerContentBodyContainer $justifyContent={props.justifyContent}>
      {props.children}
    </DrawerContentBodyContainer>
  );
}
