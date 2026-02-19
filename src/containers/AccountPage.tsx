import {
  BriefcaseBusiness,
  BuildingIcon,
  CircleQuestionMark,
  SquareUser,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { PageContainer, PageHeader, PageHeaderItem } from "@/components/Page";

import {
  DetailNavigationButton,
  DetailNavigationContainer,
} from "./AssistantDrawer";

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
              <div style={{ display: "flex" }}>
                <SquareUser size={18} />{" "}
                <span>{t("account.personal.action")}</span>
              </div>
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
              <div style={{ display: "flex" }}>
                <BriefcaseBusiness size={18} />{" "}
                <span>{t("account.business.action")}</span>
              </div>
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
              <div style={{ display: "flex" }}>
                <BuildingIcon size={18} />{" "}
                <span>{t("account.bank.action")}</span>
              </div>
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
