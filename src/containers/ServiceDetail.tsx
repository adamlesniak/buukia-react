import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import {
  useCreateService,
  useService,
  useUpdateService,
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useDeleteService,
} from "@/api";
import { Button } from "@/components/Button";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  MemoizedDrawerHeader,
} from "@/components/Drawer";
import { ErrorDetail } from "@/components/Error";
import { ServiceForm } from "@/components/Services/ServiceForm";
import { MAX_PAGINATION } from "@/constants";
import type {
  BuukiaService,
  CreateCategoryBody,
  CreateServiceBody,
  ServiceFormValues,
  UpdateServiceBody,
} from "@/types";
import { centsToFixed } from "@/utils";

import { DetailNavigationTitleContent } from "./AssistantDrawer";
import ConfirmationModal from "./ConfirmationModal";

export default function ServiceDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [categoriesQuery, setCategoriesQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [
    createService,
    updateService,
    deleteService,
    createCategory,
    deleteCategory,
  ] = [
    useCreateService(),
    useUpdateService(),
    useDeleteService(),
    useCreateCategory(),
    useDeleteCategory(),
  ];

  const {
    serviceId,
  }: {
    serviceId: string;
  } = useParams({
    strict: false,
  });
  const isNew = !serviceId;

  const submit = useCallback(
    async (data: CreateServiceBody | CreateCategoryBody) => {
      if ("category" in data) {
        if (isNew) {
          return createService.mutate(data as CreateServiceBody, {
            onSuccess: () => {
              onClose();
            },
          });
        }

        return updateService.mutate(
          { ...data, id: serviceId } as UpdateServiceBody,
          {
            onSuccess: () => {
              onClose();
            },
          },
        );
      }

      return createCategory.mutate(data as CreateCategoryBody);
    },
    [serviceId],
  );

  const {
    data: categories = [],
    error: categoriesError,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
    isRefetching: categoriesIsRefetching,
  } = useCategories({ limit: MAX_PAGINATION, query: "" });
  const {
    data: service,
    isLoading: serviceLoading,
    error: serviceError,
  } = isNew
    ? {
        data: {
          business: "",
          category: null as any,
          description: "",
          duration: "",
          id: "",
          name: "",
          price: 0,
        } as BuukiaService,
        isLoading: false,
        error: undefined,
      }
    : useService(serviceId);

  const formValues: ServiceFormValues = useMemo(
    () => ({
      category: service?.category ? [service?.category] : [],
      description: service?.description || "",
      duration: service?.duration.toString() || "",
      price: centsToFixed(service?.price || 0),
      name: service?.name || "",
    }),
    [service?.id],
  );

  useEffect(() => {
    if (categoriesQuery !== "") {
      refetchCategories();
    }
  }, [categoriesQuery]);

  const isError = serviceError || categoriesError;
  const isLoading = serviceLoading || categoriesLoading;

  const onClose = () => {
    navigate({ to: `/services` });
  };

  const modalClose = (deleteConfirmed: boolean) => {
    if (deleteConfirmed) {
      deleteService.mutate(serviceId);
    }

    setShowModal(false);
    onClose();
  };

  return (
    <Drawer onOverlayClick={onClose} drawer="right">
      <DrawerContent>
        <MemoizedDrawerHeader onClose={onClose} label={t("common.closeDrawer")}>
          <DetailNavigationTitleContent>
            <h2>{t("services.service")}</h2>
          </DetailNavigationTitleContent>
        </MemoizedDrawerHeader>
        <DrawerContentBody justifyContent={"start"}>
          {isError && (
            <ErrorDetail
              message={isError?.message || t("common.unknownError")}
            />
          )}
          {!isError && (
            <>
              <ServiceForm
                categories={categories}
                onCategorySearch={(query) => setCategoriesQuery(query)}
                categoriesIsLoading={categoriesIsRefetching}
                values={formValues}
                onSubmit={submit}
                isLoading={isLoading}
                deleteCategory={(categoryId) =>
                  deleteCategory.mutate(categoryId)
                }
              />
              {serviceId && (
                <Button
                  type="button"
                  variant="danger"
                  style={{ width: "100%", marginTop: "16px" }}
                  onClick={() => setShowModal(true)}
                >
                  {t("services.deleteService")}
                </Button>
              )}
            </>
          )}
          {showModal &&
            createPortal(
              <ConfirmationModal
                title={t("services.modal.deleteTitle")}
                description={t("services.modal.deleteMessage")}
                close={modalClose}
                confirmText={t("common.delete")}
                type={"danger"}
              />,
              document.body,
            )}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
