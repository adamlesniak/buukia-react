import { useForm } from "react-hook-form";

import { Button } from "../Button";
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

  return (
    <Form onSubmit={handleSubmit(props.onSubmit)}>
      <Field>
        <Label htmlFor="assistant-name-input">Assistant Name</Label>
        <Input
          {...register("assistantName", { required: true })}
          id="assistant-name-input"
          name="assistant-name"
          type="text"
          disabled
        />
      </Field>

      <Field>
        <Label htmlFor="time-input">Time</Label>
        <Input
          {...register("time", { required: true })}
          id="time-input"
          name="time"
          type="text"
          disabled
        />
      </Field>

      <Field>
        <Label htmlFor="client-name-input">Client</Label>
        <Input
          {...register("clientName", { required: true })}
          id="client-name-input"
          name="clientName"
          type="text"
        />
      </Field>

      <Field>
        <Label htmlFor="service-input">Service</Label>
        <Button size="sm" type="submit">
          Add service
        </Button>
      </Field>
    </Form>
  );
}
