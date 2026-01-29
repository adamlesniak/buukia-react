import { useNavigate, useParams } from "@tanstack/react-router";
// import { useState } from "react";
// import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { usePayment } from "@/api";
// import { Button } from "@/components/Button";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  MemoizedDrawerHeader,
} from "@/components/Drawer";
import { ErrorDetail } from "@/components/Error/ErrorDetail";

// import ConfirmationModal from "./ConfirmationModal";
import { DetailNavigationTitleContent } from "./AssistantDrawer";
import PaymentPreview from "./PaymentPreview";

// TODO: Add Manage section to provide options to performance, statistics, etc.
export default function PaymentDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    paymentId,
  }: {
    paymentId: string;
  } = useParams({
    strict: false,
  });

  // const [showModal, setShowModal] = useState(false);

  const onClose = () => {
    navigate({ to: `/transactions/payments` });
  };

  const {
    data: payment,
    // isLoading: paymentLoading,
    error: paymentError,
  } = usePayment(paymentId);

  // const modalClose = (deleteConfirmed: boolean) => {
  //   setShowModal(false);
  //   onClose();
  // };

  const isError = paymentError;
  // const isLoading = paymentLoading;

  return (
    <Drawer onOverlayClick={onClose} drawer="right">
      <DrawerContent>
        <MemoizedDrawerHeader onClose={onClose} label={t("common.closeDrawer")}>
          <DetailNavigationTitleContent>
            <h2>{t("transactions.payments.detail.title")}</h2>
          </DetailNavigationTitleContent>
        </MemoizedDrawerHeader>
        <DrawerContentBody justifyContent={"start"}>
          {isError && (
            <ErrorDetail
              message={isError?.message || t("common.unknownError")}
            />
          )}
          {!isError && <PaymentPreview payment={payment} />}
          {/* {paymentId && (
            <Button
              type="button"
              variant="accent"
              style={{ width: "100%", marginTop: "16px" }}
              onClick={() => setShowModal(true)}
            >
              {t("transactions.payments.refund")}
            </Button>
          )} */}
          {/* {showModal &&
            createPortal(
              <ConfirmationModal
                title={t("transactions.payments.modal.refundTitle")}
                description={t("transactions.payments.modal.refundMessage")}
                close={modalClose}
                type={"primary"}
                confirmText={t("transactions.payments.refund")}
              />,
              document.body,
            )} */}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
