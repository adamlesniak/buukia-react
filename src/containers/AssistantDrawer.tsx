import { useNavigate, useParams, Link } from "@tanstack/react-router";
import classNames from "classnames";
import { FormInputIcon, SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  MemoizedDrawerHeader,
} from "@/components/Drawer";

export const DetailNavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const DetailNavigationTitleContent = styled.div``;

export const DetailNavigationButton = styled(Link)`
  padding: 8px 12px;
  border: 1px solid #f4f4f4;
  cursor: pointer;
  flex: 1;
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: initial;
  text-decoration: none;

  span {
    margin-left: 12px;
  }

  &.active {
    background: #fbfbfb;
  }

  &.disabled {
    color: #b5b5b5;
    cursor: default;
  }
`;

type AssistantDrawerProps = {
  children: React.ReactNode;
};

export default function AssistantDrawer(props: AssistantDrawerProps) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const {
    assistantId,
  }: {
    assistantId: string;
  } = useParams({
    strict: false,
  });

  const onClose = () => {
    navigate({ to: `/assistants` });
  };

  return (
    <Drawer onOverlayClick={onClose} drawer="right">
      <DrawerContent>
        <MemoizedDrawerHeader onClose={onClose} label={t("common.closeDrawer")}>
          <DetailNavigationTitleContent>
            <h2>{t("assistants.assistant")}</h2>
          </DetailNavigationTitleContent>
          <DetailNavigationContainer>
            <DetailNavigationButton
              activeOptions={{ exact: true }}
              key={t("common.detail")}
              disabled={!assistantId}
              aria-disabled={!assistantId}
              className={classNames({ disabled: !assistantId })}
              to={
                assistantId ? `/assistants/${assistantId}` : `/assistants/new`
              }
            >
              <FormInputIcon size={18} /> <span>{t("common.detail")}</span>
            </DetailNavigationButton>
            <DetailNavigationButton
              activeOptions={{ exact: true }}
              key={t("common.settings")}
              disabled={!assistantId}
              aria-disabled={!assistantId}
              className={classNames({ disabled: !assistantId })}
              to={`/assistants/${assistantId}/settings`}
            >
              <SettingsIcon size={18} /> <span>{t("common.settings")}</span>
            </DetailNavigationButton>
          </DetailNavigationContainer>
        </MemoizedDrawerHeader>
        <DrawerContentBody justifyContent={"start"}>
          {props.children}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
