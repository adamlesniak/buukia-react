import { TrashIcon } from "lucide-react";
import { memo } from "react";
import { FocusScope } from "react-aria";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";
import { Card, ServiceCardDescription } from "@/components/Card";
import { MemoizedDrawerHeaderH3 } from "@/components/Drawer";
import { Field, FieldError, Form, Input } from "@/components/Form";
import { Modal, ModalBody, Overlay } from "@/components/Modal";
import type { CreateCategoryBody, NewCategoryFormValues } from "@/types";
import { categoryFormSchema, validateResolver } from "@/validators";

type ManageCategoriesFormModalProps = {
  categories: { id: string; name: string }[];
  deleteCategory: (categoryId: string) => void;
  onSubmit: (data: CreateCategoryBody) => void;
  close: () => void;
};

export const ManageCategoriesFormModal = memo(
  (props: ManageCategoriesFormModalProps) => {
    const { t } = useTranslation();

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<NewCategoryFormValues>({
      values: {
        name: "",
      },
      resolver: validateResolver(categoryFormSchema),
    });

    return (
      <Overlay onClick={() => props.close()}>
        <Modal
          onClick={($event) => {
            $event.stopPropagation();
          }}
          data-testid="services-modal"
        >
          <FocusScope autoFocus restoreFocus contain>
            <MemoizedDrawerHeaderH3
              title={t("services.manageCategories")}
              onClose={props.close}
              label={t("common.closeModal")}
            />

            <Form
              fullHeight={true}
              data-testid="add-category-form"
              onSubmit={handleSubmit(props.onSubmit)}
            >
              <Field>
                <div
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "0px",
                    width: "100%",
                    display: "flex",
                  }}
                >
                  <Input
                    {...register("name")}
                    id="category-name-input"
                    type="text"
                    data-testid="category-name-input"
                    placeholder={t("services.testCategory")}
                    style={{ flex: 4, borderRadius: "12px 0px 0px 12px" }}
                  />

                  <Button
                    size="sm"
                    tabIndex={0}
                    type="submit"
                    style={{
                      flex: 1,
                      height: "37px",
                      borderRadius: "0px 12px 12px 0px",
                    }}
                  >
                    {t("services.addCategory")}
                  </Button>
                </div>
                {errors.name && (
                  <FieldError role="alert">
                    {t("common.requiredField")}
                  </FieldError>
                )}
              </Field>

              <ModalBody tabIndex={-1} data-testid="create-category-modal">
                {props.categories &&
                  props.categories.length > 0 &&
                  props.categories.map((category) => (
                    <Card data-testid="category-list-item" key={category.id}>
                      <ServiceCardDescription title={`${category.name}`} />
                      <Button
                        size="sm"
                        tabIndex={0}
                        onClick={() => props.deleteCategory(category.id)}
                        type="button"
                      >
                        <TrashIcon />
                      </Button>
                    </Card>
                  ))}
              </ModalBody>
            </Form>
          </FocusScope>
        </Modal>
      </Overlay>
    );
  },
);
