import type { HTMLAttributes } from "react";
import styled from "styled-components";

export const PageHeaderIcon = styled.div`
  margin-right: 16px;
`;

export const PageHeaderItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  h2 {
    margin: 0.2em 0px;
  }

  button {
    margin-left: 8px;
  }
`;

const PageHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

type PageHeaderProps = {
  children?: React.ReactNode;
};

export const PageHeader = (
  props: PageHeaderProps & HTMLAttributes<HTMLDivElement>,
) => {
  return (
    <PageHeaderContainer {...props} data-testid="page-header">
      {props.children}
    </PageHeaderContainer>
  );
};
