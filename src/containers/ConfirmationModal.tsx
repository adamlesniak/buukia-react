import { OctagonAlert } from "lucide-react";
import { FocusScope } from "react-aria";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Button } from "@/components/Button";
import { Modal, Overlay } from "@/components/Modal";

const ActionsButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  flex-direction: row;

  button {
    flex: 1;
  }
`;

const TextContainer = styled.div`
  margin-top: 16px;
  text-align: center;

  p {
    margin: 8px 0px;
  }
`;

const ConfirmationContent = styled.div`
  h2 {
    margin: 16px 0px 0px 0px;
  }
`;

type ConfirmationModalProps = {
  close: (confirm: boolean) => void;
};

export default function ConfirmationModal(props: ConfirmationModalProps) {
  const { t } = useTranslation();

  return (
    <Overlay onClick={() => props.close(false)}>
      <Modal
        onClick={($event) => {
          $event.stopPropagation();
        }}
        $variant="center"
        data-testid="confirmation-modal"
      >
        <FocusScope autoFocus restoreFocus contain>
          <ConfirmationContent>
            <div>
              <OctagonAlert size={64} />
            </div>
            <h2>{t("settings.modal.deleteTitle")}</h2>
            <TextContainer data-testid="confirmation-modal-description">
              {t("settings.modal.deleteMessage")
                .split("<br/>")
                .map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
            </TextContainer>
            <ActionsButtons>
              <Button
                type="button"
                onClick={() => props.close(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="button" variant="danger" onClick={() => props.close(true)}>
                {t("common.delete")}
              </Button>
            </ActionsButtons>
          </ConfirmationContent>
        </FocusScope>
      </Modal>
    </Overlay>
  );
};
