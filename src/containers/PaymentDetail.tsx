import { useNavigate, useParams } from "@tanstack/react-router";
import getSymbolFromCurrency from "currency-symbol-map";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useCharge, useCreateRefund } from "@/api";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  MemoizedDrawerHeader,
} from "@/components/Drawer";
import { ErrorDetail } from "@/components/Error/ErrorDetail";
import { PaymentSummary } from "@/components/Payment";
import type { CreateRefundBody } from "@/types";
import { centsToFixed } from "@/utils";

import { DetailNavigationTitleContent } from "./AssistantDrawer";

// TODO: Add Manage section to provide options to performance, statistics, etc.
export default function PaymentDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    chargeId,
  }: {
    chargeId: string;
  } = useParams({
    strict: false,
  });

  const [createRefund] = [useCreateRefund()];

  // const [showModal, setShowModal] = useState(false);

  const onClose = () => {
    navigate({ to: `/transactions/payments` });
  };

  const {
    data: charge,
    // isLoading: paymentLoading,
    error: paymentError,
  } = useCharge(chargeId);

  const submit = useCallback(
    async (data: CreateRefundBody) =>
      createRefund.mutate(data as CreateRefundBody),
    [chargeId],
  );

  // TODO: Show 404 error.
  if (!charge) {
    navigate({ to: `/transactions/payments` });
    return;
  }

  const isError = paymentError;
  // const isLoading = paymentLoading;

  return (
    <Drawer onOverlayClick={onClose} drawer="right">
      <DrawerContent>
        <MemoizedDrawerHeader onClose={onClose} label={t("common.closeDrawer")}>
          <DetailNavigationTitleContent>
            <h2>
              {[
                getSymbolFromCurrency(charge.currency),
                centsToFixed(charge.amount),
              ].join("")}
            </h2>
            <small>
              {[t("common.by"), charge.id && charge.billing_details.email].join(
                " ",
              )}
            </small>
          </DetailNavigationTitleContent>
        </MemoizedDrawerHeader>
        <DrawerContentBody justifyContent={"space-between"} inline={true}>
          {isError && (
            <ErrorDetail
              message={isError?.message || t("common.unknownError")}
            />
          )}
          {!isError && <PaymentSummary error={createRefund.error} onSubmit={submit} charge={charge} />}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
