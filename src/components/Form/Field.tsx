import type { HTMLAttributes } from "react";
import styled from "styled-components";

const StyledField = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 0.4em;
`;

type FieldProps = {
  children?: React.ReactNode;
};

export function Field(props: FieldProps & HTMLAttributes<HTMLDivElement>) {
  return <StyledField {...props}>{props.children}</StyledField>;
}
