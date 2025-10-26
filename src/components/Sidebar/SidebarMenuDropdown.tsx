import { ClipboardClock, LayoutDashboard } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { SidebarMenuButtonDropdownButton } from "./SidebarMenuButtonDropdownButton";
import { SidebarMenuDropdownContent } from "./SidebarMenuDropdownContent";
import { SidebarMenuDropdownContentButton } from "./SidebarMenuDropdownContentButton";
import { SidebarStyledLinkDropdown } from "./SidebarStyledLinkDropdown";

export enum DropdownExpand {
  Top = "top",
  Bottom = "bottom",
}

export function SidebarMenuDropdown({
  children,
  dropdownExpand,
}: {
  children: ReactNode;
  dropdownExpand: DropdownExpand;
}) {
  const [opened, setOpened] = useState(false);
  const dropdownButtonRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownButtonRef, () => {
    console.log("Clicked outside");
    setOpened(false);
  });

  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: ClipboardClock,
    },
  ];

  const style =
    dropdownExpand === DropdownExpand.Top ? { top: "55px" } : { top: "-76px" };

  return (
    <SidebarMenuButtonDropdownButton ref={dropdownButtonRef}
      onClick={() => {
        setOpened(true);
      }}
      onBlur={() => {
        console.log("onblur");
      }}
      className={opened ? "active" : ""}
    >
      {children}
      {opened && (
        <SidebarMenuDropdownContent style={style}>
          {items.map((item) => (
            <SidebarStyledLinkDropdown to={item.url} key={item.title}>
              <SidebarMenuDropdownContentButton>
                <span>{item.title}</span>
              </SidebarMenuDropdownContentButton>
            </SidebarStyledLinkDropdown>
          ))}
        </SidebarMenuDropdownContent>
      )}
    </SidebarMenuButtonDropdownButton>
  );
}
