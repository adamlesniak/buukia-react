import { Bell, FormInputIcon, UserRound, UsersRound } from "lucide-react";
import styled from "styled-components";

export const DetailNavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const DetailNavigationButton = styled.div`
  padding: 8px 12px;
  border: 1px solid #f4f4f4;
  cursor: pointer;
  flex: 1;
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;

  span {
    margin-left: 12px;
  }
`;

export function TabbedNavigation() {
  return (
    <DetailNavigationContainer>
      <DetailNavigationButton
        style={{ borderRight: "0px", background: "#fbfbfb" }}
      >
        <FormInputIcon size={18} /> <span>Detail</span>
      </DetailNavigationButton>
      <DetailNavigationButton style={{ borderRight: "0px" }}>
        <UsersRound size={18} /> <span>Assistants</span>
      </DetailNavigationButton>
      <DetailNavigationButton style={{ borderRight: "0px" }}>
        <UserRound size={18} /> <span>Clients</span>
      </DetailNavigationButton>
      <DetailNavigationButton>
        <Bell size={18} /> <span>Services</span>
      </DetailNavigationButton>
    </DetailNavigationContainer>
  );
}
