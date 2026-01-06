import { memo } from "react";

import { CardBody } from ".";

export type CardDescriptionProps = {
  title: string;
  description?: string;
  price?: string;
};

export const CardDescription = memo(
  (props: CardDescriptionProps) => (
    <CardBody>
      <h3>{props.title}</h3>
      {props.description && <p>{props.description}</p>}
      {props.price && <b>{props.price}</b>}
    </CardBody>
  ),
);
