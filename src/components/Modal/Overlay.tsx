import type React from "react";
import styled from "styled-components";

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

type OverlayProps = {
  children?: React.ReactNode;
};

export function Overlay(
  props: OverlayProps & React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <StyledOverlay id={"overlay-modal"} {...props}>
      {props.children}
    </StyledOverlay>
  );
}
