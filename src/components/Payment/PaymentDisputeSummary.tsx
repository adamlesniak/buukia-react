import getSymbolFromCurrency from "currency-symbol-map";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { centsToFixed, PaymentStatus } from "@/utils";
import { StripeDisputeStatus, type StripeDispute } from "scripts/mocksStripe";

import { TransactionChip } from "../Chip";

const PaymentDispute = styled.div`
  h3 {
    margin-top: 0px;
  }
`;

const PaymentDisputeItem = styled.div`
  padding: 12px;
  border: 2px solid #e8e8e8;
  background-color: #f4f4f4;
  border-radius: 12px;
  margin-bottom: 16px;

  h4 {
    margin: 0px;
    flex-direction: row;
    display: flex;
  }
`;

const PaymentDisputeItemHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const PaymentDisputeItemBody = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const PaymentDisputeItemProperty = styled.div`
  margin-top: 8px;
  width: 30%;
`;

const PaymentDisputeProperties = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

type PaymentDisputeSummaryProps = {
  dispute: StripeDispute;
};

export const PaymentDisputeSummary = memo(
  (props: PaymentDisputeSummaryProps) => {
    const { t } = useTranslation();

    return (
      <PaymentDispute>
        <h3>
          {t(
            `transactions.payments.common.disputedAs.${props.dispute?.status}`,
          )}
        </h3>
        <PaymentDisputeItem>
          <PaymentDisputeItemHeader>
            <h4>
              {t("transactions.payments.common.disputedFor")}{" "}
              {[
                getSymbolFromCurrency(props.dispute?.currency || ""),
                centsToFixed(props.dispute?.amount || 0),
              ].join("")}
            </h4>
            <TransactionChip
              data-testid="summary-item-status"
              status={
                props.dispute?.status === StripeDisputeStatus.Won
                  ? PaymentStatus.Succeeded
                  : PaymentStatus.Failed
              }
            >
              {t(`transactions.payments.status.${props.dispute?.status}`)}
            </TransactionChip>
          </PaymentDisputeItemHeader>
          <PaymentDisputeItemBody>
            <p>
              {t(
                `transactions.payments.disputes.${props.dispute?.network_reason_code}`,
              )}
            </p>
          </PaymentDisputeItemBody>
          <PaymentDisputeProperties>
            <PaymentDisputeItemProperty>
              <b>{t("transactions.payments.common.status")}</b>
              <p>
                {t(`transactions.payments.status.${props.dispute?.status}`)}
              </p>
            </PaymentDisputeItemProperty>
            <PaymentDisputeItemProperty>
              <b>{t("transactions.payments.common.reason")}</b>
              <p>
                {t(`transactions.payments.reason.${props.dispute?.reason}`)}
              </p>
            </PaymentDisputeItemProperty>
            <PaymentDisputeItemProperty>
              <b>{t("transactions.payments.common.fee")}</b>
              <p>
                {[
                  getSymbolFromCurrency(props.dispute?.currency || ""),
                  centsToFixed(props.dispute?.amount || 0),
                ].join("")}
              </p>
            </PaymentDisputeItemProperty>
          </PaymentDisputeProperties>
        </PaymentDisputeItem>
      </PaymentDispute>
    );
  },
);
