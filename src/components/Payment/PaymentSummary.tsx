import lookup from "country-code-lookup";
import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns";
import { Circle, CircleCheck, CircleX } from "lucide-react";
import { memo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import RefundModal from "@/containers/RefundModal";
import { CVCCheckStatus } from "@/types";
import { centsToFixed, getTimelineFromCharge, PaymentStatus } from "@/utils";
import { type StripeCharge } from "scripts/mocksStripe";

import { Button } from "../Button";
import { TransactionChip } from "../Chip";

import { PaymentDisputeSummary } from "./PaymentDisputeSummary";

const PaymentActions = styled.div`
  width: 100%;
  justify-content: end;
  flex-direction: column;
  display: flex;

  h2 {
    margin-top: 0px;
  }
`;

const PaymentSummaryContainer = styled.div`
  text-align: left;
  width: 100%;
  padding-bottom: 12px;
  margin-bottom: 12px;
  max-height: 520px;
  overflow-y: auto;
  flex: 3;
  padding-top: 16px;
  border-bottom: 1px solid #f4f4f4;

  h2 {
    margin-top: 0px;
  }
`;

const PaymentTimelineContainer = styled(PaymentSummaryContainer)`
  flex: 1;
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
`;

const PaymentSummaryListItemValue = styled.div`
  width: 70%;
  text-align: left;
  text-transform: capitalize;
  align-items: center;
  display: flex;

  span {
    margin-left: 6px;
  }
`;

const TimelineItem = styled.div<{ isLast: boolean }>`
  padding: 12px 0px;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  color: #a6a6a6;
  position: relative;
  margin-left: 12px;

  ${(props) => (Boolean(props.isLast) ? "" : "border-left: 1px solid #f4f4f4;")}

  &:last-child {
    border-bottom: none;
  }
`;

const TimelineIcon = styled.div`
  position: absolute;
  left: -8px;
  top: -8px;
`;

interface TimelineItem {
  name: string;
  date: number;
}

type PaymentSummaryProps = {
  charge: StripeCharge;
  onSubmit: (data: any) => void;
};

// TODO: Add actions, refund form.
export const PaymentSummary = memo((props: PaymentSummaryProps) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const timelineItems = getTimelineFromCharge(props.charge);

  const modalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <PaymentSummaryContainer data-testid="summary-items">
        {props.charge?.dispute && (
          <PaymentDisputeSummary dispute={props.charge.dispute} />
        )}

        <PaymentSummaryList>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.sourceId")}</b>{" "}
            <PaymentSummaryListItemValue>
              {props.charge.id}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.amount")}</b>{" "}
            <PaymentSummaryListItemValue data-testid="summary-item-amount">
              {[
                getSymbolFromCurrency(props.charge.currency),
                centsToFixed(props.charge.amount),
              ].join("")}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.description")}</b>{" "}
            <PaymentSummaryListItemValue>
              {props.charge.description}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.status")}</b>{" "}
            <PaymentSummaryListItemValue data-testid="summary-item-status">
              <TransactionChip
                data-testid="summary-item-status"
                status={
                  props.charge.dispute
                    ? PaymentStatus.Disputed
                    : props.charge.status
                }
              >
                {props.charge.dispute
                  ? t("transactions.payments.common.disputed")
                  : t(`common.status.${props.charge.status}`)}
              </TransactionChip>
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
        </PaymentSummaryList>

        <hr style={{ width: "100%", marginBottom: "16px" }} />

        <PaymentSummaryList>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.paymentMethod.card")}</b>{" "}
            <PaymentSummaryListItemValue>
              **** **** **** {props.charge.payment_method_details.card.last4}{" "}
              <span>
                <img
                  src={`/assets/cards/${props.charge.payment_method_details.card.brand}.svg`}
                  width={24}
                  alt="Credit Card"
                />
              </span>
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.paymentMethod.type")}</b>{" "}
            <PaymentSummaryListItemValue>
              {[
                props.charge.payment_method_details.card.brand,
                props.charge.payment_method_details.card.funding,
              ].join(" ")}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>
              {t(
                "transactions.payments.summary.paymentMethod.amountAuthorized",
              )}
            </b>
            <PaymentSummaryListItemValue data-testid="authorized-amount">
              {[
                getSymbolFromCurrency(props.charge.currency),
                centsToFixed(props.charge.amount_captured),
              ].join("")}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.paymentMethod.expiry")}</b>{" "}
            <PaymentSummaryListItemValue>
              {[
                props.charge.payment_method_details.card.exp_month,
                props.charge.payment_method_details.card.exp_year,
              ].join("/")}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.paymentMethod.country")}</b>{" "}
            <PaymentSummaryListItemValue>
              {
                lookup.byFips(props.charge.payment_method_details.card.country)
                  ?.country
              }
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>
              {t("transactions.payments.summary.paymentMethod.fingerprint")}
            </b>{" "}
            <PaymentSummaryListItemValue>
              {props.charge.payment_method_details.card.fingerprint}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>
              {t("transactions.payments.summary.paymentMethod.checks.cvcCheck")}
            </b>{" "}
            <PaymentSummaryListItemValue>
              {props.charge.payment_method_details.card.checks.cvc_check}{" "}
              <span>
                {props.charge.payment_method_details.card.checks.cvc_check ===
                CVCCheckStatus.Pass ? (
                  <CircleCheck size={21} color={"#4caf50"} />
                ) : (
                  ""
                )}
                {props.charge.payment_method_details.card.checks.cvc_check ===
                CVCCheckStatus.Fail ? (
                  <CircleX size={21} color={"#f44336"} />
                ) : (
                  ""
                )}
              </span>
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
        </PaymentSummaryList>
      </PaymentSummaryContainer>

      {timelineItems.length > 0 && (
        <PaymentTimelineContainer>
          <div>
            <h2>{t("common.timeline")}</h2>
            {timelineItems.map((item: TimelineItem, index: number) => (
              <TimelineItem
                isLast={index === timelineItems.length - 1}
                key={index}
                data-testid={`timeline-item-${index}`}
              >
                <TimelineIcon>
                  <Circle
                    size={16}
                    style={{ marginBottom: "8px", background: "#FFF" }}
                    color={"#f4f4f4"}
                  />
                </TimelineIcon>
                <span data-testid={`timeline-item-name-${index}`}>
                  {t(item.name)}
                </span>
                <small data-testid={`timeline-item-date-${index}`}>
                  {format(new Date(item.date), "dd LLL, hh:mm a")}
                </small>
              </TimelineItem>
            ))}
          </div>
        </PaymentTimelineContainer>
      )}

      {
        <PaymentActions>
          <div>
            <Button
              type="button"
              onClick={() => setShowModal(true)}
              style={{ width: "100%" }}
              variant="accent"
            >
              {t("transactions.payments.actions.refund")}
            </Button>
          </div>
        </PaymentActions>
      }

      {showModal &&
        createPortal(
          <RefundModal
            title={t("transactions.payments.modal.refundTitle")}
            close={modalClose}
            type={"primary"}
            charge={props.charge}
            confirmText={t("transactions.payments.actions.refund")}
            onSubmit={props.onSubmit}
          />,
          document.body,
        )}
    </>
  );
});
