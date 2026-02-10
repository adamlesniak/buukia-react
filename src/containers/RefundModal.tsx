import getSymbolFromCurrency from "currency-symbol-map";
import { FocusScope } from "react-aria";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Button } from "@/components/Button";
import {
  Field,
  FieldError,
  Form,
  Input,
  Label,
  Select,
  TextArea,
} from "@/components/Form";
import { Modal, Overlay } from "@/components/Modal";
import type { CreateRefundBody } from "@/types";
import { centsToFixed, priceToCents } from "@/utils";
import { refundFormSchema, validateResolver } from "@/validators";
import { StripeRefundReason, type StripeCharge } from "scripts/mocksStripe";

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

type RefundModalProps = {
  title: string;
  close: (confirm: boolean) => void;
  type: "primary" | "danger";
  confirmText: string;
  charge: StripeCharge;
  error: Error | null;
  onSubmit: (data: CreateRefundBody) => void;
};

type RefundModalFormValues = {
  amount: string;
  reason: string;
  description: string;
};

export default function RefundModal(props: RefundModalProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RefundModalFormValues>({
    values: {
      amount: centsToFixed(props.charge.amount) || "0",
      description: "",
      reason: "",
    },
    resolver: validateResolver(refundFormSchema),
  });

  const onSubmit = (data: RefundModalFormValues) => {
    const body: CreateRefundBody = {
      amount: Math.round(priceToCents(Number(data.amount))),
      charge: props.charge.id,
      reason: data.reason as StripeRefundReason,
      payment_intent: null,
      metadata: {
        description: data.description,
      },
    };

    props.onSubmit(body);
  };

  return (
    <Overlay onClick={() => props.close(false)}>
      <Modal
        onClick={($event) => {
          $event.stopPropagation();
        }}
        $variant="center"
        data-testid="refund-modal"
      >
        <FocusScope autoFocus restoreFocus contain>
          <RefundContent>
            <h2>{props.title}</h2>
            <TextContainer data-testid="refund-modal-description">
              {t("transactions.payments.modal.refundDescription")}
            </TextContainer>
            <Form
              fullHeight={true}
              data-testid="refund-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Field>
                <Label id={"refund-amount-label"} htmlFor="refund-amount-input">
                  {t("transactions.payments.modal.amount")}
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
                      id="refund-amount-input"
                      type="text"
                      data-testid="refund-amount-input"
                      placeholder={t("common.loading")}
                    >
                      {props.charge
                        ? getSymbolFromCurrency(props.charge.currency)
                        : ""}
                    </Input>
                  )}
                />
                {errors.amount && (
                  <FieldError role="alert">
                    {t("transactions.payments.modal.form.errors.amountError")}
                  </FieldError>
                )}
              </Field>

              <Field>
                <Label id={"refund-reason-label"} htmlFor="refund-reason-input">
                  {t("transactions.payments.modal.reason")}
                </Label>
                <Select
                  {...register("reason")}
                  id="refund-reason-input"
                  data-testid="refund-reason-input"
                >
                  <option value="" disabled selected hidden>
                    {t("common.selectAnItem")}
                  </option>
                  {Object.values(StripeRefundReason).map((reason) => (
                    <option key={reason} value={reason}>
                      {t(`transactions.payments.modal.reasonOptions.${reason}`)}
                    </option>
                  ))}
                </Select>
                {errors.reason && (
                  <FieldError role="alert">
                    {t("transactions.payments.modal.form.errors.reasonError")}
                  </FieldError>
                )}
              </Field>

              <Field>
                <Label
                  id={"refund-description-label"}
                  htmlFor="refund-description-input"
                >
                  {t("transactions.payments.modal.description")}
                </Label>
                <TextArea
                  {...register("description")}
                  id="refund-description-input"
                  data-testid="refund-description-input"
                  placeholder={t("transactions.payments.modal.description")}
                />
                {errors.description && (
                  <FieldError role="alert">
                    {t(
                      "transactions.payments.modal.form.errors.descriptionError",
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
                  data-testid="confirm-refund-button"
                  variant={props.type === "primary" ? "accent" : "danger"}
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
