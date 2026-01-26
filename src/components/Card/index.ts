import styled from "styled-components";

export * from "./ServiceCardDescription";

export const Card = styled.div<{ $layout?: "row" | "column" }>`
  padding: 10px;
  border: 1px solid #f4f4f4;
  display: flex;
  justify-content: space-between;
  flex-direction: ${(props) => props.$layout || "row"};
  border-radius: 12px;
  margin: 12px 0px;
  margin-top: 0px;
  margin-bottom: 0px;

  h1, h2, h3, h4, h5 {
    margin-top: 0px;
  }
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 24px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0px;
  }
`;
