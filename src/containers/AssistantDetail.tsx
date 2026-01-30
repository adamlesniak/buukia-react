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
import { ErrorDetail } from "@/components/Error/ErrorDetail";
import { MAX_PAGINATION } from "@/constants";
import type {
  BuukiaAssistant,
  CreateAssistantBody,
  UpdateAssistantBody,
  AssistantFormValues,
  CreateCategoryBody,
} from "@/types";

import AssistantDrawer from "./AssistantDrawer";

// TODO: Add Manage section to provide options to performance, statistics, etc.
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
          holidays: "",
        } as BuukiaAssistant,
        isLoading: false,
        error: undefined,
      }
    : useAssistant(assistantId);

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
          {
            ...data,
            holidays: assistant?.holidays || "",
            id: assistantId,
          } as UpdateAssistantBody,
          {
            onSuccess: () => {
              onClose();
            },
          },
        );
      }

      return createCategory.mutate(data as CreateCategoryBody);
    },
    [assistantId, createAssistant, updateAssistant, createCategory, onClose, assistant],
  );

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
    <AssistantDrawer>
      {isError && (
        <ErrorDetail message={isError?.message || t("common.unknownError")} />
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
    </AssistantDrawer>
  );
}
