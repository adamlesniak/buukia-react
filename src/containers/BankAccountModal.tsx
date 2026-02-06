import { FocusScope } from "react-aria";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Button } from "@/components/Button";
import {
  Field,
  FieldError,
  Form,
  IBANInput,
  Input,
  Label,
  Select,
} from "@/components/Form";
import { Modal, Overlay } from "@/components/Modal";
import { SETTINGS } from "@/constants";
import type { CreateStripeBankAccountBody } from "@/types";
import { bankAccountFormSchema, validateResolver } from "@/validators";
import {
  StripeAccountHolderType,
} from "scripts/mocksStripe";

const ActionsButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-direction: row;

  button {
    flex: 1;
  }
`;

const TextContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;

  p {
    margin: 8px 0px;
  }
`;

const RefundContent = styled.div`
  text-align: left;
  h2 {
    margin: 0px;
  }
`;

type BankAccountModalProps = {
  title: string;
  close: (confirm: boolean) => void;
  description: string;
  confirmText: string;
  error: Error | null;
  onSubmit: (data: CreateStripeBankAccountBody) => void;
};

type BankAccountModalFormValues = {
  accountNumber: string;
  country: string;
  currency: string;
  accountHolderName: string;
  accountHolderType: string;
  routingNumber: string;
};

export default function BankAccountModal(props: BankAccountModalProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    // setValue,
    // control,
    formState: { errors },
  } = useForm<BankAccountModalFormValues>({
    values: {
      accountNumber: "",
      country: "",
      currency: "",
      accountHolderName: "",
      accountHolderType: "",
      routingNumber: "",
    },
    resolver: validateResolver(bankAccountFormSchema),
  });

  const onSubmit = (data: BankAccountModalFormValues) => {
    const body: CreateStripeBankAccountBody = {
      source: {
        account_number: data.accountNumber,
        country: SETTINGS.country,
        currency: SETTINGS.currency,
        object: "bank_account",
        account_holder_name: data.accountHolderName,
        account_holder_type: data.accountHolderType as StripeAccountHolderType,
        routing_number: data.routingNumber,
      },
    };
    console.log("body", body);
    props.onSubmit(body);
  };

  return (
    <Overlay onClick={() => props.close(false)}>
      <Modal
        onClick={($event) => {
          $event.stopPropagation();
        }}
        $variant="center"
        data-testid="bank-account-modal"
      >
        <FocusScope autoFocus restoreFocus contain>
          <RefundContent>
            <h2>{props.title}</h2>
            <TextContainer data-testid="bank-account-modal-description">
              {t("transactions.payments.modal.refundDescription")}{" "}
              <a
                style={{ marginTop: "8px" }}
                href="https://support.stripe.com/questions/add-a-bank-account-for-payouts"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("transactions.payouts.bankAccount.learnMore")}
              </a>
            </TextContainer>
            <Form
              fullHeight={true}
              data-testid="bank-account-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Field>
                <Label
                  id={"account-number-label"}
                  htmlFor="account-number-input"
                >
                  {t("transactions.payouts.bankAccount.form.accountNumber")}
                </Label>
                <IBANInput
                  {...register("accountNumber")}
                  id="account-number-input"
                  type="text"
                  data-testid="account-number-input"
                  placeholder={t(
                    "transactions.payouts.bankAccount.form.accountNumber",
                  )}
                />
                {errors.accountNumber && (
                  <FieldError role="alert">
                    {t(
                      "transactions.payouts.bankAccount.form.errors.accountNumberError",
                    )}
                  </FieldError>
                )}
              </Field>

              <Field>
                <Label
                  id={"account-holder-name-label"}
                  htmlFor="account-holder-name-input"
                >
                  {t("transactions.payouts.bankAccount.form.accountHolderName")}
                </Label>
                <Input
                  {...register("accountHolderName")}
                  id="account-holder-name-input"
                  type="text"
                  data-testid="account-holder-name-input"
                  placeholder={t(
                    "transactions.payouts.bankAccount.form.accountHolderName",
                  )}
                />
                {errors.accountHolderName && (
                  <FieldError role="alert">
                    {t(
                      "transactions.payouts.bankAccount.form.errors.accountHolderNameError",
                    )}
                  </FieldError>
                )}
              </Field>

              <Field>
                <Label
                  id={"account-holder-type-label"}
                  htmlFor="account-holder-type-input"
                >
                  {t("transactions.payouts.bankAccount.form.accountHolderType")}
                </Label>
                <Select
                  {...register("accountHolderType")}
                  id="account-holder-type-input"
                  data-testid="account-holder-type-input"
                >
                  <option value="" disabled selected hidden>
                    {t("common.selectAnItem")}
                  </option>
                  {Object.values(StripeAccountHolderType).map((type) => (
                    <option key={type} value={type}>
                      {t(
                        `transactions.payouts.bankAccount.form.accountHolderTypeOptions.${type}`,
                      )}
                    </option>
                  ))}
                </Select>
                {errors.accountHolderType && (
                  <FieldError role="alert">
                    {t(
                      "transactions.payouts.bankAccount.form.errors.accountHolderTypeError",
                    )}
                  </FieldError>
                )}
              </Field>

              <ActionsButtons>
                <Button
                  type="button"
                  onClick={($event) => {
                    props.close(false);
                    $event.preventDefault();
                    $event.stopPropagation();
                    return;
                  }}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  data-testid="confirm-bank-account-button"
                  variant={"primary"}
                >
                  {props.confirmText}
                </Button>
              </ActionsButtons>
            </Form>
          </RefundContent>
        </FocusScope>
      </Modal>
    </Overlay>
  );
}
