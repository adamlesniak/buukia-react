import type { FormHTMLAttributes } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
  cursor: pointer;
  display: flex;
  flex: 1;
  margin: 12px 0px;
  flex-direction: column;
  height: 100%;
`;

type FormProps = {
  children?: React.ReactNode;
};

export function Form(props: FormProps & FormHTMLAttributes<HTMLFormElement>) {
  return <StyledForm {...props}>{props.children}</StyledForm>;
}
