import { Outlet, useNavigate } from "@tanstack/react-router";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useDeleteService, useServices } from "@/api";
import { Button } from "@/components/Button";
import { ErrorContainer, ErrorDetail } from "@/components/Error";
import {
  PageBody,
  PageContainer,
  PageHeader,
  PageHeaderItem,
  PageSection,
} from "@/components/Page";
import { MAX_PAGINATION } from "@/constants.ts";

const Table = styled.table`
  text-align: left;
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead``;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ $type?: "header" | "body" }>`
  border-bottom: 1px solid #e0e0e0;

  ${(props) => props.$type === "header" && `cursor: initial;`}
  ${(props) => props.$type === "body" && `cursor: pointer;`}

  height: 48px;

  ${(props) =>
    props.$type === "body" &&
    `
      &:hover {
        background-color: #fbfbfb;
      }
  `}
`;

const TableRowItem = styled.td`
  padding: 8px;
`;

const TableHeaderItem = styled.th`
  padding: 8px;
  /* padding: 0 20px; */
`;

export default function Services() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [deleteService] = [useDeleteService()];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [servicesQuery, _setServicesQuery] = useState("");

  const {
    data: services = [],
    error: servicesError,
    // isLoading: servicesLoading,
    // refetch: refetchServices,
    // isRefetching: servicesIsRefetching,
  } = useServices({ limit: MAX_PAGINATION, query: servicesQuery });

  const isError = !!servicesError;

  return (
    <>
      {isError && (
        <ErrorContainer>
          <ErrorDetail message={t("services.loadingError")} />
        </ErrorContainer>
      )}
      {!isError && (
        <PageContainer>
          <PageHeader style={{ marginBottom: 8 }}>
            <PageHeaderItem>
              <div>
                <h2>{t("services.title")}</h2>
                <small>
                  {services.length} {t("common.items").toLowerCase()}
                </small>
              </div>
            </PageHeaderItem>

            <PageHeaderItem>
              <Button
                type="button"
                onClick={() => {
                  navigate({ to: "/services/new" });
                }}
              >
                <PlusIcon size={16} />
                <span>{t("services.addService")}</span>
              </Button>
            </PageHeaderItem>
          </PageHeader>
          <PageBody>
            <PageSection>
              <Table>
                <TableHeader>
                  <TableRow $type="header">
                    <TableHeaderItem>{t("services.name")}</TableHeaderItem>
                    <TableHeaderItem>{t("services.category")}</TableHeaderItem>
                    <TableHeaderItem>{t("services.duration")}</TableHeaderItem>
                    <TableHeaderItem>{t("services.price")}</TableHeaderItem>
                    <TableHeaderItem>{t("services.actions")}</TableHeaderItem>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow
                      onClick={() => {
                        navigate({ to: `/services/${service.id}` });
                      }}
                      onKeyDown={(
                        $event: React.KeyboardEvent<HTMLTableRowElement>,
                      ) => {
                        if ($event.key === "Enter") {
                          navigate({ to: `/services/${service.id}` });
                        }
                      }}
                      $type="body"
                      key={service.id}
                      tabIndex={0}
                    >
                      <TableRowItem>{service.name}</TableRowItem>
                      <TableRowItem>{service.category}</TableRowItem>
                      <TableRowItem>{service.duration}</TableRowItem>
                      <TableRowItem>€{service.price}</TableRowItem>
                      <TableRowItem>
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteService.mutate(service.id);
                          }}
                        >
                          <TrashIcon />
                        </Button>
                      </TableRowItem>
                    </TableRow>
                  ))}
                  {services.length === 0 && (
                    <p>{t("services.noServicesFound")}</p>
                  )}
                </TableBody>
              </Table>
            </PageSection>
          </PageBody>
          <Outlet />
        </PageContainer>
      )}
    </>
  );
}
