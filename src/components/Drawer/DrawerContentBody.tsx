import styled from "styled-components";

const DrawerContentBodyContainer = styled.div<{
  $justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around";
  $inline?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => props.$justifyContent || "center"};
  align-items: center;
  flex: 1;
  overflow: hidden;
  z-index: 10;
  padding-top: ${(props) => (props.$inline ? "0px" : "16px")};
`;

export type DrawerContentBodyProps = {
  children: React.ReactNode;
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around";
  inline: boolean;
};

export function DrawerContentBody(props: DrawerContentBodyProps) {
  return (
    <DrawerContentBodyContainer
      $justifyContent={props.justifyContent}
      $inline={props.inline}
    >
      {props.children}
    </DrawerContentBodyContainer>
  );
}
