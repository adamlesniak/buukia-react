import { Upload } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { SETTINGS } from "@/constants";
import type { AccountPersonalFormValues, UpdateAccountBody } from "@/types";
import { accountFormSchema } from "@/validators";
import { validateResolver } from "@/validators/validator";

import { Button } from "../Button";
import { Card } from "../Card";
import { Field, FieldError, Fieldset, Input, Label, Form } from "../Form";
import { PatternFormatInput } from "../Form/PatternFormatInput";

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
  width: 128px;
  height: 128px;

  &:hover {
    .upload-overlay {
      display: flex;
    }
  }
`;

type AccountFormProps = {
  values: AccountPersonalFormValues;
  isLoading: boolean;
  onSubmit: (data: UpdateAccountBody) => void;
};

export const AccountForm = (props: AccountFormProps) => {
  const { t } = useTranslation();

  const onSubmit = (data: AccountPersonalFormValues) =>
    props.onSubmit({ ...data, tel: `${SETTINGS.countryCode}${data.tel}` });

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<AccountPersonalFormValues>({
    values: {
      name: props.values.name,
      email: props.values.email,
      dob: props.values.dob,
      tel: props.values.tel,
    },
    resolver: validateResolver(accountFormSchema),
  });

  return (
    <Form
      data-testid="account-form"
      style={{
        flexDirection: "column",
        display: "flex",
        gap: "12px",
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card
        style={{ flex: 1 }}
        $layout="column"
        data-testid="card-total"
        $borderRadius="right"
      >
        <h2 style={{ marginBottom: "0px" }}>{t("account.personal.title")}</h2>
        <p>{t("account.personal.details")}</p>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              flexDirection: "row",
              display: "flex",
              gap: "12px",
              marginTop: "12px",
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

            <Fieldset style={{ flex: 1 }}>
              <Field>
                <Label id={"first-name-label"} htmlFor="first-name-input">
                  {t("account.detail.form.account.name")}
                </Label>
                <Input
                  {...register("name")}
                  id="name-input"
                  type="text"
                  data-testid="name-input"
                  placeholder={t("account.detail.form.account.name")}
                  disabled={true}
                />
                {errors.name && (
                  <FieldError role="alert">
                    {t("account.detail.form.account.errors.name")}
                  </FieldError>
                )}
              </Field>

              <Field>
                <Label id={"email-label"} htmlFor="email-input">
                  {t("account.detail.form.account.email")}
                </Label>
                <Input
                  {...register("email")}
                  id="email-input"
                  type="text"
                  data-testid="email-input"
                  placeholder={t(
                    "account.detail.form.account.placeholders.email",
                  )}
                />
                {errors.email && (
                  <FieldError role="alert">
                    {t("account.detail.form.account.errors.email")}
                  </FieldError>
                )}
              </Field>
            </Fieldset>

            <Fieldset style={{ flex: 1 }}>
              <Field>
                <Label id={"dob-label"} htmlFor="dob-input">
                  {t("account.detail.form.account.dob")}
                </Label>
                <Controller
                  control={control}
                  name="dob"
                  render={({ field: { onChange, name, value } }) => (
                    <PatternFormatInput
                      name={name}
                      value={value}
                      onValueChange={(values) => {
                        onChange(values.value);
                      }}
                      type="text"
                      format="##/##/####"
                      id="dob-input"
                      data-testid="dob-input"
                      placeholder={t(
                        "account.detail.form.account.placeholders.dob",
                      )}
                    />
                  )}
                />
                {errors.dob && (
                  <FieldError role="alert">
                    {t("account.detail.form.account.errors.dob")}
                  </FieldError>
                )}
              </Field>

              <Field>
                <Label id={"tel-label"} htmlFor="tel-input">
                  {t("account.detail.form.account.tel")}
                </Label>
                <Controller
                  control={control}
                  name="tel"
                  render={({ field: { onChange, name, value } }) => (
                    <PatternFormatInput
                      name={name}
                      value={value}
                      onValueChange={(values) => {
                        onChange(values.value);
                      }}
                      type="tel"
                      format="+34 ### ### ###"
                      id="tel-input"
                      data-testid="tel-input"
                      placeholder={t(
                        "account.detail.form.account.placeholders.tel",
                      )}
                    />
                  )}
                />
                {errors.tel && (
                  <FieldError role="alert">
                    {t("account.detail.form.account.errors.tel")}
                  </FieldError>
                )}
              </Field>
            </Fieldset>
          </div>
        </div>
      </Card>
      <div style={{ justifyContent: "end" }}>
        <Button type="submit" variant="accent" style={{ width: "200px" }}>
          {t("common.submit")}
        </Button>
      </div>
    </Form>
  );
};
