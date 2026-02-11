import styled from "styled-components";

export * from "./Overlay";

export const OverlayCenter = styled.div`
  position: fixed;
  top: 0;
  left: 250px;
  width: calc(100% - 250px);
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

export const Modal = styled.div<{
  $variant?: string;
}>`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;

  min-height: 520px;

  ${(props) => {
    if (props.$variant === "center") {
      return `
        justify-content: center;
        display: flex;
        flex-direction: column;
        text-align: center;
        min-height: auto;
      `;
    }
  }}
`;

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #f4f4f4;
  margin-bottom: 16px;
  padding-bottom: 8px;
`;

export const ModalBody = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border-top: 2px solid #f4f4f4;
  border-bottom: 2px solid #f4f4f4;
  padding-top: 12px;
  padding-bottom: 12px;
  gap: 12px;
  display: flex;
  flex-direction: column;
`;
