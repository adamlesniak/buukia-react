import { CircleUserRound } from "lucide-react";
import { memo } from "react";

import {
  AppointmentItem,
  AppointmentItemClient,
  AppointmentSlot,
} from "./styled";

export type MemoizedAppointmentSlotProps = {
  time: Date;
  assistantId: string;
  appointmentId?: string;
  appointmentClient?: string;
  appointmentDuration?: number;
  isLoading?: boolean;
  onFieldSelect?: (data: { assistantId: string; time: string }) => void;
  onItemSelect?: (value: { id: string }) => void;
};

export const MemoizedAppointmentSlot = memo(
  (props: MemoizedAppointmentSlotProps) => {
    const appointmentHeight = (props.appointmentDuration ?? 0) / 15;

    return (
      <AppointmentSlot
        data-testid={"appointment-slot"}
        $isLoading={props.isLoading}
        onClick={($event) => {
          if (props.isLoading) {
            $event.preventDefault();
            $event.stopPropagation();
            return;
          }

          if (props.onFieldSelect) {
            props.onFieldSelect({
              time: props.time.toISOString(),
              assistantId: props.assistantId,
            });
          }
          $event.preventDefault();
          $event.stopPropagation();
        }}
      >
        {props.appointmentId && (
          <AppointmentItem
            key={props.appointmentId}
            style={{
              height: appointmentHeight * 100 + "%",
              paddingBottom: appointmentHeight - 1 + "px",
            }}
            onClick={($event) => {
              if (props.onItemSelect) {
                props.onItemSelect({
                  id: props.appointmentId as string,
                });
              }
              $event.preventDefault();
              $event.stopPropagation();
            }}
          >
            <AppointmentItemClient>
              <CircleUserRound size={16} />
              <span>{`${props.appointmentClient}`}</span>
            </AppointmentItemClient>
          </AppointmentItem>
        )}
      </AppointmentSlot>
    );
  },
);
