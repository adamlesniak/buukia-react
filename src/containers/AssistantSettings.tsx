import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useAssistant, useDeleteAssistant, useUpdateAssistant } from "@/api";
import { Button } from "@/components/Button";
import { ErrorDetail } from "@/components/Error/ErrorDetail";
import { ToggleSlider } from "@/components/ToggleSlider";

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

export default function AssistantSettings() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [updateAssistant, deleteAssistant] = [
    useUpdateAssistant(),
    useDeleteAssistant(),
  ];
  const {
    assistantId,
  }: {
    assistantId: string;
  } = useParams({
    strict: false,
  });

  const { data: assistant, error: assistantError } = useAssistant(assistantId);

  const onHolidaysChange = (checked: boolean) => {
    updateAssistant.mutate({
      id: assistantId,
      firstName: assistant?.firstName || "",
      lastName: assistant?.lastName || "",
      email: assistant?.email || "",
      categories: assistant?.categories || [],
      availability: assistant?.availability || [],
      holidays: checked ? new Date().toISOString() : "",
    });
  };

  const holidaysEnabled = Boolean(
    assistant?.holidays && assistant.holidays.length > 0,
  );

  const modalClose = (deleteConfirmed: boolean) => {
    if (deleteConfirmed) {
      deleteAssistant.mutate(assistantId);
    }

    setShowModal(false);
    navigate({ to: `/assistants` });
  };

  const isError = assistantError;

  return (
    <AssistantDrawer>
      {isError && (
        <ErrorDetail message={isError?.message || t("common.unknownError")} />
      )}
      {!isError && (
        <>
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
                <ToggleSlider
                  onClick={() => onHolidaysChange(!holidaysEnabled)}
                  checked={holidaysEnabled}
                  data-testid="holidays-toggle"
                />
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
        </>
      )}
      {showModal &&
        createPortal(<ConfirmationModal close={modalClose} />, document.body)}
    </AssistantDrawer>
  );
}
