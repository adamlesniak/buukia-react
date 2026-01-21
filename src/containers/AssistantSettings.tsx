import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useDeleteAssistant } from "@/api";
import { Button } from "@/components/Button";

import AssistantDrawer from "./AssistantDrawer";
import ConfirmationModal from "./ConfirmationModal";

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 12px;

  h2 {
    margin-top: 0px;
  }
`;

const SettingsActions = styled(SettingsContainer)``;

const SettingsItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-bottom: 12px;
  margin-top: 12px;
`;

const SettingsDescription = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  p,
  h4 {
    margin: 0px;
  }

  h4 {
    margin-bottom: 8px;
  }
`;

const SettingsAction = styled.div`
  display: flex;
  align-items: center;
`;

const RadioButton = styled.div`
  border: 3px solid #e0e0e0;
  border-radius: 24px;
  width: 52px;
  height: 21px;
  padding: 4px;
  cursor: pointer;
`;

const RadioButtonSelection = styled.div`
  background: #e0e0e0;
  border-radius: 24px;
  height: 21px;
  width: 21px;
`;

export default function AssistantSettings() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const deleteAssistant = useDeleteAssistant();
  const {
    assistantId,
  }: {
    assistantId: string;
  } = useParams({
    strict: false,
  });

  const modalClose = (deleteConfirmed: boolean) => {
    if (deleteConfirmed) {
      deleteAssistant.mutate(assistantId);
    }

    setShowModal(false);
    navigate({ to: `/assistants` });
  };

  return (
    <AssistantDrawer>
      <SettingsContainer>
        <h2>{t("settings.title")}</h2>
        <SettingsItem>
          <SettingsDescription>
            <h4>{t("settings.holidays.title")}</h4>
            {t("settings.holidays.description")
              .split("<br/>")
              .map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </SettingsDescription>
          <SettingsAction>
            <RadioButton>
              <RadioButtonSelection />
            </RadioButton>
          </SettingsAction>
        </SettingsItem>
      </SettingsContainer>
      <SettingsActions>
        <h2>{t("settings.actions.title")}</h2>
        <Button
          type="button"
          variant="danger"
          onClick={() => setShowModal(true)}
        >
          {t("settings.actions.deleteAssistant")}
        </Button>
      </SettingsActions>
      {showModal &&
        createPortal(<ConfirmationModal close={modalClose} />, document.body)}
    </AssistantDrawer>
  );
}
