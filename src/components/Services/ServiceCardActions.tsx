import { addMinutes, isAfter } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { BuukiaAppointment, BuukiaService } from "@/types";

import { Button } from "../Button";

export type ServiceCardActionsProps = {
  serviceIds: string[];
  servicesDurationSum: number;
  service: BuukiaService;
  currentAppointment: {
    id: string;
    time: string;
  };
  appointments: BuukiaAppointment[];
  onServiceRemove: (serviceId: string) => void;
  onServiceAdd: (service: BuukiaService) => void;
};

export function ServiceCardActions(props: ServiceCardActionsProps) {
  const { t } = useTranslation();

  const isAvailable = useMemo(() => {
    const appointmentsAfter = props.appointments
      .filter(
        (appointment) =>
          new Date(appointment.time) > new Date(props.currentAppointment.time),
      )
      .filter((appointment) => {
        if (appointment.id === "current-appointment") {
          return false;
        }

        return isAfter(
          addMinutes(
            new Date(props.currentAppointment.time),
            parseInt(props.service.duration) + props.servicesDurationSum,
          ).toISOString(),
          appointment.time,
        );
      });

    return appointmentsAfter.length === 0;
  }, [props.appointments, props.service.id, props.servicesDurationSum]);

  return (
    <>
      {!props.serviceIds.includes(props.service.id) &&
        (isAvailable ? (
          <Button
            size="sm"
            tabIndex={0}
            onClick={() => {
              props.onServiceAdd(props.service);
            }}
            type="button"
          >
            <PlusIcon />
          </Button>
        ) : (
          <Button size="sm" disabled tabIndex={-1} type="button">
            {t("services.unavailable")}
          </Button>
        ))}
      {props.serviceIds.includes(props.service.id) && (
        <Button
          size="sm"
          tabIndex={0}
          onClick={() => {
            props.onServiceRemove(props.service.id);
          }}
          type="button"
        >
          <XIcon />
        </Button>
      )}
    </>
  );
}
