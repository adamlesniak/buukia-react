import { useTranslation } from "react-i18next";

import { useAccount } from "@/api";
import { AccountForm } from "@/components/Accounts/AccountForm";
import { ErrorContainer, ErrorDetail } from "@/components/Error";

import AccountPage from "./AccountPage";

export default function AccountPersonal() {
  const { t } = useTranslation();

  const {
    // data,
    error: accountError,
    // isLoading: assistantsLoading,
    // refetch: refetchServices,
    // isRefetching: assistantsIsRefetching,
  } = useAccount();

  const isError = accountError;

  return (
    <AccountPage>
      {isError && (
        <ErrorContainer>
          <ErrorDetail message={t("assistants.loadingError")} />
        </ErrorContainer>
      )}
      {!isError && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <AccountForm
            values={{
              name: "John Doe",
              email: "",
              dob: "",
              tel: "",
            }}
            onSubmit={(data) => {
              console.log("data", data);
            }}
            isLoading={false}
          />
        </div>
      )}
    </AccountPage>
  );
}
