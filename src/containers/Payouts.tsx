import { Outlet, useNavigate } from "@tanstack/react-router";
import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";

import { usePayouts, usePayoutsStats } from "@/api";
import { Button } from "@/components/Button";
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
import { MAX_PAGINATION, SETTINGS } from "@/constants";
import { centsToFixed, getColorStatus, PayoutStatus } from "@/utils";

const TransactionChip = styled(Chip)<{ status: PayoutStatus }>`
  border: 1px solid ${(props) => getColorStatus(props.status)};
  text-transform: capitalize;
  color: ${(props) => getColorStatus(props.status)};
  font-weight: bold;
`;

const PayoutsHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-layout: column;
  gap: 12px;
  margin-top: 12px;
`;

const LargeText = styled.span`
  font-size: 18px;
`;

const ExtraLargeText = styled.span<{ weight?: string }>`
  font-size: 32px;
  font-weight: ${(props) => props.weight || "bold"};
`;

export default function Payouts() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // const [payoutsQuery, _setServicesQuery] = useState("");

  const {
    data: payouts = [],
    error: payoutsError,
    isLoading: payoutsLoading,
    // refetch: refetchServices,
    // isRefetching: payoutsIsRefetching,
  } = usePayouts({ limit: MAX_PAGINATION, query: "" });
  const {
    data: stats = {
      totalPayouts: 0,
      totalAmount: 0,
      averagePayout: 0,
      failed: 0,
    },
    error: payoutsStatsError,
    // isLoading: payoutStatsLoading,
    // refetch: refetchServices,
    // isRefetching: payoutsIsRefetching,
  } = usePayoutsStats();

  const isError = payoutsError || payoutsStatsError;
  const isLoading = payoutsLoading;

  return (
    <>
      {isError && (
        <ErrorContainer>
          <ErrorDetail message={t("transactions.payouts.loadingError")} />
        </ErrorContainer>
      )}
      {!isError && (
        <>
          <PayoutsHeading>
            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="category-list-item"
            >
              <LargeText>{t("transactions.payouts.cards.total")}</LargeText>
              <ExtraLargeText>
                <LargeText style={{ marginRight: "8px" }}>
                  {getSymbolFromCurrency("EUR")}
                </LargeText>
                {!isLoading && centsToFixed(stats.totalAmount)}
                {isLoading && <Skeleton count={1} width={140} />}
              </ExtraLargeText>
            </Card>
            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="category-list-item"
            >
              <LargeText>
                {t("transactions.payouts.cards.averagePayout")}
              </LargeText>
              <ExtraLargeText>
                <LargeText style={{ marginRight: "8px" }}>
                  {getSymbolFromCurrency(SETTINGS.currency)}
                </LargeText>
                {!isLoading && centsToFixed(stats.averagePayout)}
                {isLoading && <Skeleton count={1} width={140} />}
              </ExtraLargeText>
            </Card>
            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="category-list-item"
            >
              <LargeText>
                {t("transactions.payouts.cards.totalCount")}
              </LargeText>
              <ExtraLargeText>
                {isLoading ? (
                  <Skeleton count={1} width={140} />
                ) : (
                  stats.totalPayouts
                )}
              </ExtraLargeText>
            </Card>

            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="category-list-item"
            >
              <LargeText>{t("transactions.payouts.cards.failed")}</LargeText>
              <ExtraLargeText>
                {isLoading ? <Skeleton count={1} width={140} /> : stats.failed}
              </ExtraLargeText>
            </Card>
          </PayoutsHeading>

          <hr />
          <PageHeaderItem
            style={{
              marginBottom: "8px",
              marginTop: "8px",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2>{t("transactions.payouts.title")}</h2>
              <small>
                {!isLoading &&
                  [payouts.length, t("common.items").toLowerCase()].join(" ")}
                {isLoading && <Skeleton count={1} width={20} />}
              </small>
            </div>

            <Button
              type="button"
              onClick={() => {
                navigate({ to: "/transactions/payouts/new" });
              }}
            >
              <PlusIcon size={16} />
              <span>{t("transactions.payouts.addPayout")}</span>
            </Button>
          </PageHeaderItem>
          <Table>
            <TableHeader>
              <TableRow $type="header">
                <TableHeaderItem>
                  {t("transactions.payouts.table.date")}
                </TableHeaderItem>
                <TableHeaderItem>
                  {t("transactions.payouts.table.destination")}
                </TableHeaderItem>
                <TableHeaderItem>
                  {t("transactions.payouts.table.status")}
                </TableHeaderItem>
                <TableHeaderItem>
                  {t("transactions.payouts.table.amount")}
                </TableHeaderItem>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow
                  onClick={() => {
                    navigate({
                      to: `/transactions/payouts/${payout.id}`,
                    });
                  }}
                  onKeyDown={(
                    $event: React.KeyboardEvent<HTMLTableRowElement>,
                  ) => {
                    if ($event.key === "Enter") {
                      navigate({
                        to: `/transactions/payouts/${payout.id}`,
                      });
                      $event.preventDefault();
                      $event.stopPropagation();
                    }
                  }}
                  $type="body"
                  key={payout.id}
                  tabIndex={0}
                  data-testid="payout-row"
                >
                  <TableRowItem>
                    {format(new Date(payout.createdAt), "dd/LL/yyyy, hh:mm a")}
                  </TableRowItem>
                  <TableRowItem>{payout.destination}</TableRowItem>
                  <TableRowItem>
                    <TransactionChip status={payout.status}>
                      {payout.status}
                    </TransactionChip>
                  </TableRowItem>
                  <TableRowItem>
                    {getSymbolFromCurrency(payout.currency)}
                    {centsToFixed(payout.amount)}
                  </TableRowItem>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Outlet />
        </>
      )}
      {payouts.length === 0 && (
        <p>{t("transactions.payouts.noPayoutsFound")}</p>
      )}
    </>
  );
}
