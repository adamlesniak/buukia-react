import type {
  DetailedHTMLProps,
  LabelHTMLAttributes,
} from "react";
import styled from "styled-components";

const StyledLabel = styled.label`
  display: flex;
  flex-direction: row;
  margin-bottom: .4em;
`;

type LabelProps = {
  children?: React.ReactNode;
};

export function Label(
  props: LabelProps &
    DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
) {
  return <StyledLabel {...props}>{props.children}</StyledLabel>;
}
