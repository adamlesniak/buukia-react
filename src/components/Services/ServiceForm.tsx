import { TrashIcon } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { FocusScope } from "react-aria";
import { createPortal } from "react-dom";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type {
  BuukiaCategory,
  CreateCategoryBody,
  CreateServiceBody,
  NewCategoryFormValues,
  ServiceFormValues,
} from "@/types";
import { serviceFormSchema, validateResolver } from "@/validators";

import { Button } from "../Button";
import { Card, CardDescription } from "../Card";
import { MemoizedDrawerHeaderH3 } from "../Drawer";
import {
  Combobox,
  Field,
  FieldError,
  Form,
  FormSummary,
  Input,
  Label,
  Select,
  TextArea,
} from "../Form";
import { Modal, ModalBody, Overlay } from "../Modal";

type ServiceFormProps = {
  values: ServiceFormValues;
  serviceId: string;
  isLoading: boolean;
  categories: BuukiaCategory[];
  categoriesIsLoading: boolean;
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
  } = useForm<ServiceFormValues>({
    values: {
      ...props.values,
    },
    resolver: validateResolver(serviceFormSchema),
  });
  const {
    register: registerNewCategoryForm,
    handleSubmit: handleSubmitNewCategoryForm,
  } = useForm<NewCategoryFormValues>({
    values: {
      name: "",
    },
  });

  const [showModal, setShowModal] = useState(false);

  const onSubmit = (data: ServiceFormValues | NewCategoryFormValues) => {
    if ("category" in data) {
      const body: CreateServiceBody = {
        name: data.name,
        category: data.category,
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

  const modalClose = useCallback(() => {
    props.onCategorySearch("");
    setShowModal(false);
  }, [props.serviceId]);

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
          <Combobox
            {...register("category")}
            id="service-category-input"
            data-testid="service-category-input"
            valueKey="name"
            items={props.categories}
            disabled={false}
            loading={props.isLoading}
            search={true}
            onAdd={($event: React.MouseEvent<HTMLDivElement>) => {
              setShowModal(true);
              $event.preventDefault();
              $event.stopPropagation();
            }}
          ></Combobox>
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
          >
            <option value="" disabled selected>
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
      {showModal &&
        createPortal(
          <Overlay onClick={() => setShowModal(false)}>
            <Modal
              onClick={($event) => {
                $event.stopPropagation();
              }}
              data-testid="services-modal"
            >
              <FocusScope autoFocus restoreFocus contain>
                <MemoizedDrawerHeaderH3
                  title={t("services.addCategory")}
                  onClose={modalClose}
                  label={t("common.closeModal")}
                />

                <Form
                  fullHeight={true}
                  data-testid="add-category-form"
                  onSubmit={handleSubmitNewCategoryForm(onSubmit)}
                >
                  <Field style={{ flexDirection: "row", alignItems: "center" }}>
                    <Input
                      {...registerNewCategoryForm("name")}
                      id="category-name-input"
                      type="text"
                      data-testid="category-name-input"
                      placeholder={t("services.testCategory")}
                      style={{ flex: 4, borderRadius: "12px 0px 0px 12px" }}
                    />
                    {errors.name && (
                      <FieldError role="alert">
                        {t("services.form.errors.nameError")}
                      </FieldError>
                    )}
                    <Button
                      size="sm"
                      tabIndex={0}
                      type="submit"
                      style={{
                        flex: 1,
                        height: "37px",
                        borderRadius: "0px 12px 12px 0px",
                      }}
                    >
                      {t("services.addCategory")}
                    </Button>
                  </Field>

                  <ModalBody tabIndex={-1} data-testid="create-category-modal">
                    {props.categories &&
                      props.categories.length > 0 &&
                      props.categories.map((category) => (
                        <Card
                          data-testid="category-list-item"
                          key={category.id}
                        >
                          <CardDescription title={`${category.name}`} />
                          <Button
                            size="sm"
                            tabIndex={0}
                            onClick={() => {}}
                            type="button"
                          >
                            <TrashIcon />
                          </Button>
                        </Card>
                      ))}
                  </ModalBody>
                </Form>
              </FocusScope>
            </Modal>
          </Overlay>,
          document.body,
        )}
    </>
  );
});
