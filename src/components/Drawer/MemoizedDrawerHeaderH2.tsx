import { X } from "lucide-react";
import { memo } from "react";

import { Button } from "../Button";

import { DrawerContentHeader } from "./DrawerContentHeader";

export const MemoizedDrawerHeaderH2 = memo(
  ({
    onClose,
    title,
    label,
  }: {
    onClose: () => void;
    title: string;
    label: string;
  }) => {
    return (
      <DrawerContentHeader>
        <h2>{title}</h2>
        <Button
          variant="transparent"
          aria-label={label}
          tabIndex={0}
          type="button"
          onClick={onClose}
        >
          <X />
        </Button>
      </DrawerContentHeader>
    );
  },
);
