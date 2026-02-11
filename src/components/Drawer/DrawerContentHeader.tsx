import styled from "styled-components";

const DrawerContentHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f4f4f4;
  /* padding-bottom: 8px; */
  // margin-bottom: 16px;

  h2 {
    margin: 8px 0;
  }
`;

export const DrawerContentMainContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  padding-bottom: 8px;
`


export type DrawerContentHeaderProps = {
  children: React.ReactNode;
};

export function DrawerContentHeader(props: DrawerContentHeaderProps) {
  return <DrawerContentHeaderContainer>{props.children}</DrawerContentHeaderContainer>;
}
