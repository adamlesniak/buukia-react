import { Outlet, useNavigate } from "@tanstack/react-router";
import { differenceInHours } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useAssistants } from "@/api";
import { Button } from "@/components/Button";
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

const Chip = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: inline-flex;
  padding: 4px;
  margin-right: 6px;
  font-size: 13px;
`;

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
                        }
                      }}
                      $type="body"
                      key={assistant.id}
                      tabIndex={0}
                      data-testid="assistant-row"
                    >
                      <TableRowItem>{assistant.name}</TableRowItem>
                      <TableRowItem>
                        {assistant.categories.map((category) => <Chip key={category}>{category}</Chip>)}
                      </TableRowItem>
                      <TableRowItem>{assistant.email}</TableRowItem>
                      <TableRowItem>
                        {assistant.availability.regular.reduce((acc, value) => {
                          const [startTime, endTime] = [
                            new Date().setHours(
                              parseInt(value.startTime.split(":")[0], 10),
                            ),
                            new Date().setHours(
                              parseInt(value.endTime.split(":")[0], 10),
                            ),
                          ];

                          return acc + differenceInHours(endTime, startTime);
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
