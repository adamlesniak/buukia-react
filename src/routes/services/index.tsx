import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ImportIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useServices } from "@/api";
import { Button } from "@/components/Button";
import { ErrorContainer, ErrorDetail } from "@/components/Error";
import {
  PageContainer,
  PageBody,
  PageHeader,
  PageHeaderItem,
} from "@/components/Page";
import { MAX_PAGINATION } from "@/constants.ts";


const Table = styled.table`
  text-align: left;
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f4f4f4;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ $type?: "header" | "body" }>`
  border-bottom: 1px solid #e0e0e0;

  ${(props) => props.$type === "header" && `cursor: initial;`}
  ${(props) => props.$type === "body" && `cursor: pointer;`}

  height: 48px;

  &:hover {
    background-color: #fbfbfb;
  }
`;

const TableRowItem = styled.td`
  padding: 8px;
`;

const TableHeaderItem = styled.th`
  padding: 8px;
  /* padding: 0 20px; */
`;

export const Route = createFileRoute("/services/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

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
  console.log(services);
  return (
    <>
      {isError && (
        <ErrorContainer>
          <ErrorDetail message={t("services.loadingError")} />
        </ErrorContainer>
      )}
      {!isError && (
        <PageContainer>
          <PageHeader>
            <PageHeaderItem>
              <div>
                <h2>{t("services.title")}</h2>
                <small>
                  {services.length} {t("common.items").toLowerCase()}
                </small>
              </div>
            </PageHeaderItem>
            <PageHeaderItem>
              <Button type="button">
                <ImportIcon size={16} />
                <span>{t("services.importServices")}</span>
              </Button>
              <Button type="button">
                <PlusIcon size={16} />
                <span>{t("services.addService")}</span>
              </Button>
            </PageHeaderItem>
          </PageHeader>
          <PageBody>
            <Table>
              <TableHeader>
                <TableRow $type="header">
                  <TableHeaderItem>{t("services.name")}</TableHeaderItem>
                  <TableHeaderItem>{t("services.category")}</TableHeaderItem>
                  <TableHeaderItem>{t("services.duration")}</TableHeaderItem>
                  <TableHeaderItem>{t("services.price")}</TableHeaderItem>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow $type="body" key={service.id}>
                    <TableRowItem>{service.name}</TableRowItem>
                    <TableRowItem>{service.category}</TableRowItem>
                    <TableRowItem>{service.duration}</TableRowItem>
                    <TableRowItem>€{service.price}</TableRowItem>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PageBody>
          <Outlet />
        </PageContainer>
      )}
    </>
  );
}
