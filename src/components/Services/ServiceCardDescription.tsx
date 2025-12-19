import { memo } from "react";

import { CardBody } from "../Card";

export type ServiceCardDescriptionProps = {
  title: string;
  description: string;
  price: string;
};

export const ServiceCardDescription = memo((props: ServiceCardDescriptionProps) => (
  <CardBody>
    <h3>{props.title}</h3>
    <p>{props.description}</p>
    <b>{props.price}</b>
  </CardBody>
));
