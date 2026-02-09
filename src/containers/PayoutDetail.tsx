import { useNavigate, useParams } from "@tanstack/react-router";
import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import {
  useCreatePayout,
  usePayout,
  usePayoutsStats,
  useCancelPayout,
  useBankAccounts,
} from "@/api";
import { TransactionChip } from "@/components/Chip";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  MemoizedDrawerHeader,
} from "@/components/Drawer";
import { ErrorDetail } from "@/components/Error";
import { PayoutForm } from "@/components/Payouts";
import { PayoutSummary } from "@/components/Payouts/PayoutSummary";
import { MAX_PAGINATION, SETTINGS } from "@/constants";
import type { BuukiaPayout, CreatePayoutBody, PayoutFormValues } from "@/types";
import { centsToFixed, PayoutStatus } from "@/utils";

import { DetailNavigationTitleContent } from "./AssistantDrawer";

const PayoutTitleContainer = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`;

export default function PayoutDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [createPayout, cancelPayout] = [useCreatePayout(), useCancelPayout()];

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
  } = isNew
    ? {
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
      }
    : usePayout(payoutId);
  const {
    data: payoutStats,
    isLoading: payoutStatsLoading,
    error: payoutStatsError,
  } = usePayoutsStats();
  const {
    data: bankAccountsData,
    isLoading: bankAccountsLoading,
    error: bankAccountsError,
  } = useBankAccounts({
    limit: MAX_PAGINATION,
    query: "",
    customerId: "current-customer",
  });

  const formValues: PayoutFormValues = useMemo(
    () => ({
      amount: centsToFixed(payout?.amount || 0),
      description: payout?.description || "",
      bankAccountId: bankAccountsData?.data?.[0]?.id || "",
      method: "instant",
    }),
    [payout?.id, bankAccountsData?.data],
  );

  const isError = payoutError || bankAccountsError || payoutStatsError;
  const isLoading = payoutLoading || bankAccountsLoading || payoutStatsLoading;

  const onCancelPayout = useCallback(
    (confirm: boolean) => {
      if (!payoutId) {
        return;
      }

      if (confirm) {
        cancelPayout.mutate(payoutId, {
          onSuccess: () => {
            onClose();
          },
        });
      }
    },
    [payoutId, cancelPayout],
  );

  const onClose = () => {
    navigate({ to: `/transactions/payouts` });
  };

  return (
    <Drawer onOverlayClick={onClose} drawer="right">
      <DrawerContent>
        <MemoizedDrawerHeader onClose={onClose} label={t("common.closeDrawer")}>
          <DetailNavigationTitleContent>
            <PayoutTitleContainer>
              <h2 style={{ marginRight: "12px" }}>
                {!isNew && payout
                  ? `${getSymbolFromCurrency(payout?.currency)}${centsToFixed(payout?.amount || 0)}`
                  : t("transactions.payouts.detail.title")}
              </h2>
              {!isNew && payout?.status && (
                <TransactionChip
                  data-testid="summary-item-title-status"
                  status={payout.status}
                >
                  {t(`common.status.${payout.status}`)}
                </TransactionChip>
              )}
            </PayoutTitleContainer>
            {payout?.status === PayoutStatus.Completed &&
              payout.arrivalDate && (
                <small>
                  {[
                    t("transactions.payouts.completedAt"),
                    format(new Date(payout.arrivalDate), "PPPp"),
                  ].join(" ")}
                </small>
              )}
            {payout?.status !== PayoutStatus.Completed && payout?.createdAt && (
              <small>
                {[
                  t("transactions.payouts.createdAt"),
                  format(new Date(payout.createdAt), "PPPp"),
                ].join(" ")}
              </small>
            )}
          </DetailNavigationTitleContent>
        </MemoizedDrawerHeader>
        <DrawerContentBody justifyContent={"start"}>
          {isError && (
            <ErrorDetail
              message={isError?.message || t("common.unknownError")}
            />
          )}
          {!isError && isNew && (
            <>
              <PayoutForm
                values={formValues}
                onSubmit={submit}
                isLoading={isLoading}
                maxValue={payoutStats?.totalAmount}
                bankAccounts={bankAccountsData?.data || []}
              />
            </>
          )}
          {!isError && !isNew && payout && (
            <>
              <PayoutSummary cancelPayout={onCancelPayout} payout={payout} />
            </>
          )}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
