import { Form, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Field, FieldError, Fieldset, Input, Label } from "../Form";
import { PatternFormatInput } from "../Form/PatternFormatInput";

export const BusinessForm = () => {
  const { t } = useTranslation();

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Form
      data-testid="business-form"
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
            {t("account.detail.form.business.name")}
          </Label>
          <Input
            {...register("name")}
            id="name-input"
            type="text"
            data-testid="name-input"
            placeholder={t("account.detail.form.business.name")}
          />
          {errors.name && (
            <FieldError role="alert">
              {t("account.detail.form.business.errors.name")}
            </FieldError>
          )}
        </Field>

        <Field>
          <Label id={"taxNumber-label"} htmlFor="taxNumber-input">
            {t("account.detail.form.business.taxNumber")}
          </Label>
          <Input
            {...register("taxNumber")}
            id="taxNumber-input"
            type="text"
            data-testid="taxNumber-input"
            placeholder={t(
              "account.detail.form.business.placeholders.taxNumber",
            )}
          />
          {errors.taxNumber && (
            <FieldError role="alert">
              {t("account.detail.form.business.errors.taxNumber")}
            </FieldError>
          )}
        </Field>

        <Field>
          <Label id={"phone-label"} htmlFor="phone-input">
            {t("account.detail.form.business.tel")}
          </Label>
          <PatternFormatInput
            {...register("tel")}
            type="tel"
            format="+34 ### ### ####"
            id="tel-input"
            data-testid="tel-input"
            placeholder={t("account.detail.form.business.placeholders.tel")}
          />
          {errors.tel && (
            <FieldError role="alert">
              {t("account.detail.form.business.errors.tel")}
            </FieldError>
          )}
        </Field>
      </Fieldset>

      <Fieldset style={{ flex: 1 }}>
        <Field>
          <Label id={"address-label"} htmlFor="address-input">
            {t("account.detail.form.business.address")}
          </Label>
          <Input
            {...register("address")}
            type="text"
            id="address-input"
            data-testid="address-input"
            placeholder={t("account.detail.form.business.placeholders.address")}
          />
          {errors.address && (
            <FieldError role="alert">
              {t("account.detail.form.business.errors.address")}
            </FieldError>
          )}
        </Field>

        <div
          style={{
            flex: 1,
            flexDirection: "row",
            display: "flex",
            gap: "12px",
          }}
        >
          <Field>
            <Label id={"city-label"} htmlFor="city-input">
              {t("account.detail.form.business.city")}
            </Label>
            <Input
              {...register("city")}
              type="text"
              id="city-input"
              data-testid="city-input"
              placeholder={t("account.detail.form.business.placeholders.city")}
            />
            {errors.city && (
              <FieldError role="alert">
                {t("account.detail.form.business.errors.city")}
              </FieldError>
            )}
          </Field>

          <Field>
            <Label id={"municipality-label"} htmlFor="municipality-input">
              {t("account.detail.form.business.municipality")}
            </Label>
            <Input
              {...register("municipality")}
              type="text"
              id="municipality-input"
              data-testid="municipality-input"
              placeholder={t(
                "account.detail.form.business.placeholders.municipality",
              )}
            />
            {errors.municipality && (
              <FieldError role="alert">
                {t("account.detail.form.business.errors.municipality")}
              </FieldError>
            )}
          </Field>
        </div>

        <div
          style={{
            flex: 1,
            flexDirection: "row",
            display: "flex",
            gap: "12px",
          }}
        >
          <Field>
            <Label id={"code-label"} htmlFor="code-input">
              {t("account.detail.form.business.code")}
            </Label>
            <Input
              {...register("code")}
              type="text"
              id="code-input"
              data-testid="code-input"
              placeholder={t("account.detail.form.business.placeholders.code")}
            />
            {errors.code && (
              <FieldError role="alert">
                {t("account.detail.form.business.errors.code")}
              </FieldError>
            )}
          </Field>

          <Field>
            <Label id={"country-label"} htmlFor="country-input">
              {t("account.detail.form.business.country")}
            </Label>
            <Input
              {...register("country")}
              type="text"
              id="country-input"
              data-testid="country-input"
              placeholder={t(
                "account.detail.form.business.placeholders.country",
              )}
            />
            {errors.country && (
              <FieldError role="alert">
                {t("account.detail.form.business.errors.country")}
              </FieldError>
            )}
          </Field>
        </div>
      </Fieldset>
    </Form>
  );
};
