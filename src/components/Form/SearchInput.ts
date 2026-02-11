import styled from "styled-components";

export const SearchInput = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  align-items: center;

  svg {
    padding: 8px;
  }

  input {
    margin: 0px;
    padding: 8px;
    border: 0px;
    outline: none;
    flex: 1;
  }
`;
