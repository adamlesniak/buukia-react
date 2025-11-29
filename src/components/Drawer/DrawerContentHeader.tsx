import styled from "styled-components";

const DrawerContentHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f4f4f4;
  padding-bottom: .4em;
  margin-bottom: 16px;

  h2 {
    margin: 8px 0;
  }
`;

export type DrawerContentHeaderProps = {
  children: React.ReactNode;
};

export function DrawerContentHeader(props: DrawerContentHeaderProps) {
  return <DrawerContentHeaderContainer>{props.children}</DrawerContentHeaderContainer>;
}
