import { useTranslation } from "react-i18next";
import styled from "styled-components";

import type { BuukiaPayment } from "@/types";

export const PaymentSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
`;

export const PaymentItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  text-transform: capitalize;
`;

type PaymentPreviewProps = {
  payment?: BuukiaPayment;
};

export default function PaymentPreview({ payment }: PaymentPreviewProps) {
  const { t } = useTranslation();

  return (
    <PaymentSummary>
      <PaymentItem>
        <span>{t("transactions.payments.detail.id")}</span>
        <b>{payment?.id}</b>
      </PaymentItem>
      <PaymentItem>
        <span>{t("transactions.payments.detail.sourceId")}</span>
        <b>{payment?.sourceId}</b>
      </PaymentItem>
      <PaymentItem>
        <span>{t("transactions.payments.detail.amount")}</span>
        <b>{payment?.amount}</b>
      </PaymentItem>
      <PaymentItem>
        <span>{t("transactions.payments.detail.date")}</span>
        <b>{payment?.date}</b>
      </PaymentItem>
      <PaymentItem>
        <span>{t("transactions.payments.detail.description")}</span>
        <b>{payment?.description}</b>
      </PaymentItem>
      <PaymentItem>
        <span>{t("transactions.payments.detail.method")}</span>
        <b>{payment?.method}</b>
      </PaymentItem>
      <PaymentItem>
        <span>{t("transactions.payments.detail.provider")}</span>
        <b>{payment?.provider}</b>
      </PaymentItem>
      <PaymentItem>
        <span>{t("transactions.payments.detail.status")}</span>
        <b>{payment?.status}</b>
      </PaymentItem>
    </PaymentSummary>
  );
}
