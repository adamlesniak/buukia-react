import { useNavigate } from "@tanstack/react-router";
import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { usePayments } from "@/api";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { ErrorContainer, ErrorDetail } from "@/components/Error";
import { PageHeaderItem } from "@/components/Page/PageHeader";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderItem,
  TableRow,
  TableRowItem,
} from "@/components/Table";
import { MAX_PAGINATION } from "@/constants.ts";

const TransactionChip = styled(Chip)<{ status: string }>`
  border: 1px solid ${(props) => getColorStatus(props.status)};
  text-transform: capitalize;
  color: ${(props) => getColorStatus(props.status)};
  font-weight: bold;
`;

const getColorStatus = (status: string) => {
  switch (status) {
    case "completed":
      return "#4caf50"; // Green
    case "pending":
      return "#ff9800"; // Orange
    case "failed":
      return "#f44336"; // Red
    case "canceled":
      return "#9e9e9e"; // Grey
    case "in_transit":
      return "#2196f3"; // Blue
    default:
      return "#523d3d"; // Default color
  }
};

const PaymentsHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-layout: column;
  gap: 12px;
  margin-top: 12px;
`;

const LargeText = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const ExtraLargeText = styled.span`
  font-size: 32px;
  font-weight: bold;
`;

export default function Payments() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [paymentsQuery, _setServicesQuery] = useState("");

  const {
    data: payments = [],
    error: paymentsError,
    // isLoading: paymentsLoading,
    // refetch: refetchServices,
    // isRefetching: paymentsIsRefetching,
  } = usePayments({ limit: MAX_PAGINATION, query: "" });

  const isError = !!paymentsError;

  return (
    <>
      {isError && (
        <ErrorContainer>
          <ErrorDetail message={t("transactions.payments.loadingError")} />
        </ErrorContainer>
      )}
      {!isError && (
        <>
          <PaymentsHeading>
            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="category-list-item"
            >
              <LargeText>{t("transactions.payments.cards.total")}</LargeText>
              <ExtraLargeText>
                <LargeText style={{ marginRight: "8px" }}>€</LargeText>20.232
              </ExtraLargeText>
            </Card>
            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="category-list-item"
            >
              <LargeText>
                {t("transactions.payments.cards.completed")}
              </LargeText>
              <ExtraLargeText>10</ExtraLargeText>
            </Card>
            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="category-list-item"
            >
              <LargeText>{t("transactions.payments.cards.pending")}</LargeText>
              <ExtraLargeText>0</ExtraLargeText>
            </Card>
            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="category-list-item"
            >
              <LargeText>{t("transactions.payments.cards.failed")}</LargeText>
              <ExtraLargeText>0</ExtraLargeText>
            </Card>
          </PaymentsHeading>

          <hr />
          <PageHeaderItem style={{ marginBottom: "8px", marginTop: "8px" }}>
            <div>
              <h2>{t("transactions.payments.title")}</h2>
              <small>
                {payments.length} {t("common.items").toLowerCase()}
              </small>
            </div>
          </PageHeaderItem>
          <Table>
            <TableHeader>
              <TableRow $type="header">
                <TableHeaderItem>
                  {t("transactions.payments.table.id")}
                </TableHeaderItem>
                <TableHeaderItem>
                  {t("transactions.payments.table.date")}
                </TableHeaderItem>
                <TableHeaderItem>
                  {t("transactions.payments.table.amount")}
                </TableHeaderItem>
                <TableHeaderItem>
                  {t("transactions.payments.table.status")}
                </TableHeaderItem>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow
                  onClick={() => {
                    navigate({
                      to: `/transactions/payments/${payment.id}`,
                    });
                  }}
                  onKeyDown={(
                    $event: React.KeyboardEvent<HTMLTableRowElement>,
                  ) => {
                    if ($event.key === "Enter") {
                      navigate({
                        to: `/transactions/payments/${payment.id}`,
                      });
                      $event.preventDefault();
                      $event.stopPropagation();
                    }
                  }}
                  $type="body"
                  key={payment.id}
                  tabIndex={0}
                  data-testid="payment-row"
                >
                  <TableRowItem>{payment.id}</TableRowItem>
                  <TableRowItem>
                    {format(new Date(payment.date), "Pp")}
                  </TableRowItem>
                  <TableRowItem>
                    {getSymbolFromCurrency(payment.currency)}
                    {payment.amount}
                  </TableRowItem>
                  <TableRowItem>
                    <TransactionChip status={payment.status}>
                      {payment.status}
                    </TransactionChip>
                  </TableRowItem>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
      {payments.length === 0 && (
        <p>{t("transactions.payments.noPaymentsFound")}</p>
      )}
    </>
  );
}
