import type { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

const StyledButton = styled.button<{ $variant?: string; $size?: string }>`
  cursor: pointer;
  border-radius: 12px;
  font-size: 14px;
  text-align: center;

  ${(props) => {
    if (props.$size === "sm") {
      return `padding: .6em;`;
    }

    return `padding: 1em;`;
  }}

  ${(props) => {
    if (props.$variant === "transparent") {
      return ``;
    }

    return `border: 1px solid #f4f4f4;`;
  }}

  &:hover {
    background-color: #fbfbfb;
  }
`;

type ButtonProps = {
  "aria-pressed"?: string;
  active?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  tabIndex?: number;
  type: "button" | "submit" | "reset";
  value?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "transparent";
  size?: "sm" | "md" | "lg";
};

export function Button(
  props: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <StyledButton
      {...props}
      className={`${props.className}${props?.active ? " active" : ""}`}
      disabled={props.disabled}
      id={props.id}
      name={props.name}
      tabIndex={props.tabIndex}
      type={props.type}
      value={props.value}
      $variant={props.variant}
      $size={props.size}
    >
      {props.children}
    </StyledButton>
  );
}
