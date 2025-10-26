import styled from "styled-components";

export const SidebarMenuDropdownContent = styled.div`
  position: absolute;
  cursor: pointer;
  width: 100%;
  border-radius: 12px;
  display: flex;
  font-size: 14px;
  flex-direction: column;
  top: 55px;
  left: -4px;
  padding: 4px;
  background: #FFF;
  border: 1px solid #f5f5f5;
  box-shadow:
      0 1px 1px hsl(0deg 0% 0% / 0.025),
      0 2px 2px hsl(0deg 0% 0% / 0.025),
      0 4px 4px hsl(0deg 0% 0% / 0.025),
      0 8px 8px hsl(0deg 0% 0% / 0.025),
      0 16px 16px hsl(0deg 0% 0% / 0.025)
    ;
`;
