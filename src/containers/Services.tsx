import { Outlet, useNavigate } from "@tanstack/react-router";
import { ImportIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useServices } from "@/api";
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
              <Button type="button">
                <ImportIcon size={16} />
                <span>{t("services.importServices")}</span>
              </Button>

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
              {/* <div>
                <SearchInput
                  data-testid="search"
                  style={{ marginBottom: 8, maxWidth: 300 }}
                >
                  {servicesIsRefetching ? (
                    <LoaderCircle size={20} />
                  ) : (
                    <Search size={20} />
                  )}
                  <Input
                    type="text"
                    id={"services-search-input"}
                    aria-autocomplete="none"
                    placeholder={t("services.searchServices")}
                    aria-label={t("common.search")}
                    autoComplete="off"
                    tabIndex={0}
                    onChange={($event) => {
                      $event.preventDefault();
                      $event.stopPropagation();
                    }}
                  />
                </SearchInput>
              </div> */}

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
            </PageSection>
          </PageBody>
          <Outlet />
        </PageContainer>
      )}
    </>
  );
}
