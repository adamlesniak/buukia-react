import styled from "styled-components";

export const MediumText = styled.span`
  font-size: 12px;
  font-weight: bold;
`;

export const LargeText = styled.span<{ weight?: string }>`
  font-size: 18px;
  font-weight: ${(props) => props.weight || "bold"};
`;

export const ExtraLargeText = styled.span<{ weight?: string }>`
  font-size: 32px;
  font-weight: ${(props) => props.weight || "bold"};
`;
