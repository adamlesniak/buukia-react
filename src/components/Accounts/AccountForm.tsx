import { Form, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Field, FieldError, Fieldset, Input, Label } from "../Form";
import { PatternFormatInput } from "../Form/PatternFormatInput";

export const AccountForm = () => {
  const { t } = useTranslation();

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Form
      data-testid="account-form"
      style={{
        flexDirection: "row",
        display: "flex",
        gap: "12px",
        marginTop: "12px",
      }}
    >
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
            placeholder={t("account.detail.form.account.placeholders.email")}
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
          <PatternFormatInput
            {...register("dob")}
            type="text"
            format="##/##/####"
            id="dob-input"
            data-testid="dob-input"
            placeholder={t("account.detail.form.account.placeholders.dob")}
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
          <PatternFormatInput
            {...register("tel")}
            type="tel"
            format="+34 ### ### ####"
            id="tel-input"
            data-testid="tel-input"
            placeholder={t("account.detail.form.account.placeholders.tel")}
          />
          {errors.tel && (
            <FieldError role="alert">
              {t("account.detail.form.account.errors.tel")}
            </FieldError>
          )}
        </Field>
      </Fieldset>
    </Form>
  );
};
