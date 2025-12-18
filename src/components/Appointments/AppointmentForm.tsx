// import { useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, memo, useCallback } from "react";
import { FocusScope } from "react-aria";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
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
import { MemoizedDrawerHeaderH3 } from "../Drawer";
import { Field, FieldError, Form, Label } from "../Form";
import { Overlay, Modal, ModalBody } from "../Modal";
import { ServicesContainer } from "../Services";
import { MemoizedServiceCard } from "../Services/MemoizedServiceCard";

import { MemoizedAppointmentFormFields } from "./MemoizedAppointmentFormFields";
import { MemoizedAppointmentFormSummary } from "./MemoizedAppointmentFormSummary";

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
    values: {
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
    <Form data-testid="appointment-form" onSubmit={handleSubmit(onSubmit)}>
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

      <ServicesContainer data-testid="services-container-list">
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
            data-testid="services-container-list-item"
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
                  label={t("common.closeModal")}
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
