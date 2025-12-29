import styled from "styled-components";

const PageSectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type PageSectionProps = {
  children?: React.ReactNode;
};

export const PageSection = (props: PageSectionProps) => {
  return (
    <PageSectionContainer>
      {props.children}
    </PageSectionContainer>
  );
};
