import { X } from "lucide-react";
import { Children, isValidElement, memo } from "react";

import {
  DetailNavigationContainer,
  DetailNavigationTitleContent,
} from "@/containers/AssistantDrawer";

import { Button } from "../Button";

import {
  DrawerContentHeader,
  DrawerContentMainContainer,
} from "./DrawerContentHeader";

type MemoizedDrawerHeaderProps = {
  onClose: () => void;
  label: string;
  children?: React.ReactNode;
};

export const MemoizedDrawerHeader = memo((props: MemoizedDrawerHeaderProps) => {
  const DetailNavigationContainerChildren = Children.toArray(
    props.children,
  ).filter(
    (child) =>
      isValidElement(child) && child.type === DetailNavigationContainer,
  );
  const DetailNavigationTitleContentChildren = Children.toArray(
    props.children,
  ).filter(
    (child) =>
      isValidElement(child) && child.type === DetailNavigationTitleContent,
  );

  return (
    <DrawerContentHeader>
      <DrawerContentMainContainer>
        <DetailNavigationTitleContent>
          {DetailNavigationTitleContentChildren}
        </DetailNavigationTitleContent>
        <Button
          variant="transparent"
          aria-label={props.label}
          tabIndex={0}
          type="button"
          onClick={props.onClose}
        >
          <X />
        </Button>
      </DrawerContentMainContainer>
      {DetailNavigationContainerChildren}
    </DrawerContentHeader>
  );
});
