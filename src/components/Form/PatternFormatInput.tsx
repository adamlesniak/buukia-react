import { type FunctionComponent } from "react";
import { type PatternFormatProps, PatternFormat } from "react-number-format";
import styled from "styled-components";

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #e0e0e0;
  margin: 4px 0px;
  font-size: 14px;
  height: 35px;
  border-radius: 4px;
`;

const StyledPatternFormatInput = styled(PatternFormat)<PatternFormatProps>`
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

export const PatternFormatInput: FunctionComponent<PatternFormatProps> = ({
  ...props
}) => (
  <StyledInputContainer>
    <StyledPatternFormatInput
      {...props}
      valueIsNumericString={true}
    />
  </StyledInputContainer>
);
