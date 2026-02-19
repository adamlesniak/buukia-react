import styled from "styled-components";

export * from "./ServiceCardDescription";

export const Card = styled.div<{
  $layout?: "row" | "column";
  $borderRadius: "top" | "bottom" | "left" | "right" | "all";
}>`
  padding: 10px;
  border: 1px solid #f4f4f4;
  display: flex;
  justify-content: space-between;
  flex-direction: ${(props) => props.$layout || "row"};
  ${(props) => {
    if (props.$borderRadius === "all") {
      return "border-radius: 12px;";
    }

    if (props.$borderRadius === "bottom") {
      return "border-radius: 0px 0px 12px 12px;";
    }

    if (props.$borderRadius === "top") {
      return "border-radius: 12px 12px 0px 0px;";
    }

    if (props.$borderRadius === "right") {
      return "border-radius: 0px 12px 12px 0px;";
    }

    if (props.$borderRadius === "left") {
      return "border-radius: 12px 0px 0px 12px;";
    }
  }}
  margin: 12px 0px;
  margin-top: 0px;
  margin-bottom: 0px;

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin-top: 0px;
  }
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 24px;
  justify-content: center;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0px;
  }
`;
