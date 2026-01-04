import type { DetailedHTMLProps, SelectHTMLAttributes } from "react";
import styled from "styled-components";

const StyledSelect = styled.select`
  display: flex;
  flex-direction: row;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  margin: 4px 0px;
  font-size: 14px;
  background: #fff;
`;

type SelectProps = {
  children?: React.ReactNode;
};

export function Select(
  props: SelectProps &
    DetailedHTMLProps<
      SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >,
) {
  return <StyledSelect {...props}>{props.children}</StyledSelect>;
}
