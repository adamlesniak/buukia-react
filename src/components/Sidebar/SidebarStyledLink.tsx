import styled from "styled-components";

import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarStyledLink = styled(SidebarMenuItem)`
  border-radius: 12px;
  margin: 0.8em 0em;

  &:hover {
    background: #fbfbfb;
  }

  &.active {
    background: #f4f4f4;
  }
`;
