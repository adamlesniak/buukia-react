import { Link } from "@tanstack/react-router";
import styled from "styled-components";

export const SidebarMenuItem = styled(Link)`
  padding: 0.4em;
  cursor: pointer;
  border-radius: 12px;
  margin: 0.8em 0em;
  display: flex;
  align-items: center;
  font-size: 14px;

  span {
    margin: 0px 10px;
  }

  &:hover {
    background: #fbfbfb;
  }

  &.active {
    background: #f4f4f4;
  }
`;
