import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useCreateService,
  useService,
  useUpdateService,
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/api";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  MemoizedDrawerHeaderH2,
} from "@/components/Drawer";
import { ErrorDetail } from "@/components/Error";
import { ServiceForm } from "@/components/Services/ServiceForm";
import { MAX_PAGINATION } from "@/constants.ts";
import type {
  BuukiaService,
  CreateCategoryBody,
  CreateServiceBody,
  ServiceFormValues,
  UpdateServiceBody,
} from "@/types";

export default function ServiceDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [categoriesQuery, setCategoriesQuery] = useState("");
  const [createService, updateService, createCategory, deleteCategory] = [
    useCreateService(),
    useUpdateService(),
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
      price: service?.price || 0,
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

  return (
    <Drawer onOverlayClick={onClose} drawer="right">
      <DrawerContent>
        <MemoizedDrawerHeaderH2
          onClose={onClose}
          title={t("services.service")}
          label={t("common.closeDrawer")}
        />
        <DrawerContentBody justifyContent={"start"}>
          {isError && (
            <ErrorDetail
              message={isError?.message || t("common.unknownError")}
            />
          )}
          {!isError && (
            <ServiceForm
              serviceId={service?.id || ""}
              categories={categories}
              onCategorySearch={(query) => setCategoriesQuery(query)}
              categoriesIsLoading={categoriesIsRefetching}
              values={formValues}
              onSubmit={submit}
              isLoading={isLoading}
              deleteCategory={(categoryId) => deleteCategory.mutate(categoryId)}
            />
          )}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
