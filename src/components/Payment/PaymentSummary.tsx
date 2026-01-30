import lookup from "country-code-lookup";
import getSymbolFromCurrency from "currency-symbol-map";
import { memo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import ConfirmationModal from "@/containers/ConfirmationModal";
import type { BuukiaPayment } from "@/types";
import { centsToFixed } from "@/utils";

import { Button } from "../Button";
import { TransactionChip } from "../Chip";

const PaymentActions = styled.div`
  width: 100%;

  h2 {
    margin-top: 0px;
  }
`;

const PaymentSummaryContainer = styled.div`
  text-align: left;
  width: 100%;
  padding-bottom: 12px;
  border-bottom: 1px solid #f4f4f4;
  margin-bottom: 12px;

  h2 {
    margin-top: 0px;
  }
`;

const PaymentSummaryList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  padding: 0px;
  margin: 0px;
`;

const PaymentSummaryListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;
  justify-content: space-between;
  padding: 8px 0px;

  span {
    width: 70%;
    text-align: left;
  }
`;

type PaymentSummaryProps = {
  payment: BuukiaPayment;
};

// TODO: Timeline and disputes detail, add actions, refund form.
export const PaymentSummary = memo((props: PaymentSummaryProps) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const modalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <PaymentSummaryContainer data-testid="summary-items">
        <PaymentSummaryList>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.sourceId")}</b>{" "}
            <span>{props.payment.sourceId}</span>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.amount")}</b>{" "}
            <span>
              {[
                getSymbolFromCurrency(props.payment.currency),
                centsToFixed(props.payment.amount),
              ].join("")}
            </span>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.description")}</b>{" "}
            <span>{props.payment.description}</span>
          </PaymentSummaryListItem>
          {/* <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.statementDescription")}</b>{" "}
            <span>{props.payment.statement_description}</span>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.method")}</b>{" "}
            <span>{t(`transactions.payments.method.${props.payment.type}`)}</span>
          </PaymentSummaryListItem> */}
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.status")}</b>{" "}
            <span>
              <TransactionChip
                data-testid="summary-item-status"
                status={props.payment.status}
              >
                {t(`common.status.${props.payment.status}`)}
              </TransactionChip>
            </span>
          </PaymentSummaryListItem>
        </PaymentSummaryList>
        <hr style={{ width: "100%", marginBottom: "16px" }} />
        <PaymentSummaryList>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.paymentMethod.card")}</b>{" "}
            <span>
              **** **** **** {props.payment.paymentMethod.last4}{" "}
              <img
                src={`/assets/cards/${props.payment.paymentMethod.brand}.svg`}
                width={24}
                alt="Credit Card"
              ></img>
            </span>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>
              {t(
                "transactions.payments.summary.paymentMethod.amountAuthorized",
              )}
            </b>{" "}
            <span>
              {[
                getSymbolFromCurrency(props.payment.currency),
                centsToFixed(props.payment.paymentMethod.amountAuthorized),
              ].join("")}
            </span>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.paymentMethod.expiry")}</b>{" "}
            <span>
              {props.payment.paymentMethod.expMonth}/
              {props.payment.paymentMethod.expYear}
            </span>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.paymentMethod.country")}</b>{" "}
            <span>{lookup.byFips(props.payment.paymentMethod.country)?.country}</span>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>
              {t("transactions.payments.summary.paymentMethod.fingerprint")}
            </b>{" "}
            <span>{props.payment.paymentMethod.fingerprint}</span>
          </PaymentSummaryListItem>
        </PaymentSummaryList>
        {/* <PaymentSummaryList>
          <PaymentSummaryListItem>
            <b>
              {t("transactions.payments.summary.instantPaymentFee", {
                feeRate: props.payment.fee.rate * 100,
              })}
            </b>{" "}
            <span>
              {[
                getSymbolFromCurrency(props.payment.currency),
                centsToFixed(props.payment.fee.amount),
              ].join("")}
            </span>
          </PaymentSummaryListItem>
        </PaymentSummaryList> */}
      </PaymentSummaryContainer>
      {
        <PaymentActions>
          <h2>{t("common.actions")}</h2>
          <Button
            type="button"
            onClick={() => setShowModal(true)}
            style={{ width: "100%" }}
            variant="accent"
          >
            {t("transactions.payments.actions.refund")}
          </Button>
        </PaymentActions>
      }
      {showModal &&
        createPortal(
          <ConfirmationModal
            title={t("transactions.payments.modal.cancelTitle")}
            description={t("transactions.payments.modal.cancelMessage")}
            close={modalClose}
            type={"primary"}
            confirmText={t("transactions.payments.actions.refund")}
          />,
          document.body,
        )}
    </>
  );
});
