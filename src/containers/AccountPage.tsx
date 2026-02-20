import {
  BriefcaseBusiness,
  BuildingIcon,
  CircleQuestionMark,
  SquareUser,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { PageContainer, PageHeader, PageHeaderItem } from "@/components/Page";

import {
  DetailNavigationButton,
  DetailNavigationContainer,
} from "./AssistantDrawer";

const DetailNavigationButtonContent = styled.div`
  display: flex;
  align-items: center;
`;

type AccountPageProps = {
  children: React.ReactNode;
};

export default function AccountPage(props: AccountPageProps) {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderItem>
          <div>
            <h2>{t("account.title")}</h2>
            <small>{t("account.manageAccount")}</small>
          </div>
        </PageHeaderItem>

        <PageHeaderItem>
          <DetailNavigationContainer>
            <DetailNavigationButton
              activeOptions={{ exact: true }}
              key={t("common.general")}
              to={`/account`}
            >
              <span>{t("common.general")}</span>
            </DetailNavigationButton>
            <DetailNavigationButton
              activeOptions={{ exact: true }}
              key={t("common.documents")}
              to={`/account/documents`}
            >
              <span>{t("common.documents")}</span>
            </DetailNavigationButton>
          </DetailNavigationContainer>
        </PageHeaderItem>
      </PageHeader>

      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "269px",
          }}
        >
          <DetailNavigationContainer variant="column">
            <DetailNavigationButton
              activeOptions={{ exact: true }}
              key={t("common.detail")}
              icon={true}
              justifyContent="space-between"
              alignItems="start"
              to={"/account/personal"}
              style={{ borderRight: "0px" }}
            >
              <DetailNavigationButtonContent>
                <SquareUser size={18} />{" "}
                <span>{t("account.personal.action")}</span>
              </DetailNavigationButtonContent>
            </DetailNavigationButton>
            <DetailNavigationButton
              activeOptions={{ exact: true }}
              key={t("common.settings")}
              icon={true}
              justifyContent="space-between"
              alignItems="start"
              to={"/account/business"}
              style={{ borderRight: "0px" }}
            >
              <DetailNavigationButtonContent>
                <BriefcaseBusiness size={18} />{" "}
                <span>{t("account.business.action")}</span>
              </DetailNavigationButtonContent>
            </DetailNavigationButton>
            <DetailNavigationButton
              activeOptions={{ exact: true }}
              key={t("common.settings")}
              icon={true}
              justifyContent="space-between"
              alignItems="start"
              to={"/account/bank"}
              style={{ borderRight: "0px" }}
            >
              <DetailNavigationButtonContent>
                <BuildingIcon size={18} />{" "}
                <span>{t("account.bank.action")}</span>
              </DetailNavigationButtonContent>
              <CircleQuestionMark />
            </DetailNavigationButton>
          </DetailNavigationContainer>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {props.children}
        </div>
      </div>
    </PageContainer>
  );
}
