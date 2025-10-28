import {  useRouterState } from "@tanstack/react-router";
import {
  Banknote,
  Bell,
  ChevronsUpDown,
  ClipboardClock,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";
import styled from "styled-components";

import { SidebarMenuButton } from "./SidebarMenuButton";
import { DropdownExpand, SidebarMenuDropdown } from "./SidebarMenuDropdown";
import { SidebarStyledLink } from "./SidebarStyledLink";

const SidebarContainer = styled.div`
  color: var(--primary);
  border-right: 1px solid #f5f5f5;
  width: 14rem;
  padding: .8em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SidebarTitle = styled.h3`
  margin: .2em 0;
`;

const SidebarTop = styled.div`

`;

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
  {
    title: "Services",
    url: "/services",
    icon: Bell,
  },
  {
    title: "Assistants",
    url: "/assistants",
    icon: UsersRound,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: Banknote,
  },
];

export function Sidebar() {
  const selected = useRouterState({
    select: (state) => state.location.href,
  });

  return (
    <SidebarContainer>
      <SidebarTop>
        <SidebarMenuDropdown dropdownExpand={DropdownExpand.Top}>
          <div>
            <SidebarTitle>Buukia</SidebarTitle>
            <small>El Prat</small>
          </div>
          <ChevronsUpDown size={16} />
        </SidebarMenuDropdown>

        {items.map((item) => (
          <SidebarStyledLink
            style={{ margin: ".8em 0em" }}
            to={item.url}
            data-active={selected === item.url}
            key={item.title}
          >
            <SidebarMenuButton>
              <item.icon size={24} />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarStyledLink>
        ))}
      </SidebarTop>

      <SidebarMenuDropdown dropdownExpand={DropdownExpand.Bottom}>
        <div>
          <SidebarTitle>Adam Lesniak</SidebarTitle>
          <small>adam@alesniak.com</small>
        </div>
        <ChevronsUpDown size={16} />
      </SidebarMenuDropdown>
    </SidebarContainer>
  );
}
