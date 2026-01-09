import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ViewType } from "@/constants.ts";
import type { BuukiaAppointment } from "@/types";

import { CalendarBody } from "./src/components/Calendar/CalendarBody";

const mockAppointments: BuukiaAppointment[] = [
  {
    id: "1",
    time: "2025-12-14T10:00:00.000Z",
    assistant: {
      id: "assistant1",
      name: "John Assistant",
      firstName: "John",
      lastName: "Assistant",
      initials: "JA",
      business: "testBusiness",
      type: "test",
      availability: {
        regular: [],
        holidays: [],
        exceptions: [],
      },
    },
    client: {
      id: "client1",
      name: "Jane Client",
      email: "jane@example.com",
      phone: "123-456-7890",
      firstName: "testFirstName",
      lastName: "testLastName",
      appointments: [],
    },
    services: [
      {
        id: "service1",
        name: "Consultation",
        duration: "30",
        price: 50,
        description: "Basic consultation",
        business: "business1",
        category: "testCategory",
      },
    ],
  },
];

const defaultProps = {
  startDate: new Date("2025-12-14T08:00:00.000Z"),
  endDate: new Date("2025-12-14T17:00:00.000Z"),
  columns: [
    { id: "assistant1", name: "John Assistant" },
    { id: "assistant2", name: "Sarah Assistant" },
  ],
  items: mockAppointments,
  viewType: ViewType.DAY,
  isLoading: false,
  onFieldSelect: () => {},
  onItemSelect: () => {},
  headerSelect: () => {},
};

describe("CalendarBody Basic", () => {
  it("renders without crashing", () => {
    const { container } = render(<CalendarBody {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
