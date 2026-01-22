import { X } from "lucide-react";
import { memo } from "react";
import styled from "styled-components";

import { Button } from "../Button";

import { DrawerContentHeader, DrawerContentMainContainer } from "./DrawerContentHeader";

const DrawerContentTitleContainer = styled.div`
  display: flex;
`;

export const MemoizedDrawerHeaderH2 = memo(
  ({
    onClose,
    title,
    label,
    children,
  }: {
    onClose: () => void;
    title: string;
    label: string;
    children?: React.ReactNode;
  }) => {
    return (
      <DrawerContentHeader>
        <DrawerContentMainContainer>
          <DrawerContentTitleContainer>
            <h2>{title}</h2>
          </DrawerContentTitleContainer>
          <Button
            variant="transparent"
            aria-label={label}
            tabIndex={0}
            type="button"
            onClick={onClose}
          >
            <X />
          </Button>
        </DrawerContentMainContainer>
        {children}
      </DrawerContentHeader>
    );
  },
);
