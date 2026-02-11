import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import styled from "styled-components";

const StyledInputContainer = styled.div<{
  $noBorder: boolean;
}>`
  display: flex;
  flex-direction: row;
  border: ${(props) => (props.$noBorder ? "0px;" : "1px solid #e0e0e0;")};
  margin: 4px 0px;
  font-size: 14px;
  height: 35px;
  border-radius: 4px;
`;

const StyledInputPrefix = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 8px;
  background-color: #fff;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const StyledInput = styled.input`
  display: flex;
  flex-direction: row;
  padding: 0px 8px;
  border: 0px;
  cursor: pointer;
  flex: 1;
  border-radius: 4px;

  &:disabled {
    cursor: default;
  }
`;

type InputProps = {
  children?: React.ReactNode;
  noBorder?: boolean;
};

export function Input(
  props: InputProps &
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
) {
  return (
    <StyledInputContainer $noBorder={props.noBorder || false}>
      {props.children && (
        <StyledInputPrefix>{props.children}</StyledInputPrefix>
      )}
      <StyledInput {...props} children={undefined} />
    </StyledInputContainer>
  );
}
