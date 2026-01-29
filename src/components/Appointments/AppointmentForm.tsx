import debounce from "debounce";
import { LoaderCircle, Search } from "lucide-react";
import { useState, useMemo, memo, useCallback } from "react";
import { FocusScope } from "react-aria";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { DetailNavigationTitleContent } from "@/containers/AssistantDrawer";
import {
  type BuukiaAppointment,
  type BuukiaClient,
  type BuukiaService,
  type CreateAppointmentBody,
} from "@/types";
import { appointmentFormSchema, validateResolver } from "@/validators";

import { Button } from "../Button";
import { MemoizedDrawerHeader } from "../Drawer";
import { Field, FieldError, Form, Input, Label } from "../Form";
import { SearchInput } from "../Form/SearchInput";
import { Overlay, Modal, ModalBody } from "../Modal";
import { ServicesContainer } from "../Services";
import { MemoizedServiceCard } from "../Services/MemoizedServiceCard";

import { MemoizedAppointmentFormFields } from "./MemoizedAppointmentFormFields";
import { MemoizedAppointmentFormSummary } from "./MemoizedAppointmentFormSummary";

type AppointmentFormValues = {
  assistantName: string;
  client: BuukiaClient[];
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
  clientsRefetching: boolean;
  servicesRefetching: boolean;
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
    control,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: validateResolver(appointmentFormSchema),
    values: {
      ...props.values,
    },
  });

  const servicesChangeDebounce = debounce(
    (value: string) => props.onServicesSearch?.(value),
    1000,
  );

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
      () =>
        currentServices.reduce((sum, next) => sum + parseInt(next.duration), 0),
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

  const modalClose = useCallback(() => {
    props.onServicesSearch("");
    setShowModal(false);
  }, [props.appointmentId]);

  const onSubmit = (data: AppointmentFormValues) => {
    const body: CreateAppointmentBody = {
      assistantId: props.assistantId,
      clientId: data.client.length > 0 ? data.client[0].id : "",
      time: new Date(data.time).toISOString(),
      serviceIds: data.services.map((service) => service.id),
    };

    props.onSubmit(body);
  };

  return (
    <>
      <Form
        fullHeight={true}
        data-testid="appointment-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <MemoizedAppointmentFormFields
            control={control}
            register={register}
            errors={errors}
            clients={props.clients}
            isLoading={props.isLoading}
            clientsSearch={props.onClientsSearch}
            clientsLoading={props.clientsRefetching}
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
              disabled={props.servicesRefetching}
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

        <MemoizedAppointmentFormSummary
          disabled={props.isLoading}
          servicesDurationSum={servicesDurationSum}
          servicesPriceSum={servicesPriceSum}
        />
      </Form>
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
                <MemoizedDrawerHeader
                  onClose={modalClose}
                  label={t("common.closeModal")}
                >
                  <DetailNavigationTitleContent>
                    <h3>{t("appointments.detail.services")}</h3>
                  </DetailNavigationTitleContent>
                </MemoizedDrawerHeader>
                <SearchInput data-testid="search" style={{ marginBottom: 8 }}>
                  {props.servicesRefetching ? (
                    <LoaderCircle size={20} />
                  ) : (
                    <Search size={20} />
                  )}
                  <Input
                    type="text"
                    id={"services-search-input"}
                    aria-autocomplete="none"
                    aria-label={t("common.search")}
                    autoComplete="off"
                    tabIndex={0}
                    onChange={($event) => {
                      servicesChangeDebounce($event.target.value);
                      $event.preventDefault();
                      $event.stopPropagation();
                    }}
                  />
                </SearchInput>
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
                  {props.services.length === 0 && !props.servicesRefetching && (
                    <p>{t("services.noServicesFound")}</p>
                  )}
                </ModalBody>
              </FocusScope>
            </Modal>
          </Overlay>,
          document.body,
        )}
    </>
  );
});
