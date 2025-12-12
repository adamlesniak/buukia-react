import { X } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../Button";

import { DrawerContentHeader } from "./DrawerContentHeader";

export const MemoizedDrawerHeaderH3 = memo(
  ({ onClose, title }: { onClose: () => void; title: string }) => {
    const { t } = useTranslation();
    return (
      <DrawerContentHeader>
        <h3>{title}</h3>
        <Button
          variant="transparent"
          aria-label={t("common.closeModal")}
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
