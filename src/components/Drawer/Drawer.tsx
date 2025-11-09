import { Children, isValidElement } from "react";
import styled from "styled-components";

import { DrawerContent } from "./DrawerContent";

const Overlay = styled.div<{ $drawerPosition?: string }>`
  position: fixed;
  display: flex;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  ${(props) => {
    if (props.$drawerPosition === "top") {
      return `
        flex-direction: column;
        justify-content: start;
      `;
    }

    if (props.$drawerPosition === "bottom") {
      return `
        flex-direction: column;
        justify-content: end;
      `;
    }

    if (props.$drawerPosition === "left") {
      return `
        flex-direction: row;
        justify-content: start;
      `;
    }

    if (props.$drawerPosition === "right") {
      return `
        flex-direction: row;
        justify-content: end;
      `;
    }
  }}
`;

const DrawerContainer = styled.div<{ $drawerPosition?: string }>`
  position: fixed;
  display: flex;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;

  ${(props) => {
    if (props.$drawerPosition === "top") {
      return `
        flex-direction: column;
        justify-content: start;
      `;
    }

    if (props.$drawerPosition === "bottom") {
      return `
        flex-direction: column;
        justify-content: end;
      `;
    }

    if (props.$drawerPosition === "left") {
      return `
        flex-direction: row;
        justify-content: start;
      `;
    }

    if (props.$drawerPosition === "right") {
      return `
        flex-direction: row;
        justify-content: end;
      `;
    }
  }}
`;

export type DrawerBodyProps = {
  children: React.ReactNode;
  drawer?: "top" | "bottom" | "left" | "right";
  onOverlayClick?: () => void;
};

export function Drawer(props: DrawerBodyProps) {
  const DrawerContentChildren = Children.toArray(props.children).filter(
    (child) => isValidElement(child) && child.type === DrawerContent,
  );

  return (
    <DrawerContainer $drawerPosition={props.drawer}>
      <Overlay
        $drawerPosition={props.drawer}
        onClick={() => {
          props.onOverlayClick?.();
        }}
      />
      {DrawerContentChildren}
    </DrawerContainer>
  );
}
