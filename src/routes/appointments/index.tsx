import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  startOfDay,
  addDays,
  addHours,
  addMinutes,
  subDays,
  getUnixTime,
} from "date-fns";
import { X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAssistants } from "@/api/assistants/use-assistants";
import { AppointmentDetail } from "@/components/Appointments/AppointmentDetail";
import { Button } from "@/components/Button";
import { Calendar } from "@/components/Calendar/Calendar";
import { CalendarBody } from "@/components/Calendar/CalendarBody";
import { CalendarHeader } from "@/components/Calendar/CalendarHeader";
import { DrawerContentBody } from "@/components/Drawer";
import { Drawer } from "@/components/Drawer/Drawer";
import { DrawerContent } from "@/components/Drawer/DrawerContent";
import { DrawerContentHeader } from "@/components/Drawer/DrawerContentHeader";
import { ViewType } from "@/constants.ts";

export const Route = createFileRoute("/appointments/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const [todaysDate, setTodaysDate] = useState(startOfDay(new Date()));

  const { data, error, isLoading } = useAssistants();
  const [appointmentDetail, setAppointmentDetail] = useState({
    assistantId: "",
    time: "",
  });

  const navigate = useNavigate();

  if (error) {
    return (
      <div>
        {t("common.error")}: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return <div>{t("common.loading")}</div>;
  }

  const startDate = addMinutes(addHours(todaysDate, 8), 0);
  const endDate = addMinutes(addHours(todaysDate, 21), 0);

  const handleFieldSelect = (data: { assistantId: string; time: string }) => {
    navigate({
      to: `/appointments/${data.assistantId}/${getUnixTime(new Date(data.time)).toString()}/`,
    });
  };

  const columns =
    data?.map((item) => ({
      id: item.id,
      name: item.initials,
    })) || [];

  return (
    <>
      <Calendar>
        <CalendarHeader
          previousDaySelect={(date) => setTodaysDate(subDays(date, 1))}
          nextDaySelect={(date) => setTodaysDate(addDays(date, 1))}
          date={todaysDate}
        />
        <CalendarBody
          startDate={startDate}
          endDate={endDate}
          columns={columns.slice(0, 4)}
          onFieldSelect={handleFieldSelect}
          viewType={ViewType.WEEK}
          headerSelect={(id) => navigate({ to: `/appointments/${id}/` })}
        />
      </Calendar>
      {appointmentDetail.assistantId.length > 0 && (
        <Drawer
          onOverlayClick={() =>
            setAppointmentDetail({ assistantId: "", time: "" })
          }
          drawer="right"
        >
          <DrawerContent>
            <DrawerContentHeader>
              <h2>{t("appointments.appointment")}</h2>
              <Button
                variant="transparent"
                onClick={() =>
                  setAppointmentDetail({ assistantId: "", time: "" })
                }
                aria-label={t("common.closeDrawer")}
                tabIndex={0}
                type="button"
              >
                <X />
              </Button>
            </DrawerContentHeader>
            <DrawerContentBody>
              <AppointmentDetail
                id={appointmentDetail.assistantId}
                time={appointmentDetail.time}
              />
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
