import { Outlet, useNavigate } from "@tanstack/react-router";
import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";

import { usePaymentsStats, useCharges } from "@/api";
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
import { MAX_PAGINATION, SETTINGS } from "@/constants";
import { centsToFixed, getChargeStatus } from "@/utils";

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

  // const [paymentsQuery, _setServicesQuery] = useState("");

  const {
    data,
    error: chargesError,
    // isLoading: paymentsLoading,
    // refetch: refetchServices,
    // isRefetching: paymentsIsRefetching,
  } = useCharges({ limit: MAX_PAGINATION, query: "" });

  const charges = data?.data || [];

  const {
    data: paymentsStats = {
      totalPayments: 0,
      totalAmount: 0,
      averagePayment: 0,
      failed: 0,
    },
    error: paymentsStatsError,
    isLoading: paymentsLoading,
    // refetch: refetchServices,
    // isRefetching: paymentsIsRefetching,
  } = usePaymentsStats();
  const isError = chargesError || paymentsStatsError;
  const isLoading = paymentsLoading;

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
                <LargeText style={{ marginRight: "8px" }}>
                  {getSymbolFromCurrency(SETTINGS.currency)}
                </LargeText>
                {!isLoading && centsToFixed(paymentsStats.totalAmount)}
                {isLoading && <Skeleton count={1} width={140} />}
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
                <LargeText style={{ marginRight: "8px" }}>
                  {getSymbolFromCurrency(SETTINGS.currency)}
                </LargeText>
                {!isLoading && centsToFixed(paymentsStats.averagePayment)}
                {isLoading && <Skeleton count={1} width={140} />}
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
              <ExtraLargeText>
                {isLoading ? (
                  <Skeleton count={1} width={140} />
                ) : (
                  paymentsStats.totalPayments
                )}
              </ExtraLargeText>
            </Card>

            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="category-list-item"
            >
              <LargeText>{t("transactions.payments.cards.failed")}</LargeText>
              <ExtraLargeText>
                {" "}
                {isLoading ? (
                  <Skeleton count={1} width={140} />
                ) : (
                  paymentsStats.failed
                )}
              </ExtraLargeText>
            </Card>
          </PaymentsHeading>

          <hr />
          <PageHeaderItem style={{ marginBottom: "8px", marginTop: "8px" }}>
            <div>
              <h2>{t("transactions.payments.title")}</h2>
              <small>
                {!isLoading &&
                  [charges.length, t("common.items").toLowerCase()].join(" ")}
                {isLoading && <Skeleton count={1} width={20} />}
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
              {charges.map((charge) => (
                <TableRow
                  onClick={() => {
                    navigate({
                      to: `/transactions/payments/${charge.id}`,
                    });
                  }}
                  onKeyDown={(
                    $event: React.KeyboardEvent<HTMLTableRowElement>,
                  ) => {
                    if ($event.key === "Enter") {
                      navigate({
                        to: `/transactions/payments/${charge.id}`,
                      });
                      $event.preventDefault();
                      $event.stopPropagation();
                    }
                  }}
                  $type="body"
                  key={charge.id}
                  tabIndex={0}
                  data-testid="payment-row"
                >
                  <TableRowItem>{charge.id}</TableRowItem>
                  <TableRowItem>
                    {format(new Date(charge.created), "Pp")}
                  </TableRowItem>
                  <TableRowItem>
                    {getSymbolFromCurrency(charge.currency)}
                    {centsToFixed(charge.amount)}
                  </TableRowItem>
                  <TableRowItem>
                    <TransactionChip status={getChargeStatus(charge)}>
                      {t(
                        `transactions.payments.common.${getChargeStatus(charge)}`,
                      )}
                    </TransactionChip>
                  </TableRowItem>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Outlet />
        </>
      )}
      {charges.length === 0 && (
        <p>{t("transactions.payments.noPaymentsFound")}</p>
      )}
    </>
  );
}
