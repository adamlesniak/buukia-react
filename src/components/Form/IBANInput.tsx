import {
  forwardRef,
  type ChangeEvent,
  type ChangeEventHandler,
  type FunctionComponent,
} from "react";
import {
  NumberFormatBase,
  type NumberFormatBaseProps,
} from "react-number-format";
import styled from "styled-components";

interface IBANInputProps extends NumberFormatBaseProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #e0e0e0;
  margin: 4px 0px;
  font-size: 14px;
  height: 35px;
  border-radius: 4px;
`;

const StyledIBANInput = styled(NumberFormatBase)<NumberFormatBaseProps>`
  display: flex;
  flex-direction: row;
  padding: 0px 8px;
  border: 0px;
  cursor: pointer;
  flex: 1;
  border-radius: 4px;

  &:disabled {
    cursor: default;
  }
`;

const IBANInputDef: FunctionComponent<IBANInputProps> = ({
  onChange,
  ...props
}) => (
  <StyledInputContainer>
    <StyledIBANInput
      {...props}
      type="text"
      format={(value) =>
        value
          .replace(/\s+/g, "")
          .replace(/([a-z0-9]{4})/gi, "$1 ")
          .trim()
          .toLocaleUpperCase()
      }
      removeFormatting={(value) => value.replace(/\s+/gi, "")}
      isValidInputCharacter={(char) => /^[a-z0-9]$/i.test(char)}
      getCaretBoundary={(value) =>
        Array(value.length + 1)
          .fill(0)
          .map(() => true)
      }
      onValueChange={(values, { event }) =>
        onChange(
          Object.assign({} as ChangeEvent<HTMLInputElement>, event, {
            target: {
              name: props.name,
              value: values.value.toLocaleUpperCase(),
            },
          }),
        )
      }
      onKeyDown={(e) =>
        !/^(?:[a-z0-9]|Backspace|Delete|Home|End|ArrowLeft|ArrowRight|Shift|CapsLock|Control|NumLock|Tab|Paste|Redo|Undo)$/i.test(
          e.key,
        ) && e.preventDefault()
      }
    />
  </StyledInputContainer>
);

export const IBANInput = forwardRef<HTMLInputElement, IBANInputProps>(
  (props, ref) => <IBANInputDef {...props} getInputRef={ref} />,
);
