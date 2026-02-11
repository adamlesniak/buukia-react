export * from "./Form";
export * from "./Field";
export * from "./Input";
export * from "./Label";
export * from "./Combobox";
export * from "./SearchInput";
export * from "./TextArea";
export * from "./Select";
export * from "./IBANInput";

import styled from "styled-components";

export const Fieldset = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const FormSummary = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  justify-content: end;
`;

export const FieldError = styled.span<{
  $textAlign?: "left" | "right" | "center";
}>`
  color: red;
  font-size: 12px;

  ${({ $textAlign }) => $textAlign && `text-align: ${$textAlign};`}
`;

export const FormSummaryItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 8px 0px;
`;
