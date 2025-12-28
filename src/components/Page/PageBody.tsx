import styled from "styled-components";

const PageBodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  max-height: 60px;
`;

type PageBodyProps = {
  children?: React.ReactNode;
};

export const PageBody = (props: PageBodyProps) => {
  return (
    <PageBodyContainer data-testid="page-body">
      {props.children}
    </PageBodyContainer>
  );
};
