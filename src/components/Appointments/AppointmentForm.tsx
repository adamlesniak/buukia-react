import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { FocusScope } from "react-aria";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useServices } from "@/api/services";
import {
  type BuukiaAppointment,
  type BuukiaClient,
  type BuukiaService,
  type CreateAppointmentBody,
} from "@/types";
import { createCurrentAppointment, updateExistingAppointment } from "@/utils";
import { appointmentFormSchema, validateResolver } from "@/validators";

import { Button } from "../Button";
import { Card, CardBody } from "../Card";
import {
  Combobox,
  Field,
  FieldError,
  Form,
  Input,
  Label,
  FormSummary,
  FormSummaryItem,
  Fieldset,
} from "../Form";
import { Overlay, Modal, ModalBody, ModalHeader } from "../Modal";
import { ServiceCardActions, ServicesContainer } from "../Services";

type AppointmentFormValues = {
  assistantName: string;
  clientName: string;
  time: string;
  services: BuukiaService[];
};

type AppointmentFormProps = {
  values: AppointmentFormValues;
  appointmentId: string;
  assistantId: string;
  services: BuukiaService[];
  clients: BuukiaClient[];
  todaysAppointments: BuukiaAppointment[];
  onClientsSearch: (query: string) => void;
  onServicesSearch: (query: string) => void;
  onSubmit: (data: CreateAppointmentBody) => void;
};

export function AppointmentForm(props: AppointmentFormProps) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: validateResolver(appointmentFormSchema),
    defaultValues: {
      ...props.values,
    },
  });
  const { data: services = [] } = useServices();
  const isExistingAppointment = props.appointmentId;

  const currentServices = watch("services") || [];
  const [servicesIds, servicesPriceSum, servicesDurationSum] = [
    useMemo(
      () => currentServices.map((service) => service.id),
      [currentServices],
    ),
    useMemo(
      () => currentServices.reduce((sum, next) => sum + next.price, 0),
      [currentServices],
    ),
    useMemo(
      () => currentServices.reduce((sum, next) => sum + next.duration, 0),
      [currentServices],
    ),
  ];

  // Add opened appointment to calendar view.
  if (!isExistingAppointment) {
    const setCurrentAppointment = useCallback(() => {
      createCurrentAppointment(
        queryClient,
        props.assistantId,
        getValues("clientName"),
        getValues("time"),
        servicesDurationSum,
      );
    }, [watch("clientName"), watch("services")]);

    setCurrentAppointment();
  } else {
    const updateCachedAppointment = useCallback(() => {
      updateExistingAppointment(
        queryClient,
        props.appointmentId,
        props.assistantId,
        getValues("clientName"),
        getValues("time"),
        servicesDurationSum,
      );
    }, [watch("clientName"), watch("services")]);

    updateCachedAppointment();
  }

  const onSubmit = (data: AppointmentFormValues) => {
    const client = props.clients.find(
      (client) => client.name === data.clientName,
    );

    if (!client) {
      // Handle error - show message to user
      console.error("Client not found");
      return;
    }

    const body: CreateAppointmentBody = {
      assistantId: props.assistantId,
      clientId: client.id,
      time: new Date(data.time).toISOString(),
      serviceIds: data.services.map((service) => service.id),
    };

    props.onSubmit(body);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <Field>
          <Label id={"assistant-name-label"} htmlFor="assistant-name-input">
            {t("appointments.detail.assistantName")}
          </Label>
          <Input
            {...register("assistantName")}
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
            {...register("time")}
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
            {...register("clientName")}
            id="client-name-input"
            data-testid="client-name-input"
            valueKey="name"
            items={props.clients}
          ></Combobox>
          {errors.clientName && (
            <FieldError role="alert">
              {t("appointments.form.errors.clientNameError")}
            </FieldError>
          )}
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
        {errors.services && (
          <FieldError $textAlign="center" role="alert">
            {t(`${errors.services.message}`)}
          </FieldError>
        )}
        {currentServices.map((service) => (
          <Card data-testid="services-container-list-item" key={service.id}>
            <CardBody>
              <h3>
                {service.name} ({service.duration}
                {t("common.min")})
              </h3>
              <p>{service.description}</p>
              <b>€{service.price}</b>
            </CardBody>
            <ServiceCardActions
              serviceIds={servicesIds}
              servicesDurationSum={servicesDurationSum}
              service={service}
              appointments={props.todaysAppointments}
              currentAppointment={{
                id: props.appointmentId,
                time: getValues("time"),
              }}
              onServiceAdd={(service) => {
                setValue("services", [...currentServices, service], {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              onServiceRemove={(serviceId) => {
                setValue(
                  "services",
                  currentServices.filter((s) => s.id !== serviceId),
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  },
                );
              }}
            />
          </Card>
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
              <FocusScope autoFocus restoreFocus contain>
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
                <ModalBody tabIndex={-1} data-testid="services-list">
                  {services.map((service) => (
                    <Card data-testid="services-list-item" key={service.id}>
                      <CardBody>
                        <h3>
                          {service.name} ({service.duration}
                          {t("common.min")})
                        </h3>
                        <p>{service.description}</p>
                        <b>€{service.price}</b>
                      </CardBody>
                      <ServiceCardActions
                        serviceIds={servicesIds}
                        servicesDurationSum={servicesDurationSum}
                        service={service}
                        currentAppointment={{
                          id: props.appointmentId,
                          time: getValues("time"),
                        }}
                        appointments={props.todaysAppointments}
                        onServiceAdd={(service) => {
                          setValue("services", [...currentServices, service], {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        }}
                        onServiceRemove={(serviceId) => {
                          setValue(
                            "services",
                            currentServices.filter((s) => s.id !== serviceId),
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            },
                          );
                        }}
                      />
                    </Card>
                  ))}
                </ModalBody>
              </FocusScope>
            </Modal>
          </Overlay>,
          document.body,
        )}

      <FormSummary>
        <FormSummaryItem data-testid="form-duration">
          <span>{t("appointments.detail.totalDuration")}</span>
          <b>
            {servicesDurationSum} {t("common.min")}
          </b>
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
