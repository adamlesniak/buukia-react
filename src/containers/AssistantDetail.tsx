import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useAssistant,
  useCategories,
  useCreateAssistant,
  useCreateCategory,
  useDeleteCategory,
  useUpdateAssistant,
} from "@/api";
import { AssistantForm } from "@/components/Assistants";
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  MemoizedDrawerHeaderH2,
} from "@/components/Drawer";
import { ErrorDetail } from "@/components/Error/ErrorDetail";
import { MAX_PAGINATION } from "@/constants.ts";
import type {
  BuukiaAssistant,
  CreateAssistantBody,
  UpdateAssistantBody,
  AssistantFormValues,
  CreateCategoryBody,
} from "@/types";

// TODO: Add Manage section to provide options to delete assistant, performance, temporarily, hide archive, statistics, etc.
export default function AssistantDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [categoriesQuery, setCategoriesQuery] = useState("");

  const [createAssistant, updateAssistant, createCategory, deleteCategory] = [
    useCreateAssistant(),
    useUpdateAssistant(),
    useCreateCategory(),
    useDeleteCategory(),
  ];

  const {
    assistantId,
  }: {
    assistantId: string;
  } = useParams({
    strict: false,
  });
  const isNew = !assistantId;

  const {
    data: categories = [],
    error: categoriesError,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
    isRefetching: categoriesIsRefetching,
  } = useCategories({ limit: MAX_PAGINATION, query: "" });

  const onClose = () => {
    navigate({ to: `/assistants` });
  };

  const submit = useCallback(
    async (data: CreateAssistantBody | CreateCategoryBody) => {
      if ("categories" in data) {
        if (isNew) {
          return createAssistant.mutate(data as CreateAssistantBody, {
            onSuccess: () => {
              onClose();
            },
          });
        }

        return updateAssistant.mutate(
          { ...data, id: assistantId } as UpdateAssistantBody,
          {
            onSuccess: () => {
              onClose();
            },
          },
        );
      }

      return createCategory.mutate(data as CreateCategoryBody);
    },
    [assistantId, createAssistant, updateAssistant, createCategory, onClose],
  );

  const {
    data: assistant,
    isLoading: assistantLoading,
    error: assistantError,
  } = isNew
    ? {
        data: {
          id: "",
          availability: Array.from({ length: 7 }).map((_, index) => ({
            dayOfWeek: index,
            times: [
              {
                start: "",
                end: "",
              },
            ],
          })),
          categories: [],
          email: "",
          firstName: "",
          initials: "",
          lastName: "",
          name: "",
          type: "",
        } as BuukiaAssistant,
        isLoading: false,
        error: undefined,
      }
    : useAssistant(assistantId);

  const formValues: AssistantFormValues = useMemo(
    () => ({
      availability: assistant?.availability || [],
      categories: assistant?.categories || [],
      email: assistant?.email || "",
      firstName: assistant?.firstName || "",
      lastName: assistant?.lastName || "",
    }),
    [assistantId],
  );

  useEffect(() => {
    if (categoriesQuery !== "") {
      refetchCategories();
    }
  }, [categoriesQuery]);

  const isError = assistantError || categoriesError;
  const isLoading = assistantLoading || categoriesLoading;

  return (
    <Drawer onOverlayClick={onClose} drawer="right">
      <DrawerContent>
        <MemoizedDrawerHeaderH2
          onClose={onClose}
          title={t("assistants.assistant")}
          label={t("common.closeDrawer")}
        />
        <DrawerContentBody justifyContent={"start"}>
          {isError && (
            <ErrorDetail
              message={isError?.message || t("common.unknownError")}
            />
          )}
          {!isError && (
            <AssistantForm
              assistantId={assistantId}
              categories={categories}
              values={formValues}
              isLoading={isLoading}
              onSubmit={submit}
              deleteCategory={(categoryId) => deleteCategory.mutate(categoryId)}
              categoriesIsLoading={categoriesIsRefetching}
              onCategorySearch={(query) => setCategoriesQuery(query)}
            />
          )}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
}
