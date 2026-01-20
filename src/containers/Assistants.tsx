import { Outlet, useNavigate } from "@tanstack/react-router";
import { differenceInHours } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAssistants } from "@/api";
import { Button } from "@/components/Button";
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

export default function Services() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [assistantsQuery, _setServicesQuery] = useState("");

  const {
    data: assistants = [],
    error: assistantsError,
    // isLoading: assistantsLoading,
    // refetch: refetchServices,
    // isRefetching: assistantsIsRefetching,
  } = useAssistants({ limit: MAX_PAGINATION, query: "" });

  const isError = !!assistantsError;

  return (
    <>
      {isError && (
        <ErrorContainer>
          <ErrorDetail message={t("assistants.loadingError")} />
        </ErrorContainer>
      )}
      {!isError && (
        <PageContainer>
          <PageHeader style={{ marginBottom: 8 }}>
            <PageHeaderItem>
              <div>
                <h2>{t("assistants.title")}</h2>
                <small>
                  {assistants.length} {t("common.items").toLowerCase()}
                </small>
              </div>
            </PageHeaderItem>

            <PageHeaderItem>
              <Button
                type="button"
                onClick={() => {
                  navigate({ to: "/assistants/new" });
                }}
              >
                <PlusIcon size={16} />
                <span>{t("assistants.addAssistant")}</span>
              </Button>
            </PageHeaderItem>
          </PageHeader>
          <PageBody>
            <PageSection>
              <Table>
                <TableHeader>
                  <TableRow $type="header">
                    <TableHeaderItem>
                      {t("assistants.table.name")}
                    </TableHeaderItem>
                    <TableHeaderItem>
                      {t("assistants.table.specialisations")}
                    </TableHeaderItem>
                    <TableHeaderItem>
                      {t("assistants.table.email")}
                    </TableHeaderItem>
                    <TableHeaderItem>
                      {t("assistants.table.availability")} (
                      {t("assistants.hours")})
                    </TableHeaderItem>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assistants.map((assistant) => (
                    <TableRow
                      onClick={() => {
                        navigate({ to: `/assistants/${assistant.id}` });
                      }}
                      onKeyDown={(
                        $event: React.KeyboardEvent<HTMLTableRowElement>,
                      ) => {
                        if ($event.key === "Enter") {
                          navigate({ to: `/assistants/${assistant.id}` });
                          $event.preventDefault();
                          $event.stopPropagation();
                        }
                      }}
                      $type="body"
                      key={assistant.id}
                      tabIndex={0}
                      data-testid="assistant-row"
                    >
                      <TableRowItem>
                        {assistant.firstName} {assistant.lastName}
                      </TableRowItem>
                      <TableRowItem
                        style={{
                          alignItems: "center",
                        }}
                      >
                        {assistant.categories.slice(0, 2).map((category) => (
                          <Chip key={category.id}>{category.name}</Chip>
                        ))}
                        {assistant.categories.length > 2 ? (
                          <small>
                            {t("common.moreItems", {
                              count: assistant.categories.length - 2,
                            })}
                          </small>
                        ) : null}
                      </TableRowItem>
                      <TableRowItem>{assistant.email}</TableRowItem>
                      <TableRowItem>
                        {assistant.availability.reduce((acc, day) => {
                          const sum = day.times.reduce((acc, value) => {
                            const [startTime, endTime] = [
                              new Date().setHours(
                                parseInt(value.start.split(":")[0], 10),
                              ),
                              new Date().setHours(
                                parseInt(value.end.split(":")[0], 10),
                              ),
                            ];

                            return acc + differenceInHours(endTime, startTime);
                          }, 0);

                          return sum + acc;
                        }, 0)}
                      </TableRowItem>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {assistants.length === 0 && (
                <p>{t("assistants.noAssistantsFound")}</p>
              )}
            </PageSection>
          </PageBody>
          <Outlet />
        </PageContainer>
      )}
    </>
  );
}
