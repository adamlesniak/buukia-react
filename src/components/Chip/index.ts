import styled from "styled-components";

import { getColorStatus } from "@/utils";


export const Chip = styled.div`
  border: 1px solid #523d3d;
  border-radius: 8px;
  display: inline-flex;
  padding: 4px;
  font-size: 13px;
  margin-right: 4px;
`;

export const TransactionChip = styled(Chip)<{ status: string }>`
  border: 1px solid ${(props) => getColorStatus(props.status)};
  text-transform: capitalize;
  color: ${(props) => getColorStatus(props.status)};
  font-weight: bold;
`;