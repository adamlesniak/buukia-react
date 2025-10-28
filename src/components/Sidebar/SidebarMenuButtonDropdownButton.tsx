import styled from "styled-components";

import { SidebarMenuButton } from "./SidebarMenuButton";

export const SidebarMenuButtonDropdownButton = styled(SidebarMenuButton)`
  justify-content: space-between;
  position: relative;

  &:hover {
    background: #fbfbfb;
  }

  &.active {
    background: #f4f4f4;
  }
`;
