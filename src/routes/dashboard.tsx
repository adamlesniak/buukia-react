import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import getSymbolFromCurrency from "currency-symbol-map";
import { addDays, format, startOfDay, startOfMinute } from "date-fns";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useAppointments } from "@/api";
import { Card } from "@/components/Card";
import {
  PageContainer,
  PageHeader,
  PageHeaderItem,
  PageHeaderItemText,
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
import { ExtraLargeText, LargeText } from "@/components/Typography";
import { MAX_PAGINATION, SETTINGS } from "@/constants";
import { SortOrder } from "@/types";
import { centsToFixed } from "@/utils";

const DashboardHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-layout: column;
  gap: 12px;
  margin-top: 12px;
`;

export const Route = createFileRoute("/dashboard")({
  component: App,
});

function App() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const [currentView, setCurrentView] = useState("common.daily");

  const getNumberOfDays = (value: string) => {
    if (value === "common.daily") return 1;
    if (value === "common.weekly") return 7;
    if (value === "common.monthly") return 30;
    return 1;
  };

  const {
    data: appointments = [],
    // error: appointmentsError,
    // isLoading: appointmentsLoading,
    // refetch: refetchServices,
    // isRefetching: appointmentsIsRefetching,
  } = useAppointments({
    limit: MAX_PAGINATION,
    startDate: startOfMinute(new Date()).toISOString(),
    endDate: addDays(
      startOfDay(new Date()),
      getNumberOfDays("common.daily"),
    ).toISOString(),
    sort: SortOrder.Desc,
  });

  const [paymentsSum, durationSum] = appointments.reduce(
    (acc, appointment) => {
      acc[0] += appointment.stats.services.price;
      acc[1] += appointment.stats.services.duration;
      return acc;
    },
    [0, 0],
  );
  return (
    <PageContainer>
      <PageHeader style={{ marginBottom: 8 }}>
        <PageHeaderItem>
          <PageHeaderItemText>
            <small>{format(new Date(), "eeee, io MMMM")}</small>
            <ExtraLargeText style={{ marginTop: "8px" }}>
              {[t("common.hello"), "Adam"].join(" ")},
            </ExtraLargeText>
          </PageHeaderItemText>
        </PageHeaderItem>
      </PageHeader>

      <div style={{ flexDirection: "column" }}>
        <DashboardHeading style={{ flex: 1, marginTop: "8px" }}>
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
              {centsToFixed(paymentsSum)}
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
              {centsToFixed(paymentsSum / appointments.length)}
            </ExtraLargeText>
          </Card>
          <Card
            style={{ flex: 1 }}
            $layout="column"
            data-testid="category-list-item"
          >
            <LargeText>{t("transactions.payments.cards.totalCount")}</LargeText>
            <ExtraLargeText>{appointments.length}</ExtraLargeText>
          </Card>
          <Card
            style={{ flex: 1 }}
            $layout="column"
            data-testid="category-list-item"
          >
            <LargeText>
              {t("transactions.payments.cards.totalDuration")}
            </LargeText>
            <ExtraLargeText>
              {[durationSum, t("common.mins")].join(" ")}
            </ExtraLargeText>
          </Card>
        </DashboardHeading>

        <PageSection></PageSection>

        <div style={{ marginTop: "16px" }}>
          <h2 style={{ marginBottom: "8px" }}>
            {t("appointments.upcomingAppointments")}
          </h2>
          <PageSection>
            <Table>
              <TableHeader>
                <TableRow $type="header">
                  <TableHeaderItem>
                    {t("appointments.table.date")}
                  </TableHeaderItem>
                  <TableHeaderItem>
                    {t("appointments.table.client")}
                  </TableHeaderItem>
                  <TableHeaderItem>
                    {t("appointments.table.assistant")}
                  </TableHeaderItem>

                  <TableHeaderItem>
                    {t("appointments.table.duration")}
                  </TableHeaderItem>
                  <TableHeaderItem>
                    {t("appointments.table.price")}{" "}
                  </TableHeaderItem>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow
                    onClick={() => {
                      navigate({
                        to: `/dashboard/${appointment.id}`,
                      });
                    }}
                    onKeyDown={(
                      $event: React.KeyboardEvent<HTMLTableRowElement>,
                    ) => {
                      if ($event.key === "Enter") {
                        navigate({
                          to: `/dashboard/${appointment.id}`,
                        });
                        $event.preventDefault();
                        $event.stopPropagation();
                      }
                    }}
                    $type="body"
                    key={appointment.id}
                    tabIndex={0}
                    data-testid="appointment-row"
                  >
                    <TableRowItem>
                      {format(new Date(appointment.time), "Pp")}
                    </TableRowItem>
                    <TableRowItem>{appointment.client.name}</TableRowItem>
                    <TableRowItem>{appointment.assistant.name}</TableRowItem>
                    <TableRowItem>
                      {[
                        appointment.stats.services.duration,
                        t("common.minutes"),
                      ].join(" ")}
                    </TableRowItem>
                    <TableRowItem>
                      {[
                        getSymbolFromCurrency(SETTINGS.currency),
                        centsToFixed(appointment.stats.services.price),
                      ].join("")}
                    </TableRowItem>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {appointments.length === 0 && (
              <p>{t("appointments.noAppointmentsFound")}</p>
            )}
          </PageSection>
        </div>
      </div>
      <Outlet />
    </PageContainer>
  );
}
