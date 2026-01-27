import { memo, useState } from "react";
import { createPortal } from "react-dom";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ManageCategoriesFormModal } from "@/containers/ManageCategoriesFormModal";
import type {
  BuukiaCategory,
  CreateCategoryBody,
  CreateServiceBody,
  NewCategoryFormValues,
  ServiceFormValues,
} from "@/types";
import { serviceFormSchema, validateResolver } from "@/validators";

import { Button } from "../Button";
import {
  Combobox,
  Field,
  FieldError,
  Form,
  Input,
  Label,
  Select,
  TextArea,
} from "../Form";

type ServiceFormProps = {
  values: ServiceFormValues;
  isLoading: boolean;
  categories: BuukiaCategory[];
  categoriesIsLoading: boolean;
  deleteCategory: (categoryId: string) => void;
  onCategorySearch: (query: string) => void;
  onSubmit: (data: CreateServiceBody | CreateCategoryBody) => void;
};

export const ServiceForm = memo((props: ServiceFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<ServiceFormValues, "id">>({
    values: {
      ...props.values,
    },
    resolver: validateResolver(serviceFormSchema),
  });

  const [showModal, setShowModal] = useState(false);

  const onSubmit = (data: ServiceFormValues | NewCategoryFormValues) => {
    if ("category" in data) {
      const body: CreateServiceBody = {
        name: data.name,
        category: data.category ? data.category[0] : { id: "", name: "" }, // Adjusted for single select
        duration: data.duration,
        price: data.price,
        description: data.description,
      };

      props.onSubmit(body);
    } else {
      const body: CreateCategoryBody = {
        name: data.name,
      };

      props.onSubmit(body);
    }
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
            placeholder={t("services.testService")}
          />
          {errors.name && (
            <FieldError role="alert">
              {t("services.form.errors.nameError")}
            </FieldError>
          )}
        </Field>

        <Field>
          <Label id={"service-category-label"} htmlFor="service-category-input">
            {t("services.detail.category")}
          </Label>
          <Controller
            name="category"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Combobox
                {...register("category")}
                id="service-category-input"
                data-testid="service-category-input"
                valueKey="id"
                displayKey="name"
                items={props.categories}
                disabled={false}
                loading={props.isLoading}
                search={true}
                addButtonText={t("services.addCategory")}
                onChange={(e) => onChange(JSON.parse(e.target.value))}
                onBlur={onBlur}
                value={value ? value : []}
                multiselect={false}
                onAdd={($event: React.MouseEvent<HTMLButtonElement>) => {
                  setShowModal(true);
                  $event.preventDefault();
                  $event.stopPropagation();
                }}
              />
            )}
          />
          {errors.category && (
            <FieldError role="alert">
              {t("services.form.errors.categoryError")}
            </FieldError>
          )}
        </Field>

        <Field>
          <Label id={"service-price-label"} htmlFor="service-price-input">
            {t("services.detail.price")}
          </Label>
          <Controller
            name="price"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                onChange={($event) => {
                  const maybeNumber = parseInt($event.target.value);

                  if (isNaN(maybeNumber)) {
                    return;
                  }

                  return onChange(maybeNumber);
                }}
                value={value}
                id="service-price-input"
                type="text"
                data-testid="service-price-input"
                placeholder={t("common.loading")}
              />
            )}
          />
          {errors.price && (
            <FieldError role="alert">
              {t("services.form.errors.priceError")}
            </FieldError>
          )}
        </Field>

        <Field>
          <Label id={"service-duration-label"} htmlFor="service-duration-input">
            {t("services.detail.duration")}
          </Label>
          <Select
            {...register("duration")}
            data-testid="service-duration-input"
            id="service-duration-input"
            defaultValue={""}
          >
            <option value="" disabled>
              {t("common.selectAnItem")}
            </option>
            {[15, 30, 45, 60, 75, 90, 105, 120].map((duration) => (
              <option key={duration} value={duration}>
                {duration} {t("services.detail.minutes")}
              </option>
            ))}
          </Select>
          {errors.duration && (
            <FieldError role="alert">
              {t("services.form.errors.timeError")}
            </FieldError>
          )}
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
            placeholder={t("services.testDescription")}
          />
          {errors.description && (
            <FieldError role="alert">
              {t("services.form.errors.descriptionError")}
            </FieldError>
          )}
        </Field>

        <Button disabled={props.isLoading} size="sm" tabIndex={0} type="submit">
          {t("common.submit")}
        </Button>
      </Form>

      {showModal &&
        createPortal(
          <ManageCategoriesFormModal
            categories={props.categories}
            deleteCategory={props.deleteCategory}
            onSubmit={props.onSubmit}
            close={() => setShowModal(false)}
          />,
          document.body,
        )}
    </>
  );
});
