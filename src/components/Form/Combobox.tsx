import { ChevronDown, Search } from "lucide-react";
import {
  useId,
  useRef,
  useState,
  type MouseEvent,
  type KeyboardEvent,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
  type RefCallback,
} from "react";
import styled from "styled-components";

import { Input } from "./Input";

const StyledCombobox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  font-size: 14px;
  position: relative;
`;

const StyledComboboxDropdown = styled.div<{ $loading?: boolean }>`
  border-radius: 0px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  background: #fff;
  top: 32px;
  width: calc(100% - 2px);
  position: absolute;

  ul {
    margin: 0px;
    padding-left: 0px;
    list-style-type: none;

    ${(props) =>
      props.$loading &&
      `
      opacity: 0.5;

      li {
        &:hover,
        &.selected {
          background: #fff!important;
          cursor: initial;
        }
      }
    `}

    li {
      padding: 8px;
      &:hover,
      &.selected {
        background-color: #fbfbfb;
      }
    }
  }
`;

const StyledComboboxSearch = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  border-bottom: 1px solid #e0e0e0;

  svg {
    padding: 8px;
  }

  input {
    margin: 0px;
    padding: 8px;
    border: 0px;
    outline: none;
    flex: 1;
  }
`;

const StyledComboboxContainerInput = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  padding: 4px 8px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  input {
    border: 0px;
    flex: 1;
    cursor: pointer;
    outline: 0px;
    caret-color: transparent;

    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &::selection {
      background-color: transparent;
    }
  }
`;

type ComboboxProps = {
  children?: React.ReactNode;
  onSearchChange?: (value: string) => void;
  items: { id: string; name: string }[];
  loading?: boolean;
  search?: boolean;
  ref?: RefCallback<HTMLInputElement>;
};

export function Combobox(
  props: ComboboxProps &
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
) {
  const itemsRef = useRef<HTMLLIElement[]>([]);
  const comboboxContainerRef = useRef<HTMLDivElement>(null);
  const comboboxContainerInputRef = useRef<HTMLInputElement>(null);
  const inputSearchRef = useRef<HTMLInputElement>(null);

  const [activeItem, setActiveItem] = useState<number>(0);
  const [inputId, listBoxId] = [useId(), useId()];
  const [isOpen, setIsOpen] = useState(false);

  const selectItem = (item: unknown) => {
    if (props.loading) {
      return;
    }

    if (comboboxContainerInputRef.current) {
      comboboxContainerInputRef.current.value = (item as any).name;
    }

    if (props.onChange) {
      const event = {
        target: comboboxContainerInputRef.current,
        type: "change",
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      props.onChange(event);
    }

    setIsOpen(false);
  };

  const handleDropdownSelection = ($event: KeyboardEvent<HTMLDivElement>) => {
    if (isOpen === false) {
      setIsOpen(true);
    }

    if ($event.key === "ArrowDown") {
      if (itemsRef.current[activeItem + 1] && activeItem > -1) {
        setActiveItem((prev) => prev + 1);
        itemsRef.current[activeItem]?.focus();
      }

      $event.preventDefault();
      $event.stopPropagation();
    }

    if ($event.key === "ArrowUp") {
      if (
        itemsRef.current[activeItem - 1] &&
        activeItem < itemsRef.current.length
      ) {
        setActiveItem((prev) => prev - 1);
        itemsRef.current[activeItem]?.focus();
      }

      $event.preventDefault();
      $event.stopPropagation();
    }

    if ($event.key === "Enter") {
      selectItem(props.items[activeItem]);
      $event.preventDefault();
      $event.stopPropagation();
    }
  };

  return (
    <StyledCombobox {...props} ref={comboboxContainerRef}>
      <StyledComboboxContainerInput
        tabIndex={0}
        onClick={() => {
          setIsOpen((item) => !item);
        }}
        onKeyDown={($event: KeyboardEvent<HTMLDivElement>) => {
          if ($event.key === "Enter" || $event.key === "ArrowDown") {
            if (!inputSearchRef.current && !isOpen) {
              setIsOpen((item) => !item);
            }

            setTimeout(() => {
              if (inputSearchRef.current) {
                inputSearchRef.current.focus();
              }
            }, 0);
          }

          if (
            $event.key === "ArrowDown" ||
            $event.key === "ArrowUp" ||
            $event.key === "Enter"
          ) {
            handleDropdownSelection($event);
          }
        }}
        data-testid="combobox-container-input"
      >
        <input
          aria-expanded={isOpen}
          aria-controls={listBoxId}
          aria-activedescendant={
            isOpen ? `${props.items[activeItem]?.id}-option` : undefined
          }
          aria-haspopup="listbox"
          role="combobox"
          placeholder="Please select an item."
          type="text"
          id="client-name-input"
          name={props.name}
          onChange={props.onChange}
          onBlur={props.onBlur}
          ref={(el) => {
            props.ref?.(el);
            comboboxContainerInputRef.current = el;
          }}
        />
        <ChevronDown />
      </StyledComboboxContainerInput>
      {isOpen && (
        <StyledComboboxDropdown
          data-testid="combobox-dropdown"
          $loading={props.loading}
        >
          {props.search && (
            <StyledComboboxSearch data-testid="search">
              <Search size={20} />
              <Input
                type="text"
                id={inputId}
                aria-autocomplete="none"
                aria-label={"Search"}
                autoComplete="off"
                role={"combobox"}
                tabIndex={0}
                ref={inputSearchRef}
                onKeyDown={($event: KeyboardEvent<HTMLInputElement>) => {
                  if (
                    $event.key === "ArrowDown" ||
                    $event.key === "ArrowUp" ||
                    $event.key === "Enter"
                  ) {
                    handleDropdownSelection($event);
                  }

                  if (props.onSearchChange) {
                    props.onSearchChange($event.currentTarget.value);
                  }
                }}
                onBlur={() => setIsOpen(false)}
              />
            </StyledComboboxSearch>
          )}

          <ul id={listBoxId} aria-label={"Dropdown items"} role="listbox">
            {props.items.map((item, i) => (
              <li
                ref={(el) => {
                  if (el) {
                    itemsRef.current[i] = el;
                  }
                }}
                className={activeItem === i ? "selected" : ""}
                aria-selected={activeItem === i}
                onClick={($event: MouseEvent<HTMLLIElement>) => {
                  selectItem(item);
                  setActiveItem(i);
                  $event.preventDefault();
                  $event.stopPropagation();
                }}
                role="option"
                id={`${item.id}-option`}
                key={item.id}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </StyledComboboxDropdown>
      )}
    </StyledCombobox>
  );
}
