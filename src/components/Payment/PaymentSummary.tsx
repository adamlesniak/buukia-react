import lookup from "country-code-lookup";
import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns";
import { Circle, CircleCheck, CircleX } from "lucide-react";
import { memo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import ConfirmationModal from "@/containers/ConfirmationModal";
import { CVCCheckStatus, type BuukiaPayment } from "@/types";
import { centsToFixed, getTimelineFromPayment, PaymentStatus } from "@/utils";

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
  max-height: 520px;
  overflow-y: auto;
  flex: 3;

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
  left: -9px;
  top: 0px;
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

interface TimelineItem {
  name: string;
  date: string;
}

type PaymentSummaryProps = {
  payment: BuukiaPayment;
};

// TODO: Timeline and disputes detail, add actions, refund form.
export const PaymentSummary = memo((props: PaymentSummaryProps) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const timelineItems = getTimelineFromPayment(props.payment);

  const modalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <PaymentSummaryContainer data-testid="summary-items">
        <PaymentDisputeItem>
          <PaymentDisputeItemHeader>
            <h4>
              {t("transactions.payments.common.disputedFor")}{" "}
              {[
                getSymbolFromCurrency(props.payment.currency),
                centsToFixed(props.payment.amount),
              ].join("")}
            </h4>
            <TransactionChip
              data-testid="summary-item-status"
              status={PaymentStatus.Failed}
            >
              {t(`transactions.payments.common.disputeLost`)}
            </TransactionChip>
          </PaymentDisputeItemHeader>
          <PaymentDisputeItemBody>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
              sapien libero. Pellentesque pulvinar finibus velit, gravida
              finibus lectus convallis a. In vitae tempor felis. Mauris nec
              venenatis sem. Suspendisse ultrices nunc quis libero gravida
              imperdiet. Mauris pulvinar sapien sit amet sapien pulvinar, quis
              egestas ante consequat.{" "}
            </p>
          </PaymentDisputeItemBody>
          <PaymentDisputeProperties>
            <PaymentDisputeItemProperty>
              <b>Status</b>
              <p>General</p>
            </PaymentDisputeItemProperty>
            <PaymentDisputeItemProperty>
              <b>Reason</b>
              <p>Fradulent</p>
            </PaymentDisputeItemProperty>
            <PaymentDisputeItemProperty>
              <b>Fee</b>
              <p>$25.00</p>
            </PaymentDisputeItemProperty>
          </PaymentDisputeProperties>
        </PaymentDisputeItem>
        <PaymentSummaryList>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.sourceId")}</b>{" "}
            <PaymentSummaryListItemValue>
              {props.payment.sourceId}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.amount")}</b>{" "}
            <PaymentSummaryListItemValue>
              {[
                getSymbolFromCurrency(props.payment.currency),
                centsToFixed(props.payment.amount),
              ].join("")}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.description")}</b>{" "}
            <PaymentSummaryListItemValue>
              {props.payment.description}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          {/* <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.statementDescription")}</b>{" "}
            <PaymentSummaryListItemValue>{props.payment.statement_description}</PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.method")}</b>{" "}
            <PaymentSummaryListItemValue>{t(`transactions.payments.method.${props.payment.type}`)}</PaymentSummaryListItemValue>
          </PaymentSummaryListItem> */}
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.status")}</b>{" "}
            <PaymentSummaryListItemValue>
              <TransactionChip
                data-testid="summary-item-status"
                status={props.payment.status}
              >
                {t(`common.status.${props.payment.status}`)}
              </TransactionChip>
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
        </PaymentSummaryList>
        <hr style={{ width: "100%", marginBottom: "16px" }} />
        <PaymentSummaryList>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.paymentMethod.card")}</b>{" "}
            <PaymentSummaryListItemValue>
              **** **** **** {props.payment.paymentMethod.last4}{" "}
              <span>
                <img
                  src={`/assets/cards/${props.payment.paymentMethod.brand}.svg`}
                  width={24}
                  alt="Credit Card"
                />
              </span>
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.paymentMethod.type")}</b>{" "}
            <PaymentSummaryListItemValue>
              {props.payment.paymentMethod.brand}{" "}
              {props.payment.paymentMethod.funding}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>
              {t(
                "transactions.payments.summary.paymentMethod.amountAuthorized",
              )}
            </b>{" "}
            <PaymentSummaryListItemValue>
              {[
                getSymbolFromCurrency(props.payment.currency),
                centsToFixed(props.payment.paymentMethod.amountAuthorized),
              ].join("")}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.paymentMethod.expiry")}</b>{" "}
            <PaymentSummaryListItemValue>
              {props.payment.paymentMethod.expMonth}/
              {props.payment.paymentMethod.expYear}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>{t("transactions.payments.summary.paymentMethod.country")}</b>{" "}
            <PaymentSummaryListItemValue>
              {lookup.byFips(props.payment.paymentMethod.country)?.country}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
          <PaymentSummaryListItem>
            <b>
              {t("transactions.payments.summary.paymentMethod.fingerprint")}
            </b>{" "}
            <PaymentSummaryListItemValue>
              {props.payment.paymentMethod.fingerprint}
            </PaymentSummaryListItemValue>
          </PaymentSummaryListItem>
        </PaymentSummaryList>
        <PaymentSummaryList>
          <PaymentSummaryListItem>
            <b>
              {t("transactions.payments.summary.paymentMethod.checks.cvcCheck")}
            </b>{" "}
            <PaymentSummaryListItemValue>
              {props.payment.paymentMethod.checks.cvcCheck}{" "}
              <span>
                {props.payment.paymentMethod.checks.cvcCheck ===
                CVCCheckStatus.Pass ? (
                  <CircleCheck size={21} color={"#4caf50"} />
                ) : (
                  ""
                )}
                {props.payment.paymentMethod.checks.cvcCheck ===
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
          <PaymentActions>
            <h2>{t("common.timeline")}</h2>
            {timelineItems.map((item: TimelineItem, index: number) => (
              <TimelineItem
                isLast={index === timelineItems.length - 1}
                key={index}
              >
                <TimelineIcon>
                  <Circle
                    size={16}
                    style={{ marginBottom: "8px", background: "#FFF" }}
                    color={"#f4f4f4"}
                  />
                </TimelineIcon>
                <span>{t(item.name)}</span>
                <small>{format(new Date(item.date), "dd LLL, hh:mm a")}</small>
              </TimelineItem>
            ))}
          </PaymentActions>
        </PaymentTimelineContainer>
      )}

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
