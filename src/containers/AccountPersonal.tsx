import { format } from "date-fns";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useAccount, useUpdateAccount } from "@/api";
import { AccountForm } from "@/components/Accounts/AccountForm";
import { ErrorContainer, ErrorDetail } from "@/components/Error";
import type { AccountPersonalFormValues, UpdateAccountBody } from "@/types";

import AccountPage from "./AccountPage";

export default function AccountPersonal() {
  const { t } = useTranslation();

  const [updateAccount] = [useUpdateAccount()];

  const {
    data: account = {
      id: "",
      personal: {
        name: "",
        email: "",
        dob: "",
        tel: "",
      },
      business: {
        name: "",
        tax: {
          number: "",
        },
        mobile: "",
        contact: {
          address: "",
          city: "",
          municipality: "",
          postalCode: "",
          country: "",
        },
      },
    },
    error: accountError,
    isLoading: accountLoading,
  } = useAccount();

  const submit = useCallback(
    async (data: UpdateAccountBody) =>
      updateAccount.mutate(data, {
        onSuccess: () => {},
      }),
    [account?.id],
  );

  const formValues: AccountPersonalFormValues = useMemo(
    () => ({
      name: account?.personal?.name || "",
      email: account?.personal?.email || "",
      dob:
        account?.personal?.dob.length > 0
          ? format(new Date(account?.personal?.dob).toISOString(), "ddLLyyyy")
          : "",
      tel:
        account?.personal?.tel.length > 0
          ? account?.personal?.tel.split(" ").slice(1).join("")
          : "",
    }),
    [account],
  );

  const isError = accountError;

  return (
    <AccountPage>
      {isError && (
        <ErrorContainer>
          <ErrorDetail message={t("account.loadingError")} />
        </ErrorContainer>
      )}
      {!isError && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <AccountForm
            values={formValues}
            onSubmit={submit}
            isLoading={accountLoading}
          />
        </div>
      )}
    </AccountPage>
  );
}
