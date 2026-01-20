import styled from "styled-components";

export const Table = styled.table`
  text-align: left;
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const TableHeader = styled.thead``;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr<{ $type?: "header" | "body" }>`
  border-bottom: 1px solid #e0e0e0;

  ${(props) => props.$type === "header" && `cursor: initial;`}
  ${(props) => props.$type === "body" && `cursor: pointer;`}

  height: 48px;

  ${(props) =>
    props.$type === "body" &&
    `
      &:hover {
        background-color: #fbfbfb;
      }
  `}
`;

export const TableRowItem = styled.td`
  padding: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TableHeaderItem = styled.th`
  padding: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
