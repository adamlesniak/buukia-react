import type { DetailedHTMLProps, TextareaHTMLAttributes } from "react";
import styled from "styled-components";

const StyledTextArea = styled.textarea`
  display: flex;
  flex-direction: row;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  margin: 4px 0px;
  font-size: 14px;
  resize: none;
`;

type TextAreaProps = {
  children?: React.ReactNode;
};

export function TextArea(
  props: TextAreaProps &
    DetailedHTMLProps<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
) {
  return <StyledTextArea {...props}>{props.children}</StyledTextArea>;
}
