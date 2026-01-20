import classNames from "classnames";
import debounce from "debounce";
import { Check, ChevronDown, LoaderCircle, Search } from "lucide-react";
import {
  useId,
  useRef,
  useState,
  type MouseEvent,
  type KeyboardEvent,
  type RefCallback,
  type ChangeEvent,
  useMemo,
  useEffect,
} from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Button } from "../Button";
import { Chip } from "../Chip/index";

import { Input } from "./Input";
import { SearchInput } from "./SearchInput";

const StyledCombobox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  font-size: 14px;
  position: relative;
  cursor: pointer;
`;

const StyledComboboxDropdown = styled.div<{ $loading?: boolean }>`
  border-radius: 0px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  background: #fff;
  top: 35px;
  width: calc(100% - 2px);
  position: absolute;
  z-index: 1;

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
      &.active {
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

const StyledComboboxButton = styled(Button)`
  cursor: pointer;
  padding: 8px;
  margin: 0px;
  border-left: 1px solid #e0e0e0;
  width: 100%;
  border-radius: 0px;
  border: 0px;
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
  padding: 0px 8px;
  justify-content: space-between;
  align-items: center;
  height: 35px;

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

const Checkbox = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid #e0e0e0;
  position: relative;
  border-radius: 4px;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ComboboxResult = styled.div`
  flex-wrap: wrap;
  display: inline-flex;
  align-items: center;
`;

type ComboboxItem = {
  [key: string]: string | number;
};

type ComboboxProps = {
  children?: React.ReactNode;
  onSearchChange?: (value: string) => void;
  addButtonText?: string;
  onAdd?: (item: MouseEvent<HTMLButtonElement>) => void;
  items: ComboboxItem[];
  multiselect?: boolean;
  limitItemsDisplay?: number;
  loading?: boolean;
  search?: boolean;
  valueKey: string;
  displayKey: string;
  value: ComboboxItem[];
  disabled: boolean;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  ref?: RefCallback<HTMLInputElement>;
};

export function Combobox(props: ComboboxProps) {
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

  const handleClickOutside = ($event: Event) => {
    if (document.getElementById("overlay-modal")) {
      return;
    }

    if (!comboboxContainerRef?.current?.contains($event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const [selectedItems, setSelectedItems] = useState(props.value);
  const [activeItem, setActiveItem] = useState<number>(0);
  const [inputId, listBoxId] = [useId(), useId()];
  const [isOpen, setIsOpen] = useState(false);

  const selectedItemsValueKeys = useMemo(
    () => selectedItems.map((item) => item && item[props.valueKey]),
    [selectedItems, props.valueKey],
  );

  const selectItem = (item: ComboboxItem) => {
    if (props.loading) {
      return;
    }

    if (comboboxContainerInputRef.current) {
      if (props.multiselect) {
        const items = selectedItems;

        const newItems = selectedItemsValueKeys.includes(item[props.valueKey])
          ? [...items].filter(
              (currentItem) =>
                currentItem[props.valueKey] !== item[props.valueKey],
            )
          : [...items, item];

        setSelectedItems(newItems);
        comboboxContainerInputRef.current.value = JSON.stringify(newItems);
      } else {
        setSelectedItems([item]);
        comboboxContainerInputRef.current.value = JSON.stringify([item]);
      }
    }

    if (props.onChange) {
      const event = {
        target: comboboxContainerInputRef.current,
        type: "change",
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      props.onChange(event);
    }

    if (!props.multiselect) {
      setIsOpen(false);
    }
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
        className={"combobox-container-input"}
        data-testid="combobox-container-input"
      >
        <ComboboxResult
          aria-expanded={isOpen}
          aria-controls={listBoxId}
          aria-activedescendant={
            isOpen ? `${props.items[activeItem]?.id}-option` : undefined
          }
          aria-haspopup="listbox"
          role="combobox"
        >
          {selectedItems.length === 0 && t("common.selectAnItem")}
          {props.multiselect &&
            selectedItems
              .map(
                (item, _) =>
                  item && (
                    <Chip key={item[props.valueKey]}>
                      {item[props.displayKey]}
                    </Chip>
                  ),
              )
              .slice(0, 3)}
          {selectedItems.length === 1 &&
            !props.multiselect &&
            selectedItems[0][props.displayKey]}
          {selectedItems.length - 3 > 0
            ? t("common.moreItems", { count: selectedItems.length - 3 })
            : null}
        </ComboboxResult>
        <input
          placeholder={t("common.selectAnItem")}
          type="text"
          disabled={props.loading}
          id={inputId}
          autoComplete="off"
          name={props.name}
          style={{ visibility: "hidden", width: "0px", height: "0px" }}
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
          value={JSON.stringify(selectedItems)}
        />
        <ChevronDown />
      </StyledComboboxContainerInput>
      {isOpen && (
        <StyledComboboxDropdown
          data-testid="combobox-dropdown"
          className={'combobox-dropdown'}
          $loading={props.loading}
        >
          <StyledComboboxSearch data-testid="search">
            {props.onSearchChange ? (
              <>
                {props.loading ? (
                  <LoaderCircle size={20} />
                ) : (
                  <Search size={20} />
                )}
                <Input
                  type="text"
                  id={inputId}
                  aria-autocomplete="none"
                  aria-label={t("common.search")}
                  autoComplete="off"
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
              </>
            ) : (
              <></>
            )}
            {props.onAdd && (
              <StyledComboboxButton type="button" onClick={props.onAdd}>
                {props.addButtonText}
              </StyledComboboxButton>
            )}
          </StyledComboboxSearch>

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
              <ListItem
                ref={(el) => {
                  if (el) {
                    itemsRef.current[i] = el;
                  }
                }}
                className={classNames({
                  active: activeItem === i,
                })}
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
                <span>{item.name}</span>{" "}
                {props.multiselect ? (
                  <Checkbox>
                    {selectedItemsValueKeys.includes(item[props.valueKey]) ? (
                      <Check size={16} />
                    ) : null}
                  </Checkbox>
                ) : null}
              </ListItem>
            ))}
          </ul>
        </StyledComboboxDropdown>
      )}
    </StyledCombobox>
  );
}
