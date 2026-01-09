import { memo } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { AppointmentFormValues, BuukiaClient } from "@/types";

import { Combobox, Field, FieldError, Input, Label, Fieldset } from "../Form";

export type MemoizedAppointmentFormFieldsProps = {
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
          <Combobox
            {...props.register("clientName")}
            id="client-name-input"
            data-testid="client-name-input"
            valueKey="name"
            items={props.clients}
            disabled={props.clientsLoading}
            onSearchChange={props.clientsSearch}
            loading={props.clientsLoading}
            search={true}
          ></Combobox>
          {props.errors.clientName && (
            <FieldError role="alert">
              {t("appointments.form.errors.clientNameError")}
            </FieldError>
          )}
        </Field>
      </Fieldset>
    );
  },
);
