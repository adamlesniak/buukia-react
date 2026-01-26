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
import { MAX_PAGINATION } from "@/constants.ts";

export default function Payments() {
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
          <ErrorDetail message={t("payments.loadingError")} />
        </ErrorContainer>
      )}
      {!isError && (
        <PageContainer>
          <PageHeader style={{ marginBottom: 8 }}>
            <PageHeaderItem>
              <div>
                <h2>{t("payments.title")}</h2>
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

            </PageSection>
          </PageBody>
          <Outlet />
        </PageContainer>
      )}
    </>
  );
}
