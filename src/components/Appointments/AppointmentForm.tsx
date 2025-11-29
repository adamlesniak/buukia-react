import { faker } from "@faker-js/faker";
import { useForm } from "react-hook-form";

import { Button } from "../Button";
import { Combobox } from "../Form/Combobox";
import { Field } from "../Form/Field";
import { Form } from "../Form/Form";
import { Input } from "../Form/Input";
import { Label } from "../Form/Label";

type AppointmentFormValues = {
  assistantName: string;
  clientName: string;
  serviceName: string;
  time: string;
};

type AppointmentFormProps = {
  values: AppointmentFormValues;
  onSubmit: (data: AppointmentFormValues) => void;
};

export function AppointmentForm(props: AppointmentFormProps) {
  const { register, handleSubmit } = useForm<AppointmentFormValues>({
    defaultValues: {
      ...props.values,
    },
  });

  const onSubmit = (data: AppointmentFormValues) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Field>
        <Label id={"assistant-name-label"} htmlFor="assistant-name-input">
          Assistant Name
        </Label>
        <Input
          {...register("assistantName", { required: true })}
          id="assistant-name-input"
          type="text"
          disabled
        />
      </Field>

      <Field>
        <Label id={"time-input-label"} htmlFor="time-input">
          Time
        </Label>
        <Input
          {...register("time", { required: true })}
          id="time-input"
          name="time"
          type="text"
          disabled
        />
      </Field>

      <Field>
        <Label id={"client-name-label"} htmlFor="client-name-input">
          Client
        </Label>
        <Combobox
          {...register("clientName", { required: true })}
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
        <Label htmlFor="service-input">Service</Label>
        <Button size="sm" tabIndex={0} type="submit">
          Add service
        </Button>
      </Field>

      <Button size="sm" tabIndex={0} type="submit">
        Save Appointment
      </Button>
    </Form>
  );
}
