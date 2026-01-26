import { Outlet } from "@tanstack/react-router";
import { FormInputIcon, SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  PageBody,
  PageContainer,
  PageHeader,
  PageHeaderItem,
  PageSection,
} from "@/components/Page";

import {
  DetailNavigationButton,
  DetailNavigationContainer,
} from "./AssistantDrawer";

export default function Transactions() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <PageHeader style={{ marginBottom: 8 }}>
        <PageHeaderItem>
          <p>test</p>
          <div>
            <DetailNavigationContainer>
              <DetailNavigationButton
                activeOptions={{ exact: true }}
                key={t("common.transactions")}
                to={`/transactions/payments`}
              >
                <FormInputIcon size={18} /> <span>{t("common.payments")}</span>
              </DetailNavigationButton>
              <DetailNavigationButton
                activeOptions={{ exact: true }}
                key={t("common.payouts")}
                to={`/transactions/payouts`}
              >
                <SettingsIcon size={18} /> <span>{t("common.payouts")}</span>
              </DetailNavigationButton>
              <DetailNavigationButton
                activeOptions={{ exact: true }}
                key={t("common.settings")}
                to={`/transactions/settings`}
              >
                <FormInputIcon size={18} /> <span>{t("common.settings")}</span>
              </DetailNavigationButton>
            </DetailNavigationContainer>
          </div>
        </PageHeaderItem>
      </PageHeader>
      <PageBody>
        <PageSection>
          <Outlet />
        </PageSection>
      </PageBody>
    </PageContainer>
  );
}
