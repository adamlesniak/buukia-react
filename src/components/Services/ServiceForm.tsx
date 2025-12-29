import { memo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { CreateServiceBody, ServiceFormValues } from "@/types";

import { Button } from "../Button";
import { Field, Form, FormSummary, Input, Label, TextArea } from "../Form";

type ServiceFormProps = {
  values: ServiceFormValues;
  serviceId: string;
  isLoading: boolean;
  onSubmit: (data: CreateServiceBody) => void;
};

export const ServiceForm = memo((props: ServiceFormProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
  } = useForm<ServiceFormValues>({
    values: {
      ...props.values,
    },
  });

  const onSubmit = (data: ServiceFormValues) => {
    const body: CreateServiceBody = {
      name: data.name,
      category: data.category,
      duration: data.duration,
      price: data.price,
      description: data.description,
    };

    props.onSubmit(body);
  };

  return (
    <>
      <Form data-testid="service-form" onSubmit={handleSubmit(onSubmit)}>
        <Field>
          <Label id={"service-name-label"} htmlFor="service-name-input">
            {t("services.detail.name")}
          </Label>
          <Input
            {...register("name")}
            id="service-name-input"
            type="text"
            data-testid="service-name-input"
            placeholder={t("common.loading")}
          />
        </Field>

        <Field>
          <Label id={"service-category-label"} htmlFor="service-category-input">
            {t("services.detail.category")}
          </Label>
          <Input
            {...register("category")}
            id="service-category-input"
            type="text"
            data-testid="service-category-input"
            placeholder={t("common.loading")}
          />
        </Field>

        <Field>
          <Label id={"service-price-label"} htmlFor="service-price-input">
            {t("services.detail.price")}
          </Label>
          <Input
            {...register("price")}
            id="service-price-input"
            type="text"
            data-testid="service-price-input"
            placeholder={t("common.loading")}
          />
        </Field>

        <Field>
          <Label id={"service-duration-label"} htmlFor="service-duration-input">
            {t("services.detail.duration")}
          </Label>
          <Input
            {...register("duration")}
            id="service-duration-input"
            type="text"
            data-testid="service-duration-input"
            placeholder={t("common.loading")}
          />
        </Field>

        <Field>
          <Label
            id={"service-description-label"}
            htmlFor="service-description-input"
          >
            {t("services.detail.description")}
          </Label>
          <TextArea
            {...register("description")}
            id="service-description-input"
            data-testid="service-description-input"
            placeholder={t("common.loading")}
          />
        </Field>

        <FormSummary>
          <Button
            disabled={props.isLoading}
            size="sm"
            tabIndex={0}
            type="submit"
          >
            {t("common.submit")}
          </Button>
        </FormSummary>
      </Form>
    </>
  );
});
