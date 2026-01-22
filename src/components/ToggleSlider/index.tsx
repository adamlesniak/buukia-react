import type {
  DetailedHTMLProps,
  InputHTMLAttributes,
  MouseEventHandler,
} from "react";
import styled from "styled-components";

export const RadioButton = styled.div<{
  $checked?: boolean;
}>`
  border: 3px solid #b79ced;
  border-radius: 24px;
  width: 52px;
  height: 21px;
  padding: 4px;
  cursor: pointer;
  position: relative;
  background: ${(props) => (props.$checked ? "#b79ced" : "transparent")};
`;

export const RadioButtonSelection = styled.div<{
  $checked?: boolean;
}>`
  background: ${(props) => (props.$checked ? "#FFF" : "#b79ced")};
  border-radius: 24px;
  height: 21px;
  width: 21px;
  position: absolute;
  left: ${(props) => (props.$checked ? "35px" : "7px")};
`;

type ToggleSliderProps = {
  onClick: MouseEventHandler<HTMLDivElement>;
  checked: boolean;
};

export function ToggleSlider(
  props: ToggleSliderProps &
    DetailedHTMLProps<InputHTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) {
  return (
    <RadioButton {...props} onClick={props.onClick} $checked={props.checked}>
      <RadioButtonSelection $checked={props.checked} />
    </RadioButton>
  );
}
