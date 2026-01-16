import { memo } from "react";
import {
  type UseFormRegister,
  type FieldErrors,
  Controller,
  type Control,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { AppointmentFormValues, BuukiaClient } from "@/types";

import { Combobox, Field, FieldError, Input, Label, Fieldset } from "../Form";

export type MemoizedAppointmentFormFieldsProps = {
  control: Control<AppointmentFormValues, unknown, unknown>;
  register: UseFormRegister<AppointmentFormValues>;
  errors: FieldErrors<AppointmentFormValues>;
  clients: BuukiaClient[];
  clientsSearch: (query: string) => void;
  clientsLoading: boolean;
  isLoading: boolean;
};

export const MemoizedAppointmentFormFields = memo(
  (props: MemoizedAppointmentFormFieldsProps) => {
    const { t } = useTranslation();
    return (
      <Fieldset>
        <Field>
          <Label id={"assistant-name-label"} htmlFor="assistant-name-input">
            {t("appointments.detail.assistantName")}
          </Label>
          <Input
            {...props.register("assistantName")}
            id="assistant-name-input"
            type="text"
            data-testid="assistant-name-input"
            placeholder={t("common.loading")}
            disabled
          />
        </Field>

        <Field>
          <Label id={"time-input-label"} htmlFor="time-input">
            {t("appointments.detail.time")}
          </Label>
          <Input
            {...props.register("time")}
            id="time-input"
            name="time"
            type="text"
            data-testid="time-input"
            disabled
          />
        </Field>

        <Field>
          <Label id={"client-name-label"} htmlFor="client-name-input">
            {t("appointments.detail.client")}
          </Label>
          <Controller
            name="client"
            control={props.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Combobox
                {...props.register("client")}
                id="client-name-input"
                data-testid="client-name-input"
                valueKey="id"
                displayKey="name"
                items={props.clients}
                disabled={false}
                loading={props.clientsLoading}
                search={true}
                multiselect={false}
                onChange={(e) => onChange(JSON.parse(e.target.value))}
                onBlur={onBlur}
                value={value ? value : []}
              />
            )}
          />
          {props.errors.client && (
            <FieldError role="alert">
              {t("appointments.form.errors.clientNameError")}
            </FieldError>
          )}
        </Field>
      </Fieldset>
    );
  },
);
