import { Children, isValidElement } from "react";
import styled from "styled-components";

import { DrawerContentBody } from "./DrawerContentBody";
import { DrawerContentHeader } from "./DrawerContentHeader";

const DrawerContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 400px;
  background-color: #fff;
  padding: 16px;
  position: relative;
  box-shadow:
    0 1px 1px hsl(0deg 0% 0% / 0.025),
    0 2px 2px hsl(0deg 0% 0% / 0.025),
    0 4px 4px hsl(0deg 0% 0% / 0.025),
    0 8px 8px hsl(0deg 0% 0% / 0.025),
    0 16px 16px hsl(0deg 0% 0% / 0.025);
`;

export type DrawerContentProps = {
  children: React.ReactNode;
};

export function DrawerContent(props: DrawerContentProps) {
  const DrawerContentHeaderChildren = Children.toArray(props.children).filter(
    (child) => isValidElement(child) && child.type === DrawerContentHeader,
  );
  const DrawerContentBodyChildren = Children.toArray(props.children).filter(
    (child) => isValidElement(child) && child.type === DrawerContentBody,
  );

  return (
    <DrawerContentContainer>
      {DrawerContentHeaderChildren}
      {DrawerContentBodyChildren}
    </DrawerContentContainer>
  );
}
