import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  display: flex;
  flex-direction: row;
  padding: 0px 8px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  margin: 4px 0px;
  font-size: 14px;
  height: 35px;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

type InputProps = {
  children?: React.ReactNode;
};

export function Input(
  props: InputProps &
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
) {
  return <StyledInput {...props}>{props.children}</StyledInput>;
}
