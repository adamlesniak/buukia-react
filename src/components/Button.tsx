import type { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

const StyledButton = styled.button<{
  $variant?: string;
  $size?: string;
  $disabled?: boolean;
}>`
  display: flex;
  cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
  border-radius: 12px;
  font-size: 14px;
  text-align: center;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  color: ${(props) => (props.$disabled ? "gray" : "initial")};

  &.active {
    background-color: #f4f4f4;
  }

  span {
    margin-left: 8px;
  }

  &:hover {
    background-color: #fbfbfb;

    &.active {
      background-color: #f4f4f4;
    }
  }

  ${(props) => {
    if (props.$size === "sm") {
      return `padding: .6em;`;
    }

    return `padding: 12px;`;
  }}

  ${(props) => {
    if (props.$variant === "transparent") {
      return ``;
    }

    if (props.$variant === "danger") {
      return `
        background: #ff5d5d;
        font-weight: bold;
        color: #FFF;
        border: 1px solid #f4f4f4;

        &:hover {
          background-color: #df4f4f;
        }
      `;
    }

    return `
      border: 1px solid #f4f4f4;
    `;
  }}

  &:disabled {
    background: initial;
    color: #cecece;
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
  variant?: "primary" | "secondary" | "transparent" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button(
  props: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <StyledButton
      {...props}
      className={`${props.className}${props?.active ? " active" : ""}`}
      $disabled={props.disabled}
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
