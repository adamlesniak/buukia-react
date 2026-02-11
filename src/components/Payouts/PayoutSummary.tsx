import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns/format";
import { memo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import ConfirmationModal from "@/containers/ConfirmationModal";
import type { BuukiaPayout } from "@/types";
import { centsToFixed, PayoutStatus } from "@/utils";

import { Button } from "../Button";
import { TransactionChip } from "../Chip";

const PayoutActions = styled.div`
  width: 100%;

  h2 {
    margin-top: 0px;
  }
`;

const PayoutSummaryContainer = styled.div`
  text-align: left;
  width: 100%;
  padding-bottom: 12px;
  border-bottom: 1px solid #f4f4f4;
  margin-bottom: 12px;

  h2 {
    margin-top: 0px;
  }
`;

const PayoutSummaryList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  padding: 0px;
  margin: 0px;
`;

const PayoutSummaryListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;
  justify-content: space-between;
  padding: 8px 0px;

  span {
    width: 50%;
    text-align: left;
  }
`;

type PayoutSummaryProps = {
  payout: BuukiaPayout;
  cancelPayout: (value: boolean) => void;
};

export const PayoutSummary = memo((props: PayoutSummaryProps) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const modalClose = (confirm: boolean) => {
    props.cancelPayout(confirm);
    setShowModal(false);
  };

  return (
    <>
      <PayoutSummaryContainer data-testid="summary-items">
        <PayoutSummaryList>
          <PayoutSummaryListItem>
            <b>{t("transactions.payouts.summary.destination")}</b>{" "}
            <span>{props.payout.destination}</span>
          </PayoutSummaryListItem>
          <PayoutSummaryListItem>
            <b>{t("transactions.payouts.summary.sourceId")}</b>{" "}
            <span>{props.payout.sourceId}</span>
          </PayoutSummaryListItem>
          <PayoutSummaryListItem>
            <b>{t("transactions.payouts.summary.amount")}</b>{" "}
            <span>
              {[
                getSymbolFromCurrency(props.payout.currency),
                centsToFixed(props.payout.amount),
              ].join("")}
            </span>
          </PayoutSummaryListItem>
          <PayoutSummaryListItem>
            <b>{t("transactions.payouts.summary.arrivalDate")}</b>{" "}
            {props.payout.arrivalDate && (
              <span>
                {format(
                  new Date(props.payout.arrivalDate),
                  "dd/LL/yyyy, hh:mm a",
                )}
              </span>
            )}
          </PayoutSummaryListItem>
          <PayoutSummaryListItem>
            <b>{t("transactions.payouts.summary.description")}</b>{" "}
            <span>{props.payout.description}</span>
          </PayoutSummaryListItem>
          <PayoutSummaryListItem>
            <b>{t("transactions.payouts.summary.statementDescription")}</b>{" "}
            <span>{props.payout.statement_description}</span>
          </PayoutSummaryListItem>
          <PayoutSummaryListItem>
            <b>{t("transactions.payouts.summary.method")}</b>{" "}
            <span>{t(`transactions.payouts.method.${props.payout.type}`)}</span>
          </PayoutSummaryListItem>
          <PayoutSummaryListItem>
            <b>{t("transactions.payouts.summary.status")}</b>{" "}
            <span>
              <TransactionChip data-testid="summary-item-status" status={props.payout.status}>
                {t(`common.status.${props.payout.status}`)}
              </TransactionChip>
            </span>
          </PayoutSummaryListItem>
        </PayoutSummaryList>
        <hr style={{ width: "100%", marginBottom: "16px" }} />
        <PayoutSummaryList>
          <PayoutSummaryListItem>
            <b>
              {t("transactions.payouts.summary.instantPayoutFee", {
                feeRate: props.payout.fee.rate * 100,
              })}
            </b>{" "}
            <span>
              {[
                getSymbolFromCurrency(props.payout.currency),
                centsToFixed(props.payout.fee.amount),
              ].join("")}
            </span>
          </PayoutSummaryListItem>
        </PayoutSummaryList>
      </PayoutSummaryContainer>
      {props.payout.status === PayoutStatus.Pending && (
        <PayoutActions>
          <h2>{t("common.actions")}</h2>
          <Button
            type="button"
            onClick={() => setShowModal(true)}
            style={{ width: "100%" }}
            variant="accent"
          >
            {t("transactions.payouts.actions.cancel")}
          </Button>
        </PayoutActions>
      )}
      {showModal &&
        createPortal(
          <ConfirmationModal
            title={t("transactions.payouts.modal.cancelTitle")}
            description={t("transactions.payouts.modal.cancelMessage")}
            close={modalClose}
            type={"primary"}
            confirmText={t("transactions.payouts.actions.cancel")}
          />,
          document.body,
        )}
    </>
  );
});
