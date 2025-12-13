// import { useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, memo, useCallback } from "react";
import { FocusScope } from "react-aria";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  type BuukiaAppointment,
  type BuukiaClient,
  type BuukiaService,
  type CreateAppointmentBody,
} from "@/types";
// import { createCurrentAppointment, updateExistingAppointment } from "@/utils";
import { appointmentFormSchema, validateResolver } from "@/validators";

import { Button } from "../Button";
import { Card } from "../Card";
import { MemoizedDrawerHeaderH3 } from "../Drawer";
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
import { Overlay, Modal, ModalBody } from "../Modal";
import { ServiceCardActions, ServicesContainer } from "../Services";
import { ServiceCardDescription } from "../Services/ServiceCardDescription";

type MemoizedAppointmentFormFieldsProps = {
  register: UseFormRegister<AppointmentFormValues>;
  errors: FieldErrors<AppointmentFormValues>;
  clients: BuukiaClient[];
  isLoading: boolean;
};

const MemoizedAppointmentFormFields = memo(
  (props: MemoizedAppointmentFormFieldsProps) => {
    const { t } = useTranslation();
    return (
      <Fieldset>
        <Field>
          <Label id={"assistant-name-label"} htmlFor="assistant-name-input">
            {t("appointments.detail.assistantName")}
          </Label>
          <Input
            {...props.register("assistantName")}
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
            {...props.register("time")}
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
            {...props.register("clientName")}
            id="client-name-input"
            data-testid="client-name-input"
            valueKey="name"
            items={props.clients}
            disabled={props.isLoading}
          ></Combobox>
          {props.errors.clientName && (
            <FieldError role="alert">
              {t("appointments.form.errors.clientNameError")}
            </FieldError>
          )}
        </Field>
      </Fieldset>
    );
  },
);

type MemoizedAppointmentFormSummaryProps = {
  servicesDurationSum: number;
  servicesPriceSum: number;
  disabled: boolean;
};

const MemoizedAppointmentFormSummary = memo(
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
          <b>€{props.servicesPriceSum}</b>
        </FormSummaryItem>
        <Button disabled={props.disabled} size="sm" tabIndex={0} type="submit">
          {t("common.submit")}
        </Button>
      </FormSummary>
    );
  },
);

type MemoizedServiceCardProps = {
  service: BuukiaService;
  servicesIds: string[];
  servicesDurationSum: number;
  appointmentId: string;
  time: string;
  todaysAppointments: BuukiaAppointment[];
  onServiceAdd: (service: BuukiaService) => void;
  onServiceRemove: (serviceId: string) => void;
};

const MemoizedServiceCard = memo((props: MemoizedServiceCardProps) => {
  const { t } = useTranslation();
  return (
    <Card data-testid="services-list-item" key={props.service.id}>
      <ServiceCardDescription
        title={`${props.service.name} (${props.service.duration} ${t("common.min")})`}
        description={props.service.description}
        price={`€${props.service.price}`}
      />
      <ServiceCardActions
        serviceIds={props.servicesIds}
        servicesDurationSum={props.servicesDurationSum}
        service={props.service}
        currentAppointment={{
          id: props.appointmentId,
          time: props.time,
        }}
        appointments={props.todaysAppointments}
        onServiceAdd={props.onServiceAdd}
        onServiceRemove={props.onServiceRemove}
      />
    </Card>
  );
});

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
  isLoading: boolean;
  onClientsSearch: (query: string) => void;
  onServicesSearch: (query: string) => void;
  onSubmit: (data: CreateAppointmentBody) => void;
};

export const AppointmentForm = memo((props: AppointmentFormProps) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
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

  // const queryClient = useQueryClient();
  // const isExistingAppointment = props.appointmentId && props.appointmentId.length > 0;

  // // Add opened appointment to calendar view.
  // if (!isExistingAppointment) {
  //   const setCurrentAppointment = useCallback(() => {
  //     createCurrentAppointment(
  //       queryClient,
  //       props.assistantId,
  //       getValues("clientName"),
  //       getValues("time"),
  //       servicesDurationSum,
  //     );
  //   }, [watch("clientName"), watch("services")]);

  //   setCurrentAppointment();
  // } else {
  //   const updateCachedAppointment = useCallback(() => {
  //     updateExistingAppointment(
  //       queryClient,
  //       props.appointmentId,
  //       props.assistantId,
  //       getValues("clientName"),
  //       getValues("time"),
  //       servicesDurationSum,
  //     );
  //   }, [watch("clientName"), watch("services")]);

  //   updateCachedAppointment();
  // }

  const serviceAdd = (service: BuukiaService) => {
    setValue("services", [...currentServices, service], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const serviceRemove = (serviceId: string) => {
    setValue(
      "services",
      currentServices.filter((s) => s.id !== serviceId),
      {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      },
    );
  };

  const modalClose = useCallback(
    () => setShowModal(false),
    [props.appointmentId],
  );

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
      <div>
        <MemoizedAppointmentFormFields
          register={register}
          errors={errors}
          clients={props.clients}
          isLoading={props.isLoading}
        />

        <Field>
          <Label>{t("appointments.detail.service")}</Label>
          <Button
            size="sm"
            tabIndex={0}
            onClick={() => {
              setShowModal((showModal) => !showModal);
            }}
            type="button"
            disabled={props.isLoading}
          >
            {t("appointments.detail.addService")}
          </Button>
          <hr />
        </Field>
      </div>

      <ServicesContainer>
        {errors.services && (
          <FieldError $textAlign="center" role="alert">
            {t(`${errors.services.message}`)}
          </FieldError>
        )}
        {currentServices.map((service) => (
          <MemoizedServiceCard
            key={service.id}
            service={service}
            servicesIds={servicesIds}
            servicesDurationSum={servicesDurationSum}
            appointmentId={props.appointmentId}
            time={getValues("time")}
            todaysAppointments={props.todaysAppointments}
            onServiceAdd={serviceAdd}
            onServiceRemove={serviceRemove}
          />
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
                <MemoizedDrawerHeaderH3
                  title={t("appointments.detail.services")}
                  onClose={modalClose}
                />
                <ModalBody tabIndex={-1} data-testid="services-list">
                  {props.services.map((service) => (
                    <MemoizedServiceCard
                      key={service.id}
                      service={service}
                      servicesIds={servicesIds}
                      servicesDurationSum={servicesDurationSum}
                      appointmentId={props.appointmentId}
                      time={getValues("time")}
                      todaysAppointments={props.todaysAppointments}
                      onServiceAdd={serviceAdd}
                      onServiceRemove={serviceRemove}
                    />
                  ))}
                </ModalBody>
              </FocusScope>
            </Modal>
          </Overlay>,
          document.body,
        )}

      <MemoizedAppointmentFormSummary
        disabled={props.isLoading}
        servicesDurationSum={servicesDurationSum}
        servicesPriceSum={servicesPriceSum}
      />
    </Form>
  );
});
