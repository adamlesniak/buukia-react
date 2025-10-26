import { Link } from "@tanstack/react-router";
import styled from "styled-components";

export const SidebarStyledLink = styled(Link)`
  border-radius: 12px;
  margin: .8em 0em;

  &:hover {
    background: #fbfbfb;
  }

  &.active {
    background: #f4f4f4;
  }
`;
