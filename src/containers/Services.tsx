import { Outlet, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {  useServices } from "@/api";
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
import { MAX_PAGINATION } from "@/constants";
import { centsToFixed } from "@/utils";

export default function Services() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [servicesQuery, _setServicesQuery] = useState("");

  const {
    data: services = [],
    error: servicesError,
    // isLoading: servicesLoading,
    // refetch: refetchServices,
    // isRefetching: servicesIsRefetching,
  } = useServices({ limit: MAX_PAGINATION, query: "" });

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
                    <TableHeaderItem>
                      {t("services.table.name")}
                    </TableHeaderItem>
                    <TableHeaderItem>
                      {t("services.table.category")}
                    </TableHeaderItem>
                    <TableHeaderItem>
                      {t("services.table.duration")}
                    </TableHeaderItem>
                    <TableHeaderItem>
                      {t("services.table.price")}
                    </TableHeaderItem>
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
                          $event.preventDefault();
                          $event.stopPropagation();
                        }
                      }}
                      $type="body"
                      key={service.id}
                      tabIndex={0}
                      data-testid="service-row"
                    >
                      <TableRowItem>{service.name}</TableRowItem>
                      <TableRowItem>{service.category.name}</TableRowItem>
                      <TableRowItem>{service.duration}</TableRowItem>
                      <TableRowItem>€{centsToFixed(service.price)}</TableRowItem>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {services.length === 0 && <p>{t("services.noServicesFound")}</p>}
            </PageSection>
          </PageBody>
          <Outlet />
        </PageContainer>
      )}
    </>
  );
}
