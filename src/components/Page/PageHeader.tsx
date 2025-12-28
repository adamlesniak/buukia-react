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
    margin: 8px;
  }
`;

const PageHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  max-height: 90px;
`;

type PageHeaderProps = {
  children?: React.ReactNode;
};

export const PageHeader = (props: PageHeaderProps) => {
  return (
    <PageHeaderContainer data-testid="page-header">
      {props.children}
    </PageHeaderContainer>
  );
};
