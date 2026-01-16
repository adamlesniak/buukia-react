import { Copy, PlusIcon, TrashIcon } from "lucide-react";
import { memo } from "react";
import { FocusScope } from "react-aria";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Button } from "@/components/Button";
import { MemoizedDrawerHeaderH3 } from "@/components/Drawer";
import { Form, Input } from "@/components/Form";
import { Modal, Overlay } from "@/components/Modal";
import type { AvailabilitySlot, CreateCategoryBody, NewCategoryFormValues } from "@/types";
import { getDayName } from "@/utils";
import { categoryFormSchema, validateResolver } from "@/validators";

const Timeslot = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 6px 0px;
  width: 100%;

  h4 {
    margin: 0px;
    margin-bottom: 4px;
  }

  input {
    margin: 0px 12px 0px 12px;
  }
`;

const TimeslotActions = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const TimeslotField = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TimeslotFieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TimeslotsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: end;
`;

type ManageAvailabilityFormModalProps = {
  availability: AvailabilitySlot[];
  onSubmit: (data: CreateCategoryBody) => void;
  close: () => void;
};

export const ManageAvailabilityFormModal = memo(
  (props: ManageAvailabilityFormModalProps) => {
    const { t } = useTranslation();

    const {
      // register,
      handleSubmit,
      // formState: { errors },
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
          data-testid="manage-availability-modal"
        >
          <FocusScope autoFocus restoreFocus contain>
            <MemoizedDrawerHeaderH3
              title={t("assistants.manageAvailability")}
              onClose={props.close}
              label={t("common.closeModal")}
            />

            <Form
              fullHeight={true}
              data-testid="manage-availability-form"
              onSubmit={handleSubmit(props.onSubmit)}
            >
              <TimeslotsContainer>
                {props.availability.map((availability) => (
                  <Timeslot>
                    <h4>
                      {t(
                        `common.daysOfWeek.${getDayName(availability.dayOfWeek)}`,
                      )}
                    </h4>
                    <TimeslotFieldWrapper>
                      <TimeslotField>
                        <Input
                          type="time"
                          id="appointment"
                          name="appointment"
                          min="09:00"
                          max="18:00"
                          style={{ marginLeft: "0px" }}
                          required
                        />
                        -
                        <Input
                          type="time"
                          id="appointment"
                          name="appointment"
                          min="09:00"
                          max="18:00"
                          required
                        />
                        <Button
                          size="sm"
                          variant="transparent"
                          tabIndex={0}
                          onClick={() => {}}
                          type="button"
                        >
                          <TrashIcon />
                        </Button>
                      </TimeslotField>
                      <TimeslotActions>
                        <Button
                          size="sm"
                          variant="transparent"
                          tabIndex={0}
                          onClick={() => {}}
                          type="button"
                        >
                          <PlusIcon />
                        </Button>
                        <Button
                          size="sm"
                          variant="transparent"
                          tabIndex={0}
                          onClick={() => {}}
                          type="button"
                        >
                          <Copy />
                        </Button>
                      </TimeslotActions>
                    </TimeslotFieldWrapper>
                  </Timeslot>
                ))}
              </TimeslotsContainer>
            </Form>
          </FocusScope>
        </Modal>
      </Overlay>
    );
  },
);
