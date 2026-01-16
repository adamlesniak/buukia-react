import { Copy, PlusIcon, TrashIcon } from "lucide-react";
import { useState, memo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { ManageCategoriesFormModal } from "@/containers/ManageCategoriesFormModal";
import {
  type AssistantFormValues,
  type BuukiaCategory,
  type CreateAssistantBody,
  type CreateCategoryBody,
  type NewCategoryFormValues,
} from "@/types";
import { getDayName } from "@/utils";

import { Button } from "../Button";
import {
  Combobox,
  Field,
  FieldError,
  Fieldset,
  Form,
  FormSummary,
  Input,
  Label,
} from "../Form";
import {
  Timeslot,
  TimeslotActions,
  TimeslotField,
  TimeslotFieldWrapper,
  TimeslotsContainer,
} from "../Timeslots";

const AvailabilityContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  flex: 1;
`;

type AssistantFormProps = {
  assistantId: string;
  categories: BuukiaCategory[];
  values: AssistantFormValues;
  isLoading: boolean;
  categoriesIsLoading: boolean;
  deleteCategory: (categoryId: string) => void;
  onCategorySearch: (query: string) => void;
  onSubmit: (data: CreateAssistantBody | CreateCategoryBody) => void;
};

export const AssistantForm = memo((props: AssistantFormProps) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AssistantFormValues>({
    values: {
      ...props.values,
    },
  });

  const modalClose = useCallback(() => {
    setShowModal(false);
  }, [props.assistantId]);

  const onSubmit = (data: AssistantFormValues | NewCategoryFormValues) => {
    if ("availability" in data) {
      const body: CreateAssistantBody = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        categories: data.categories,
        availability: data.availability,
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
      <Form
        fullHeight={true}
        data-testid="assistant-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Fieldset>
          <Field>
            <Label id={"first-name-label"} htmlFor="first-name-input">
              {t("assistants.detail.firstName")}
            </Label>
            <Input
              {...register("firstName")}
              id="first-name-input"
              type="text"
              data-testid="first-name-input"
            />
            {errors.firstName && (
              <FieldError role="alert">
                {t("assistants.form.errors.firstNameError")}
              </FieldError>
            )}
          </Field>

          <Field>
            <Label id={"last-name-label"} htmlFor="last-name-input">
              {t("assistants.detail.lastName")}
            </Label>
            <Input
              {...register("lastName")}
              id="last-name-input"
              type="text"
              data-testid="last-name-input"
            />
            {errors.lastName && (
              <FieldError role="alert">
                {t("assistants.form.errors.lastNameError")}
              </FieldError>
            )}
          </Field>

          <Field>
            <Label id={"email-label"} htmlFor="email-input">
              {t("assistants.detail.email")}
            </Label>
            <Input
              {...register("email")}
              id="email-input"
              type="text"
              data-testid="email-input"
            />
            {errors.email && (
              <FieldError role="alert">
                {t("assistants.form.errors.emailError")}
              </FieldError>
            )}
          </Field>

          <Field>
            <Label id={"categories-label"} htmlFor="categories-input">
              {t("assistants.detail.categories")}
            </Label>
            <Controller
              name="categories"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Combobox
                  {...register("categories")}
                  id="categories-input"
                  data-testid="categories-input"
                  valueKey="id"
                  displayKey="name"
                  items={props.categories}
                  disabled={false}
                  loading={props.isLoading}
                  search={true}
                  multiselect={true}
                  onChange={(e) => onChange(JSON.parse(e.target.value))}
                  onBlur={onBlur}
                  value={value}
                  addButtonText={t("assistants.addCategory")}
                  onAdd={($event: React.MouseEvent<HTMLButtonElement>) => {
                    setShowModal(true);
                    $event.preventDefault();
                    $event.stopPropagation();
                  }}
                />
              )}
            />

            {errors.categories && (
              <FieldError role="alert">
                {t("assistants.form.errors.categoryError")}
              </FieldError>
            )}
          </Field>
        </Fieldset>

        <Label id={"availability-label"} htmlFor="availability-input">
          {t("assistants.detail.availability")}
        </Label>
        <AvailabilityContainer>
          <TimeslotsContainer>
            {props.values.availability.map((availability) => (
              <Timeslot>
                <h4>
                  {t(`common.daysOfWeek.${getDayName(availability.dayOfWeek)}`)}
                </h4>
                <TimeslotFieldWrapper>
                  <TimeslotField>
                    <Input
                      type="time"
                      id="appointment"
                      name="appointment"
                      min="09:00"
                      max="18:00"
                      style={{ marginLeft: "0px" }}
                      required
                    />
                    -
                    <Input
                      type="time"
                      id="appointment"
                      name="appointment"
                      min="09:00"
                      max="18:00"
                      required
                    />
                    <Button
                      size="sm"
                      variant="transparent"
                      tabIndex={0}
                      onClick={() => {}}
                      type="button"
                    >
                      <TrashIcon />
                    </Button>
                  </TimeslotField>
                  <TimeslotActions>
                    <Button
                      size="sm"
                      variant="transparent"
                      tabIndex={0}
                      onClick={() => {}}
                      type="button"
                    >
                      <PlusIcon />
                    </Button>
                    <Button
                      size="sm"
                      variant="transparent"
                      tabIndex={0}
                      onClick={() => {}}
                      type="button"
                    >
                      <Copy />
                    </Button>
                  </TimeslotActions>
                </TimeslotFieldWrapper>
              </Timeslot>
            ))}
          </TimeslotsContainer>
        </AvailabilityContainer>

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
          <ManageCategoriesFormModal
            onSubmit={onSubmit}
            close={modalClose}
            categories={props.categories}
            deleteCategory={props.deleteCategory}
          />,
          document.body,
        )}
    </>
  );
});
