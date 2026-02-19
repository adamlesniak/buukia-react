import { Upload } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useAccount } from "@/api";
import { AccountForm } from "@/components/Accounts/AccountForm";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ErrorContainer, ErrorDetail } from "@/components/Error";
import type { PersonalFormValues } from "@/types";

import AccountPage from "./AccountPage";

const UploadOverlay = styled.div`
  background: rgba(0, 0, 0, 0.1);
  border-radius: 512px;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Thumbnail = styled.label`
  position: relative;
  border-radius: 512px;

  &:hover {
    .upload-overlay {
      display: flex;
    }
  }
`;

export default function AccountPersonal() {
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
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <FormProvider {...form}>
            <Card
              style={{ flex: 1 }}
              $layout="column"
              data-testid="card-total"
              $borderRadius="right"
            >
              <h2 style={{ marginBottom: "0px" }}>
                {t("account.personal.title")}
              </h2>
              <p>{t("account.personal.details")}</p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Thumbnail>
                  <img
                    src="/assets/account.png"
                    width="128"
                    style={{ borderRadius: "512px" }}
                  />
                  <input
                    type="file"
                    id="doc"
                    name="doc"
                    accept="png, jpg"
                    hidden
                    onChange={($event) => {
                      console.log($event.target.value);
                    }}
                  />
                  <UploadOverlay className="upload-overlay">
                    <Upload size={32} strokeWidth={3} color={"#FFF"} />
                  </UploadOverlay>
                </Thumbnail>
                <div style={{ flex: 1, marginLeft: "16px" }}>
                  <AccountForm />
                </div>
              </div>
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
        </div>
      )}
    </AccountPage>
  );
}
