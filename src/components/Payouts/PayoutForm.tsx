import getSymbolFromCurrency from "currency-symbol-map";
import { memo, useCallback, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import z from "zod";

import { useCreateBankAccount } from "@/api/stripe/bankAccounts";
import { SETTINGS } from "@/constants";
import BankAccountModal from "@/containers/BankAccountModal";
import type {
  CreatePayoutBody,
  CreateStripeBankAccountBody,
  PayoutFormValues,
} from "@/types";
import { centsToFixed, priceToCents } from "@/utils";
import { validateResolver } from "@/validators/validator";
import type { StripeBankAccount } from "scripts/mocksStripe";

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
  cursor: pointer;
  padding-left: 12px;
  padding-right: 12px;
`;

const PayoutTypeContent = styled.div`
  flex-direction: row;
  display: flex;

  label {
    flex: 1;
    cursor: pointer;
    padding: 12px;
  }
`;

const PayoutTypeContentDescription = styled.div`
  h4,
  p {
    padding: 0px;
    margin: 0px;
  }
  flex-direction: column;
  display: flex;
`;

type PayoutFormProps = {
  values: PayoutFormValues;
  bankAccounts: StripeBankAccount[];
  maxValue?: number;
  isLoading: boolean;
  onSubmit: (data: CreatePayoutBody) => void;
};

export const PayoutForm = memo((props: PayoutFormProps) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const createBankAccount = useCreateBankAccount();

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
      bankAccountId: string;
      method: string;
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
        bankAccountId: z.string().min(1),
        method: z.string().min(1),
      }),
    ),
    values: {
      description: props.values.description,
      amount: props.values.amount,
      bankAccountId: "",
      method: "instant",
    },
  });

  const onSubmit = (data: PayoutFormValues) => {
    const body: CreatePayoutBody = {
      amount: priceToCents(parseFloat(data.amount)),
      description: data.description,
      destination: data.bankAccountId,
      method: data.method as "instant" | "standard",
    };

    props.onSubmit(body);
  };

  const bankAccountSubmit = async (data: CreateStripeBankAccountBody) => {
    setShowModal(false);
    createBankAccount.mutate({ ...data, customer_id: "current-customer" });
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
          <p>{t("transactions.payouts.type")}</p>
          <PayoutTypeItem>
            <PayoutTypeContent>
              <input
                type="radio"
                id="instant"
                value="instant"
                {...register("method")}
              />
              <label htmlFor={"instant"}>
                <PayoutTypeContentDescription>
                  <LargeText>
                    {t("transactions.payouts.instant.title")}
                  </LargeText>
                  <small>{t("transactions.payouts.instant.description")}</small>
                </PayoutTypeContentDescription>
              </label>
            </PayoutTypeContent>
          </PayoutTypeItem>
        </PayoutItem>

        <PayoutItem>
          <p>{t("transactions.payouts.payoutTo")}</p>
          {props.bankAccounts.map((bankAccount) => (
            <PayoutTypeItem style={{ marginBottom: "8px" }}>
              <PayoutTypeContent>
                <input
                  type="radio"
                  id={bankAccount.id}
                  value={bankAccount.id}
                  {...register("bankAccountId")}
                />
                <label htmlFor={bankAccount.id}>
                  <PayoutTypeContentDescription>
                    <LargeText>{bankAccount.account_holder_name}</LargeText>
                    <small>**** {bankAccount.last4}</small>
                  </PayoutTypeContentDescription>
                </label>
              </PayoutTypeContent>
            </PayoutTypeItem>
          ))}
          {errors.bankAccountId && (
            <FieldError role="alert">
              {t("transactions.payouts.form.errors.bankAccountIdError", {
                minValue: 0.5,
                maxValue: centsToFixed(props.maxValue ?? 999900),
              })}
            </FieldError>
          )}
          <Button
            style={{ marginTop: "8px" }}
            variant="transparent"
            size="sm"
            tabIndex={0}
            type="button"
            onClick={() => setShowModal(true)}
          >
            {t("transactions.payouts.addBankAccount")}
          </Button>
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
                onChange={($event) => onChange($event.target.value.replace(/[^0-9\.]/g, ""))}
                value={value}
                id="payout-amount-input"
                type="text"
                data-testid="payout-amount-input"
                placeholder={t("transactions.payouts.detail.amount")}
              >
                {getSymbolFromCurrency(SETTINGS.currency)}
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
          <span>
            {t("transactions.payouts.detail.instantPayoutFee", {
              feeRate: "1",
            })}
          </span>
          <b>
            {getSymbolFromCurrency(SETTINGS.currency)}
            {calculatePayoutFee().toFixed(2)}
          </b>
        </FormSummaryItem>

        <Button disabled={props.isLoading} size="sm" tabIndex={0} type="submit">
          {t("common.submit")}
        </Button>
      </Form>
      {showModal && (
        <BankAccountModal
          onSubmit={bankAccountSubmit}
          error={createBankAccount.error}
          confirmText={t("common.submit")}
          description={t("transactions.payouts.bankAccount.description")}
          title={t("transactions.payouts.bankAccount.title")}
          close={setShowModal}
        />
      )}
    </>
  );
});
