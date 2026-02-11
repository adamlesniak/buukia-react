import getSymbolFromCurrency from "currency-symbol-map";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { SETTINGS } from "@/constants";
import { centsToFixed } from "@/utils";

import { Button } from "../Button";
import { FormSummary, FormSummaryItem } from "../Form";

export type MemoizedAppointmentFormSummaryProps = {
  servicesDurationSum: number;
  servicesPriceSum: number;
  disabled: boolean;
};

export const MemoizedAppointmentFormSummary = memo(
  (props: MemoizedAppointmentFormSummaryProps) => {
    const { t } = useTranslation();
    return (
      <FormSummary>
        <FormSummaryItem data-testid="form-duration">
          <span>{t("appointments.detail.totalDuration")}</span>
          <b>
            {props.servicesDurationSum} {t("common.min")}
          </b>
        </FormSummaryItem>
        <FormSummaryItem data-testid="form-price">
          <span>{t("appointments.detail.totalPrice")}</span>
          <b>
            {[
              getSymbolFromCurrency(SETTINGS.currency),
              centsToFixed(props.servicesPriceSum),
            ].join("")}
          </b>
        </FormSummaryItem>
        <Button disabled={props.disabled} size="sm" tabIndex={0} type="submit">
          {t("common.submit")}
        </Button>
      </FormSummary>
    );
  },
);
