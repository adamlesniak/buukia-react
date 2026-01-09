import type { FormHTMLAttributes } from "react";
import styled from "styled-components";

const StyledForm = styled.form<{ $fullHeight?: boolean }>`
  display: flex;
  /* margin: 12px 0px; */
  flex-direction: column;
  width: 100%;

  ${(props) =>
    props.$fullHeight &&
    `
      height: 100%;
      flex: 1;
    `}
`;

type FormProps = {
  children?: React.ReactNode;
  fullHeight?: boolean;
};

export function Form(props: FormProps & FormHTMLAttributes<HTMLFormElement>) {
  return (
    <StyledForm $fullHeight={props.fullHeight} {...props}>
      {props.children}
    </StyledForm>
  );
}
