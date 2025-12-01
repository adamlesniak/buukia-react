import { faker } from "@faker-js/faker";
import { PlusIcon, X, XIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useServices } from "@/api/services";

import { Button } from "../Button";
import { Combobox, Field, Form, Input, Label } from "../Form";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #f4f4f4;
  margin-bottom: 16px;
`;

const ModalBody = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const Item = styled.div`
  padding: 10px;
  border: 1px solid #f4f4f4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  margin: 12px 0px;
  margin-top: 0px;
`;

const ItemBody = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 24px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0px;
  }
`;

const ServicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  flex: 1;
`;

const Fieldset = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const FormSummary = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  justify-content: end;
  border-top: 1px solid #f4f4f4;
`;

const FormSummaryItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 8px 0px;
`;

interface IService {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

type AppointmentFormValues = {
  assistantName: string;
  clientName: string;
  time: string;
  services: IService[];
};

type AppointmentFormProps = {
  values: AppointmentFormValues;
  onSubmit: (data: AppointmentFormValues) => void;
};

export function AppointmentForm(props: AppointmentFormProps) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, setValue, watch } =
    useForm<AppointmentFormValues>({
      defaultValues: {
        ...props.values,
      },
    });

  const { data: services = [] } = useServices();

  // const [addAppointmentService, removeAppointmentService] = [
  //   (service: IService) => {
  //     setServices([service, ...services]);
  //   },
  //   (service: IService) => {
  //     setServices(services.filter((item) => item.id !== service.id));
  //   },
  // ];

  const currentServices = watch("services") || [];
  const [servicesIds, servicesPriceSum, servicesDurationSum] = [
    useMemo(
      () => currentServices.map((service) => service.id),
      [currentServices],
    ),
    useMemo(
      () =>
        currentServices.reduce((sum, next) => {
          sum = sum + next.price;
          return sum;
        }, 0),
      [currentServices],
    ),
    useMemo(
      () =>
        currentServices.reduce((sum, next) => {
          sum = sum + next.duration;
          return sum;
        }, 0),
      [currentServices],
    ),
  ];

  const onSubmit = (data: AppointmentFormValues) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <Field>
          <Label id={"assistant-name-label"} htmlFor="assistant-name-input">
            {t("appointments.detail.assistantName")}
          </Label>
          <Input
            {...register("assistantName", { required: true })}
            id="assistant-name-input"
            type="text"
            data-testid="assistant-name-input"
            disabled
          />
        </Field>

        <Field>
          <Label id={"time-input-label"} htmlFor="time-input">
            {t("appointments.detail.time")}
          </Label>
          <Input
            {...register("time", { required: true })}
            id="time-input"
            name="time"
            type="text"
            data-testid="time-input"
            disabled
          />
        </Field>

        <Field>
          <Label id={"client-name-label"} htmlFor="client-name-input">
            {t("appointments.detail.client")}
          </Label>
          <Combobox
            {...register("clientName", { required: true, value: "test" })}
            id="client-name-input"
            data-testid="client-name-input"
            items={Array.from({ length: 5 }).map((_) => {
              const value = faker.person.fullName();
              const item = {
                id: faker.string.uuid(),
                name: value,
                value: value,
              };

              return item;
            })}
          ></Combobox>
        </Field>

        <Field>
          <Label>{t("appointments.detail.service")}</Label>
          <Button
            size="sm"
            tabIndex={0}
            onClick={() => {
              setShowModal((showModal) => !showModal);
            }}
            type="button"
          >
            {t("appointments.detail.addService")}
          </Button>

          <hr />
        </Field>
      </Fieldset>

      <ServicesContainer>
        {currentServices.map((service) => (
          <Item data-testid="services-container-list-item" key={service.id}>
            <ItemBody>
              <h3>
                {service.name} ({service.duration}{t("common.min")})
              </h3>
              <p>{service.description}</p>
              <b>€{service.price}</b>
            </ItemBody>

            <Button
              size="sm"
              tabIndex={0}
              onClick={() => {
                setValue(
                  "services",
                  currentServices.filter((s) => s.id !== service.id),
                );
              }}
              type="button"
            >
              <XIcon />
            </Button>
          </Item>
        ))}
      </ServicesContainer>

      {showModal &&
        createPortal(
          <Overlay onClick={() => setShowModal(false)}>
            <Modal
              onClick={($event) => {
                $event.stopPropagation();
                $event.preventDefault();
              }}
              data-testid="services-modal"
            >
              <ModalHeader>
                <h3>{t("appointments.detail.services")}</h3>
                <Button
                  variant="transparent"
                  onClick={() => setShowModal(false)}
                  aria-label={t("common.closeModal")}
                  tabIndex={0}
                  type="button"
                >
                  <X />
                </Button>
              </ModalHeader>
              <ModalBody data-testid="services-list">
                {services.map((service) => (
                  <Item data-testid="services-list-item" key={service.id}>
                    <ItemBody>
                      <h3>
                        {service.name} ({service.duration}min)
                      </h3>
                      <p>{service.description}</p>
                      <b>€{service.price}</b>
                    </ItemBody>
                    {!servicesIds.includes(service.id) && (
                      <Button
                        size="sm"
                        tabIndex={0}
                        onClick={() => {
                          setValue("services", [...currentServices, service]);
                        }}
                        type="button"
                      >
                        <PlusIcon />
                      </Button>
                    )}
                    {servicesIds.includes(service.id) && (
                      <Button
                        size="sm"
                        tabIndex={0}
                        onClick={() => {
                          setValue(
                            "services",
                            currentServices.filter((s) => s.id !== service.id),
                          );
                        }}
                        type="button"
                      >
                        <XIcon />
                      </Button>
                    )}
                  </Item>
                ))}
              </ModalBody>
            </Modal>
          </Overlay>,
          document.body,
        )}

      <FormSummary>
        <FormSummaryItem data-testid="form-duration">
          <span>{t("appointments.detail.totalDuration")}</span>
          <b>{servicesDurationSum} {t("common.min")}</b>
        </FormSummaryItem>
        <FormSummaryItem data-testid="form-price">
          <span>{t("appointments.detail.totalPrice")}</span>
          <b>€{servicesPriceSum}</b>
        </FormSummaryItem>
        <Button size="sm" tabIndex={0} type="submit">
          {t("common.submit")}
        </Button>
      </FormSummary>
    </Form>
  );
}
