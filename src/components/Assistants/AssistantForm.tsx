import { Copy, PlusIcon, TrashIcon } from "lucide-react";
import { useState, memo, useEffect, useCallback } from "react";
import { FocusScope } from "react-aria";
import { createPortal } from "react-dom";
import {
  Controller,
  useForm,
  useFieldArray,
  useFormContext,
  FormProvider,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { ManageCategoriesFormModal } from "@/containers/ManageCategoriesFormModal";
import {
  type AssistantFormValues,
  type AvailabilitySlot,
  type BuukiaCategory,
  type CreateAssistantBody,
  type CreateCategoryBody,
  type NewCategoryFormValues,
} from "@/types";
import { getDayName, hasElementParentWithId } from "@/utils";
import { validateResolver, assistantFormSchema } from "@/validators";

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

const AssistantAvailabilityDropdown = styled.div`
  display: flex;
  padding: 16px;
  background: #fff;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: absolute;
  left: -133px;
  width: 100px;
  top: 0px;
  z-index: 1;
  display: flex;
  flex-direction: column;

  h3 {
    padding: 0px;
    margin: 0px;
  }
`;

const AssistantAvailabilityList = styled.ul`
  list-style-type: none;
  padding: 0px;
  margin: 0px;
  margin-top: 16px;
`;

const AssistantAvailabilityListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

interface FormValues {
  availability: AvailabilitySlot[];
}

type AvailabilityFieldProps = {
  fieldIndex: number;
};

type AvailabilityFieldCopyFormValues = {
  copyTo: {
    day: number;
    copy: boolean;
  }[];
};

const AvailabilityField = memo(({ fieldIndex }: AvailabilityFieldProps) => {
  const { t } = useTranslation();
  const { register, getValues: getMainFormValues, setValue } = useFormContext();

  const [showDropdown, setShowDropdown] = useState(false);

  const {
    control,
    register: registerCopyForm,
    getValues,
  } = useForm<AvailabilityFieldCopyFormValues>({
    values: {
      copyTo: Array.from({ length: 7 }).map((_, index) => ({
        day: index,
        copy: false,
      })),
    },
  });
  const { fields: copyFields } = useFieldArray({
    control,
    name: "copyTo",
  });

  const submit = () => {
    for (const day of getValues("copyTo")) {
      getMainFormValues(`availability.${fieldIndex}.times`);

      if (day.copy) {
        setValue(
          `availability.${day.day}.times`,
          getMainFormValues(`availability.${fieldIndex}.times`),
        );
      }
    }

    setShowDropdown(false);
  };

  const handleClickOutside = useCallback(($event: MouseEvent) => {
    const target = $event.target as Element;

    // Don't close if clicking the copy button or inside the dropdown
    if (hasElementParentWithId(target, "assistant-availability-dropdown")) {
      return;
    }

    setShowDropdown(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const {
    fields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray<FormValues>({
    name: `availability.${fieldIndex}.times`,
  });

  return (
    <Timeslot>
      <h4>{t(`common.daysOfWeek.${getDayName(fieldIndex)}`)}</h4>
      {fields.map((field, index) => (
        <TimeslotFieldWrapper
          data-testid={`timeslot-${fieldIndex}`}
          key={field.id}
        >
          <TimeslotField
            data-testid={`availability-${fieldIndex}-timeslot-${index}`}
          >
            <Input
              type="time"
              {...register(`availability.${fieldIndex}.times.${index}.start`)}
              data-testid={`availability-${fieldIndex}-start-time-input-${index}`}
              style={{ marginLeft: "0px" }}
            />
            -
            <Input
              type="time"
              {...register(`availability.${fieldIndex}.times.${index}.end`)}
              data-testid={`availability-${fieldIndex}-end-time-input-${index}`}
            />
            {fields.length > 1 && (
              <Button
                size="sm"
                variant="transparent"
                tabIndex={0}
                onClick={() => removeChild(index)}
                type="button"
                data-testid={"delete-availability-button"}
              >
                <TrashIcon />
              </Button>
            )}
          </TimeslotField>

          {index === 0 && (
            <TimeslotActions>
              <Button
                size="sm"
                variant="transparent"
                tabIndex={0}
                className={showDropdown ? "active" : ""}
                onClick={() => setShowDropdown(!showDropdown)}
                type="button"
                data-testid={"copy-availability-button"}
              >
                <Copy />
              </Button>
              <Button
                size="sm"
                variant="transparent"
                tabIndex={0}
                onClick={() => appendChild({ start: "", end: "" })}
                type="button"
                data-testid={"add-availability-button"}
              >
                <PlusIcon />
              </Button>
              {showDropdown && (
                <AssistantAvailabilityDropdown
                  id={"assistant-availability-dropdown"}
                  data-testid={"assistant-availability-dropdown"}
                >
                  <FocusScope autoFocus restoreFocus contain>
                    <b>{t(`common.copyTo`)}:</b>
                    <AssistantAvailabilityList>
                      {copyFields.map((_, dayIndex) => (
                        <AssistantAvailabilityListItem key={dayIndex}>
                          <label
                            id={`copy-to-${dayIndex}-label`}
                            data-testid={`copy-to-${dayIndex}-label`}
                            htmlFor={`copy-to-${dayIndex}-input`}
                          >
                            {t(`common.daysOfWeek.${getDayName(dayIndex)}`)}
                          </label>
                          <Input
                            id={`copy-to-${dayIndex}-input`}
                            data-testid={`copy-to-${dayIndex}-input`}
                            {...registerCopyForm(`copyTo.${dayIndex}.copy`)}
                            type="checkbox"
                          />
                        </AssistantAvailabilityListItem>
                      ))}
                      <FormSummary>
                        <Button
                          size="sm"
                          tabIndex={0}
                          type="submit"
                          data-testid={"submit-copy-availability-button"}
                          onClick={($event) => {
                            submit();
                            $event.preventDefault();
                            $event.stopPropagation();
                          }}
                        >
                          {t("common.submit")}
                        </Button>
                      </FormSummary>
                    </AssistantAvailabilityList>
                  </FocusScope>
                </AssistantAvailabilityDropdown>
              )}
            </TimeslotActions>
          )}
        </TimeslotFieldWrapper>
      ))}
    </Timeslot>
  );
});

type AssistantFormProps = {
  assistantId?: string;
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

  const form = useForm<AssistantFormValues>({
    values: {
      ...props.values,
    },
    resolver: validateResolver(assistantFormSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = form;
  const { fields } = useFieldArray({
    control,
    name: "availability",
  });

  const modalClose = () => {
    setShowModal(false);
  };

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
    <FormProvider {...form}>
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
              placeholder={t("assistants.detail.firstName")}
              disabled={props.assistantId !== undefined}
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
              placeholder={t("assistants.detail.lastName")}
              disabled={props.assistantId !== undefined}
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
              placeholder={t("assistants.detail.email")}
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
                {t("assistants.form.errors.categoriesError")}
              </FieldError>
            )}
          </Field>
        </Fieldset>

        <Label id={"availability-label"} htmlFor="availability-input">
          {t("assistants.detail.availability")}
        </Label>
        <AvailabilityContainer>
          <TimeslotsContainer>
            {fields.map((field) => (
              <AvailabilityField
                key={field.dayOfWeek}
                fieldIndex={field.dayOfWeek}
              />
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
    </FormProvider>
  );
});
