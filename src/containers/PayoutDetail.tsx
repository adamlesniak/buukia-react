import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useCreatePayout, usePayout, usePayoutsStats } from "@/api";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  MemoizedDrawerHeaderH2,
} from "@/components/Drawer";
import { ErrorDetail } from "@/components/Error";
import { PayoutForm } from "@/components/Payouts";
import { SETTINGS } from "@/constants";
import type { BuukiaPayout, CreatePayoutBody, PayoutFormValues } from "@/types";
import { centsToFixed } from "@/utils";

export default function PayoutDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [createPayout] = [useCreatePayout()];

  const {
    payoutId,
  }: {
    payoutId: string;
  } = useParams({
    strict: false,
  });

  const isNew = !payoutId;

  const submit = useCallback(
    async (data: CreatePayoutBody) => {
      return createPayout.mutate(data as CreatePayoutBody, {
        onSuccess: () => {
          onClose();
        },
      });
    },
    [payoutId],
  );

  const {
    data: payout,
    isLoading: payoutLoading,
    error: payoutError,
  } = isNew ? {
          data: {
            id: "",
            amount: 0,
            currency: SETTINGS.currency,
            arrivalDate: "",
            createdAt: "",
            description: "",
            provider: SETTINGS.payouts.paymentProvider,
            sourceId: "",
            status: "pending",
            type: SETTINGS.payouts.sourceType,
          } as BuukiaPayout,
          isLoading: false,
          error: undefined,
        } : usePayout(payoutId);
  const {
    data: payoutStats,
    isLoading: payoutStatsLoading,
    error: payoutStatsError,
  } = usePayoutsStats();

  const formValues: PayoutFormValues = useMemo(
    () => ({
      amount: centsToFixed(payout?.amount || 0),
      description: payout?.description || "",
    }),
    [payout?.id],
  );

  const isError = payoutError || payoutStatsError;
  const isLoading = payoutLoading || payoutStatsLoading;

  const onClose = () => {
    navigate({ to: `/transactions/payouts` });
  };

  return (
    <Drawer onOverlayClick={onClose} drawer="right">
      <DrawerContent>
        <MemoizedDrawerHeaderH2
          onClose={onClose}
          title={t("transactions.payouts.detail.title")}
          label={t("common.closeDrawer")}
        />
        <DrawerContentBody justifyContent={"start"}>
          {isError && (
            <ErrorDetail
              message={isError?.message || t("common.unknownError")}
            />
          )}
          {!isError && (
            <>
              <PayoutForm
                values={formValues}
                onSubmit={submit}
                isLoading={isLoading}
                maxValue={payoutStats?.totalAmount}
                isNew={isNew}
              />
            </>
          )}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
