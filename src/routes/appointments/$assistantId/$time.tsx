import { createFileRoute } from "@tanstack/react-router";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
`;

export const Route = createFileRoute("/appointments/$assistantId/$time")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Overlay>
      <Modal
        onClick={($event) => {
          $event.stopPropagation();
          $event.preventDefault();
        }}
        data-testid="services-modal"
      >
        <p>test</p>
      </Modal>
    </Overlay>
  );
}
