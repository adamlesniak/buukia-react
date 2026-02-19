import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAccount } from "@/api";
import { BusinessForm } from "@/components/Accounts";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ErrorContainer, ErrorDetail } from "@/components/Error";
import type { PersonalFormValues } from "@/types";

import AccountPage from "./AccountPage";

export default function AccountBusiness() {
  const { t } = useTranslation();

  const {
    // data,
    error: accountError,
    // isLoading: assistantsLoading,
    // refetch: refetchServices,
    // isRefetching: assistantsIsRefetching,
  } = useAccount();

  const form = useForm<PersonalFormValues>({
    values: {
      avatar: "",
      name: "",
      email: "",
      dob: "",
      tel: "",
    },
  });

  const isError = accountError;

  return (
    <AccountPage>
      {isError && (
        <ErrorContainer>
          <ErrorDetail message={t("assistants.loadingError")} />
        </ErrorContainer>
      )}
      {!isError && (
        <FormProvider {...form}>
          <Card
            style={{ flex: 1 }}
            $layout="column"
            data-testid="card-total"
            $borderRadius="right"
          >
            <h2 style={{ marginBottom: "0px" }}>
              {t("account.business.title")}
            </h2>
            <p>{t("account.business.details")}</p>
            <BusinessForm />
          </Card>
          <div style={{ justifyContent: "end" }}>
            <Button
              type="button"
              variant="accent"
              style={{ width: "200px", marginTop: "8px" }}
            >
              {t("common.submit")}
            </Button>
          </div>
        </FormProvider>
      )}
    </AccountPage>
  );
}
