import { memo } from "react";

import { CardBody } from ".";

export type ServiceCardDescriptionProps = {
  title: string;
  description?: string;
  price?: string;
};

export const ServiceCardDescription = memo(
  (props: ServiceCardDescriptionProps) => (
    <CardBody>
      <h3>{props.title}</h3>
      {props.description && <p>{props.description}</p>}
      {props.price && <b>{props.price}</b>}
    </CardBody>
  ),
);
