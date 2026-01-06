import debounce from "debounce";
import { ChevronDown, LoaderCircle, PlusIcon, Search } from "lucide-react";
import {
  useId,
  useRef,
  useState,
  type MouseEvent,
  type KeyboardEvent,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
  type RefCallback,
  type ChangeEvent,
} from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Input } from "./Input";
import { SearchInput } from "./SearchInput";

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
      cursor: pointer;
      &:hover,
      &.selected {
        background-color: #fbfbfb;
      }

      &.no-results {
        &:hover {
          background: transparent;
          cursor: default;
        }
      }
    }
  }
`;

const StyledComboboxButton = styled.button`
  cursor: pointer;
  padding: 0px;
  margin: 0px;
  border-left: 1px solid #e0e0e0;
`;

const StyledComboboxSearch = styled(SearchInput)`
  border: 0px;
  border-bottom: 1px solid #e0e0e0;
`;

const StyledComboboxContainerInput = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  padding: 4px 8px;
  justify-content: space-between;
  align-items: center;

  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  svg {
    cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
    color: ${(props) => (props.$disabled ? "gray" : "initial")};
  }

  input {
    border: 0px;
    flex: 1;
    cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
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
  onAdd?: (item: MouseEvent<HTMLDivElement>) => void;
  items: { id: string; name: string }[];
  limitItemsDisplay?: number;
  loading?: boolean;
  search?: boolean;
  /**
   * The key in each item object whose value should be displayed in the combobox.
   * For example, if items are objects like { id: string, name: string }, and you want to display the name,
   * set valueKey to "name".
   */
  valueKey: string;
  ref?: RefCallback<HTMLInputElement>;
};

export function Combobox(
  props: ComboboxProps &
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
) {
  const { t } = useTranslation();

  const itemsDisplayLimit = props.limitItemsDisplay || 10;
  const itemsRef = useRef<HTMLLIElement[]>([]);
  const comboboxContainerRef = useRef<HTMLDivElement>(null);
  const comboboxContainerInputRef = useRef<HTMLInputElement>(null);
  const inputSearchRef = useRef<HTMLInputElement>(null);

  const searchChangeDebounce = debounce(
    (value: string) => props.onSearchChange?.(value),
    1000,
  );

  const [activeItem, setActiveItem] = useState<number>(0);
  const [inputId, listBoxId] = [useId(), useId()];
  const [isOpen, setIsOpen] = useState(false);

  const selectItem = (item: unknown) => {
    if (props.loading) {
      return;
    }

    if (comboboxContainerInputRef.current) {
      comboboxContainerInputRef.current.value = (item as any)[props.valueKey];
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
        $disabled={props.disabled}
        onClick={() => {
          if (props.disabled) {
            return;
          }

          setIsOpen((item) => !item);
        }}
        onKeyDown={($event: KeyboardEvent<HTMLDivElement>) => {
          if (props.disabled) {
            return;
          }

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
          placeholder={t("common.selectAnItem")}
          type="text"
          disabled={props.disabled}
          id={inputId}
          autoComplete="off"
          name={props.name}
          onKeyDown={($event) => {
            if ($event.key === "Tab") {
              return false;
            }

            $event.stopPropagation();
            $event.preventDefault();
          }}
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
              {props.onSearchChange ? (
                props.loading ? (
                  <LoaderCircle size={20} />
                ) : (
                  <Search size={20} />
                )
              ) : (
                <></>
              )}
              {props.onSearchChange ? (
                <Input
                  type="text"
                  id={inputId}
                  aria-autocomplete="none"
                  aria-label={t("common.search")}
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
                  }}
                  onChange={($event: ChangeEvent<HTMLInputElement>) => {
                    if (props.onSearchChange) {
                      searchChangeDebounce($event.target.value);
                    }
                  }}
                  onBlur={() => {
                    searchChangeDebounce("");
                    setIsOpen(false);
                  }}
                />
              ) : (
                <></>
              )}
              {props.onAdd && (
                <StyledComboboxButton onClick={props.onAdd}>
                  <PlusIcon size={20} />
                </StyledComboboxButton>
              )}
            </StyledComboboxSearch>
          )}

          <ul
            id={listBoxId}
            aria-label={t("common.dropdownItems")}
            role="listbox"
          >
            {props.items.length === 0 && (
              <li role="option" className={"no-results"} key={"no-results"}>
                {t("common.noResults")}
              </li>
            )}
            {props.items.slice(0, itemsDisplayLimit).map((item, i) => (
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
