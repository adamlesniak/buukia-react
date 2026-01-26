import { Outlet, useNavigate } from "@tanstack/react-router";
import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns";
import { FormInputIcon, SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { usePayments } from "@/api";
import { Chip } from "@/components/Chip";
import { ErrorContainer, ErrorDetail } from "@/components/Error";
import {
  PageBody,
  PageContainer,
  PageHeader,
  PageHeaderItem,
  PageSection,
} from "@/components/Page";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderItem,
  TableRow,
  TableRowItem,
} from "@/components/Table";
import { MAX_PAGINATION } from "@/constants.ts";

import {
  DetailNavigationButton,
  DetailNavigationContainer,
} from "./AssistantDrawer";

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
  console.log('paymentsError', paymentsError);
  return (
    <>
      {isError && (
        <ErrorContainer>
          <ErrorDetail message={t("transactions.payments.loadingError")} />
        </ErrorContainer>
      )}
      {!isError && (
        <PageContainer>
          <PageHeader style={{ marginBottom: 8 }}>
            <PageHeaderItem>
              <div>
                <h2>{t("transactions.title")}</h2>
                <DetailNavigationContainer>
                  <DetailNavigationButton
                    activeOptions={{ exact: true }}
                    key={t("common.transactions")}
                    to={`/transactions/payments`}
                  >
                    <FormInputIcon size={18} />{" "}
                    <span>{t("common.payments")}</span>
                  </DetailNavigationButton>
                  <DetailNavigationButton
                    activeOptions={{ exact: true }}
                    key={t("common.payouts")}
                    to={`/transactions/payouts`}
                  >
                    <SettingsIcon size={18} />{" "}
                    <span>{t("common.payouts")}</span>
                  </DetailNavigationButton>
                  <DetailNavigationButton
                    activeOptions={{ exact: true }}
                    key={t("common.settings")}
                    to={`/transactions/settings`}
                  >
                    <FormInputIcon size={18} />{" "}
                    <span>{t("common.settings")}</span>
                  </DetailNavigationButton>
                </DetailNavigationContainer>
              </div>
            </PageHeaderItem>
          </PageHeader>
          <PageBody>
            <PageSection>
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
              {payments.length === 0 && (
                <p>{t("transactions.payments.noPaymentsFound")}</p>
              )}
            </PageSection>
          </PageBody>
          <Outlet />
        </PageContainer>
      )}
    </>
  );
}
