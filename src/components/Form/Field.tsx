import type { HTMLAttributes } from "react";
import styled from "styled-components";

const StyledField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  justify-content: start;
`;

type FieldProps = {
  children?: React.ReactNode;
};

export function Field(props: FieldProps & HTMLAttributes<HTMLDivElement>) {
  return <StyledField {...props}>{props.children}</StyledField>;
}
