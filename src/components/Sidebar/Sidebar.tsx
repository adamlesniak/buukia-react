import { useRouterState } from "@tanstack/react-router";
import { startOfDay } from "date-fns";
import { getUnixTime } from "date-fns/getUnixTime";
import {
  Banknote,
  Bell,
  ChevronsUpDown,
  ClipboardClock,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { SidebarMenuButtonWrapper } from "./SidebarMenuButtonWrapper";
import { DropdownExpand, SidebarMenuDropdown } from "./SidebarMenuDropdown";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarContainer = styled.div`
  color: var(--primary);
  border-right: 1px solid #f5f5f5;
  width: 14rem;
  padding: 0.8em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 0px;
  height: 100%;
`;

const SidebarTitle = styled.h3`
  margin: 0.2em 0;
`;

const SidebarTop = styled.div`
  position: sticky;
  top: 0px;
`;

const SidebarFixed = styled.div`
  position: fixed;
  bottom: 0px;
  padding-bottom: 0.8em;
  width: 14rem;
`;

export function Sidebar() {
  const selected = useRouterState({
    select: (state) => state.location.href,
  });
  const { t } = useTranslation();

  return (
    <SidebarContainer>
      <SidebarTop>
        <SidebarMenuButtonWrapper>
          <SidebarMenuDropdown dropdownExpand={DropdownExpand.Top}>
            <div>
              <SidebarTitle>Buukia</SidebarTitle>
              <small>El Prat</small>
            </div>
            <ChevronsUpDown size={16} />
          </SidebarMenuDropdown>
        </SidebarMenuButtonWrapper>
        <SidebarMenuItem
          to={"/"}
          activeOptions={{ exact: true }}
          key={t("nav.dashboard")}
        >
          <LayoutDashboard size={24} />
          <span>{t("nav.dashboard")}</span>
        </SidebarMenuItem>
        <SidebarMenuItem
          to={`/appointments/daily/$date`}
          activeOptions={{ exact: false }}
          key={t("nav.appointments")}
          className={selected.includes("/appointments/") ? "active" : ""}
          params={{ date: getUnixTime(startOfDay(new Date())) * 1000 } as never}
        >
          <ClipboardClock size={24} />
          <span>{t("nav.appointments")}</span>
        </SidebarMenuItem>
        <SidebarMenuItem
          to={`/services`}
          activeOptions={{ exact: true }}
          key={t("nav.services")}
        >
          <Bell size={24} />
          <span>{t("nav.services")}</span>
        </SidebarMenuItem>
        <SidebarMenuItem
          to={`/assistants`}
          activeOptions={{ exact: true }}
          key={t("nav.assistants")}
        >
          <UserRound size={24} />
          <span>{t("nav.assistants")}</span>
        </SidebarMenuItem>
        <SidebarMenuItem
          to={`/payments`}
          activeOptions={{ exact: true }}
          key={t("nav.payments")}
        >
          <Banknote size={24} />
          <span>{t("nav.payments")}</span>
        </SidebarMenuItem>
      </SidebarTop>

      <SidebarFixed>
        <SidebarMenuButtonWrapper>
          <SidebarMenuDropdown dropdownExpand={DropdownExpand.Bottom}>
            <div>
              <SidebarTitle>Adam Lesniak</SidebarTitle>
              <small>adam@alesniak.com</small>
            </div>
            <ChevronsUpDown size={16} />
          </SidebarMenuDropdown>
        </SidebarMenuButtonWrapper>
      </SidebarFixed>
    </SidebarContainer>
  );
}
