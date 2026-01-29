import { Outlet, useNavigate } from "@tanstack/react-router";
import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { usePayments, usePaymentsStats } from "@/api";
import { Card } from "@/components/Card";
import { TransactionChip } from "@/components/Chip";
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
import { ExtraLargeText, LargeText } from "@/components/Typography";
import { MAX_PAGINATION } from "@/constants";

const PaymentsHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-layout: column;
  gap: 12px;
  margin-top: 12px;
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
  const {
    data: paymentsStats = {
      totalPayments: 0,
      totalAmount: 0,
      averagePayment: 0,
      failed: 0,
    },
    error: paymentsStatsError,
    // isLoading: paymentsLoading,
    // refetch: refetchServices,
    // isRefetching: paymentsIsRefetching,
  } = usePaymentsStats();
  const isError = paymentsError || paymentsStatsError;

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
                <LargeText style={{ marginRight: "8px" }}>€</LargeText>
                {paymentsStats.totalAmount}
              </ExtraLargeText>
            </Card>
            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="category-list-item"
            >
              <LargeText>
                {t("transactions.payments.cards.averagePayment")}
              </LargeText>
              <ExtraLargeText>
                <LargeText style={{ marginRight: "8px" }}>€</LargeText>
                {paymentsStats.averagePayment}
              </ExtraLargeText>
            </Card>
            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="category-list-item"
            >
              <LargeText>
                {t("transactions.payments.cards.totalCount")}
              </LargeText>
              <ExtraLargeText>{paymentsStats.totalPayments}</ExtraLargeText>
            </Card>

            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="category-list-item"
            >
              <LargeText>{t("transactions.payments.cards.failed")}</LargeText>
              <ExtraLargeText>{paymentsStats.failed}</ExtraLargeText>
            </Card>
          </PaymentsHeading>

          <hr />
          <PageHeaderItem style={{ marginBottom: "8px", marginTop: "8px" }}>
            <div>
              <h2>{t("transactions.payments.title")}</h2>
              <small>
                {[payments.length, t("common.items").toLowerCase()].join(" ")}
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
                  <TableRowItem>{payment.sourceId}</TableRowItem>
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
          <Outlet />
        </>
      )}
      {payments.length === 0 && (
        <p>{t("transactions.payments.noPaymentsFound")}</p>
      )}
    </>
  );
}
