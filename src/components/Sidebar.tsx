import { Link, useRouterState } from "@tanstack/react-router";
import {
  Banknote,
  Bell,
  ChevronsUpDown,
  ClipboardClock,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";
import styled from "styled-components";

const StyledLink = styled(Link)`
  margin: .8em 0em;
  border-radius: 12px;

  &:hover {
    background: #fbfbfb;
  }

  &.active {
    background: #f4f4f4;
  }
`;

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

const SidebarMenuButton = styled.div`
  padding: .4em;
  cursor: pointer;
  border-radius: 12px;
  display: flex;
  align-items: center;
  font-size: 14px;

  span {
    margin: 0px 10px;
  }
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
        <SidebarMenuButton style={{ justifyContent: "space-between" }}>
          <div>
            <SidebarTitle>Buukia</SidebarTitle>
            <small>El Prat</small>
          </div>
          <ChevronsUpDown size={16} />
        </SidebarMenuButton>

        {items.map((item) => (
          <StyledLink
            to={item.url}
            data-active={selected === item.url}
            key={item.title}
          >
            <SidebarMenuButton>
              <item.icon size={24} />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </StyledLink>
        ))}
      </SidebarTop>

      <SidebarMenuButton style={{ justifyContent: "space-between" }}>
        <div>
          <SidebarTitle>Adam Lesniak</SidebarTitle>
          <small>adam@alesniak.com</small>
        </div>
        <ChevronsUpDown size={16} />
      </SidebarMenuButton>
    </SidebarContainer>
  );
}
