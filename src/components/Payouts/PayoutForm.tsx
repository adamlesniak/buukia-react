import { memo, useCallback } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import z from "zod";

import type { CreatePayoutBody, PayoutFormValues } from "@/types";
import { centsToFixed, priceToCents } from "@/utils";
import { validateResolver } from "@/validators/validator";

import { Button } from "../Button";
import {
  Field,
  FieldError,
  Form,
  FormSummaryItem,
  Input,
  Label,
  TextArea,
} from "../Form";
import { LargeText } from "../Typography";

const PayoutItem = styled.div`
  margin-bottom: 16px;
`;

const PayoutTypeItem = styled.div`
  font-weight: bold;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
`;

const PayoutTypeContent = styled.div`
  flex-direction: row;
  display: flex;
`;

const PayoutTypeContentDescription = styled.div`
  h4,
  p {
    padding: 0px;
    margin: 0px;
  }
  padding: 12px;
  flex-direction: column;
  display: flex;
`;

type PayoutFormProps = {
  values: PayoutFormValues;
  maxValue?: number;
  isNew: boolean;
  isLoading: boolean;
  onSubmit: (data: CreatePayoutBody) => void;
};

export const PayoutForm = memo((props: PayoutFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Omit<PayoutFormValues, "id">>({
    resolver: validateResolver<{
      amount: string;
      description: string;
    }>(
      z.object({
        amount: z.codec(
          z.coerce
            .number()
            .min(0.5)
            .max(props.maxValue ?? 9999),
          z.string(),
          {
            decode: (data) => data.toString(),
            encode: (data) => Number(data),
          },
        ),
        description: z.string(),
      }),
    ),
    values: {
      description: props.values.description,
      amount: props.values.amount,
    },
  });

  const onSubmit = (data: PayoutFormValues) => {
    const body: CreatePayoutBody = {
      amount: priceToCents(parseFloat(data.amount)),
      description: data.description,
    };

    props.onSubmit(body);
  };

  const watchedAmount = useWatch({
    control,
    name: "amount",
  });

  const calculatePayoutFee = useCallback(
    () => Number(watchedAmount) * 0.01,
    [watchedAmount],
  );

  return (
    <>
      <Form data-testid="payout-form" onSubmit={handleSubmit(onSubmit)}>
        <PayoutItem>
          <p>Payout Type</p>
          <PayoutTypeItem>
            <PayoutTypeContent>
              <input type="radio" checked readOnly />
              <PayoutTypeContentDescription>
                <LargeText>Instant</LargeText>
                <small>
                  You can pay up to - which is transferred instantly.
                </small>
              </PayoutTypeContentDescription>
            </PayoutTypeContent>
          </PayoutTypeItem>
        </PayoutItem>

        <PayoutItem>
          <p>Payout To</p>
          <PayoutTypeItem>
            <PayoutTypeContent>
              <input type="radio" checked readOnly />
              <PayoutTypeContentDescription>
                <LargeText>TEST BANK ACCOUNT</LargeText>
                <small>**** 6789</small>
              </PayoutTypeContentDescription>
            </PayoutTypeContent>
          </PayoutTypeItem>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              marginTop: "8px",
            }}
          >
            <div>Add Bank Account</div>
          </div>
        </PayoutItem>

        <Field>
          <Label id={"payout-amount-label"} htmlFor="payout-amount-input">
            {t("transactions.payouts.detail.amount")}
          </Label>
          <Controller
            name="amount"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                onBlur={($event) => {
                  setValue(
                    "amount",
                    parseFloat($event.target.value).toFixed(2).toString(),
                  );
                }}
                onChange={($event) =>
                  onChange($event.target.value.replace(/[^0-9\.]/g, ""))
                }
                value={value}
                id="payout-amount-input"
                type="text"
                data-testid="payout-amount-input"
                placeholder={t("transactions.payouts.detail.amount")}
              >
                €
              </Input>
            )}
          />
          {errors.amount && (
            <FieldError role="alert">
              {t("transactions.payouts.form.errors.amountError", {
                minValue: 0.5,
                maxValue: centsToFixed(props.maxValue ?? 999900),
              })}
            </FieldError>
          )}
        </Field>

        <Field>
          <Label
            id={"payout-description-label"}
            htmlFor="payout-description-input"
          >
            {t("transactions.payouts.detail.description")}
          </Label>
          <TextArea
            {...register("description")}
            id="payout-description-input"
            data-testid="payout-description-input"
            placeholder={t("transactions.payouts.detail.description")}
          />
        </Field>

        <FormSummaryItem data-testid="payout-fee">
          <span>{t("transactions.payouts.detail.instantPayoutFee")}</span>
          <b>€{calculatePayoutFee().toFixed(2)}</b>
        </FormSummaryItem>

        {!props.isNew && (
          <Button
            disabled={props.isLoading}
            size="sm"
            tabIndex={0}
            type="submit"
          >
            {t("common.submit")}
          </Button>
        )}
      </Form>
    </>
  );
});
