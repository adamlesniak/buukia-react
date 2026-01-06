import { memo } from "react";

import type {
  BuukiaAppointment,
  BuukiaService,
} from "@/types";

import { Card, CardDescription } from "../Card";

import { ServiceCardActions } from ".";

export type MemoizedServiceCardProps = {
  service: BuukiaService;
  servicesIds: string[];
  servicesDurationSum: number;
  appointmentId: string;
  time: string;
  todaysAppointments: BuukiaAppointment[];
  onServiceAdd: (service: BuukiaService) => void;
  onServiceRemove: (serviceId: string) => void;
};

export const MemoizedServiceCard = memo((props: MemoizedServiceCardProps) => {
  return (
    <Card data-testid="services-list-item" key={props.service.id}>
      <CardDescription
        title={`${props.service.name} (${props.service.duration} min)`}
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