import { X } from "lucide-react";
import { memo } from "react";

import { Button } from "../Button";

import { DrawerContentHeader } from "./DrawerContentHeader";

type MemoizedDrawerHeaderH3Props = {
  onClose: () => void;
  title: string;
  label: string;
};

export const MemoizedDrawerHeaderH3 = memo(
  (props: MemoizedDrawerHeaderH3Props) => (
    <DrawerContentHeader>
      <h3>{props.title}</h3>
      <Button
        variant="transparent"
        aria-label={props.label}
        tabIndex={0}
        type="button"
        onClick={props.onClose}
      >
        <X />
      </Button>
    </DrawerContentHeader>
  ),
);
