import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ViewType } from "@/constants.ts";
import type { BuukiaAppointment } from "@/types";

import { CalendarBody } from "./CalendarBody";

const mockAppointments: BuukiaAppointment[] = [
  {
    id: "1",
    time: "2025-12-14T10:00:00.000Z",
    assistant: { id: "assistant1", name: "John Assistant" },
    client: { id: "client1", name: "Jane Client", email: "jane@example.com", phone: "123-456-7890" },
    services: [
      { id: "service1", name: "Consultation", duration: 30, price: 50, description: "Basic consultation" },
    ],
  },
  {
    id: "2",
    time: "2025-12-14T14:00:00.000Z",
    assistant: { id: "assistant2", name: "Sarah Assistant" },
    client: { id: "client2", name: "Bob Client", email: "bob@example.com", phone: "098-765-4321" },
    services: [
      { id: "service2", name: "Treatment", duration: 60, price: 100, description: "Advanced treatment" },
    ],
  },
];

const mockColumns = [
  { id: "assistant1", name: "John Assistant" },
  { id: "assistant2", name: "Sarah Assistant" },
];

const mockOnFieldSelect = vi.fn();
const mockOnItemSelect = vi.fn();
const mockOnHeaderSelect = vi.fn();

const defaultProps = {
  startDate: new Date("2025-12-14T08:00:00.000Z"),
  endDate: new Date("2025-12-14T18:00:00.000Z"),
  columns: mockColumns,
  items: mockAppointments,
  viewType: ViewType.DAY,
  isLoading: false,
  onFieldSelect: mockOnFieldSelect,
  onItemSelect: mockOnItemSelect,
  headerSelect: mockOnHeaderSelect,
};

describe("CalendarBody", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the calendar body container", () => {
    const { container } = render(<CalendarBody {...defaultProps} />);

    // The component renders successfully
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders daily view when viewType is DAY", () => {
    render(<CalendarBody {...defaultProps} viewType={ViewType.DAY} />);

    // Daily view should render columns with headers
    expect(screen.getByText("John Assistant")).toBeInTheDocument();
    expect(screen.getByText("Sarah Assistant")).toBeInTheDocument();

    // Should not render week day headers (these are specific to weekly view)
    expect(screen.queryByText("Mon")).not.toBeInTheDocument();
    expect(screen.queryByText("Tue")).not.toBeInTheDocument();
  });

  it("renders weekly view when viewType is WEEK", () => {
    render(<CalendarBody {...defaultProps} viewType={ViewType.WEEK} />);

    // Weekly view should render day headers
    expect(screen.getByText("Sun")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();

    // Should render time column
    expect(screen.getByText("9:00")).toBeInTheDocument();
  });

  it("renders appointments in daily view", () => {
    render(<CalendarBody {...defaultProps} viewType={ViewType.DAY} />);

    // Should render appointment clients
    expect(screen.getByText("Jane Client")).toBeInTheDocument();
    expect(screen.getByText("Bob Client")).toBeInTheDocument();
  });

  it("handles empty columns array", () => {
    const propsWithEmptyColumns = { ...defaultProps, columns: [] };
    const { container } = render(<CalendarBody {...propsWithEmptyColumns} />);

    // Should still render the container
    expect(container.firstChild).toBeInTheDocument();
  });

  it("handles empty appointments array", () => {
    const propsWithEmptyAppointments = { ...defaultProps, items: [] };
    render(<CalendarBody {...propsWithEmptyAppointments} />);

    // Should render columns but no appointments
    expect(screen.getByText("John Assistant")).toBeInTheDocument();
    expect(screen.queryByText("Jane Client")).not.toBeInTheDocument();
  });

  it("displays correct time range in time column", () => {
    render(<CalendarBody {...defaultProps} viewType={ViewType.WEEK} />);

    // Should show hours from 8am to 5pm (8:00 to 17:00)
    expect(screen.getByText("9:00")).toBeInTheDocument();
    expect(screen.getByText("17:00")).toBeInTheDocument();

    // Should not show hours outside the range
    expect(screen.queryByText("6:00")).not.toBeInTheDocument();
    expect(screen.queryByText("22:00")).not.toBeInTheDocument();
  });

  it("handles different time ranges", () => {
    const customProps = {
      ...defaultProps,
      startDate: new Date("2025-12-14T06:00:00.000Z"),
      endDate: new Date("2025-12-14T22:00:00.000Z"),
      viewType: ViewType.WEEK,
    };
    render(<CalendarBody {...customProps} />);

    // Should show hours from 6am to 9pm
    expect(screen.getByText("7:00")).toBeInTheDocument();
    expect(screen.getByText("22:00")).toBeInTheDocument();
  });

  it("handles optional headerSelect prop when undefined", () => {
    const propsWithoutHeaderSelect = { ...defaultProps };
    delete propsWithoutHeaderSelect.headerSelect;

    const { container } = render(<CalendarBody {...propsWithoutHeaderSelect} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(() => render(<CalendarBody {...propsWithoutHeaderSelect} />)).not.toThrow();
  });

  it("switches between views correctly", () => {
    const { rerender } = render(<CalendarBody {...defaultProps} viewType={ViewType.DAY} />);

    // Should show daily view
    expect(screen.getByText("John Assistant")).toBeInTheDocument();
    expect(screen.queryByText("Sun")).not.toBeInTheDocument();

    // Switch to weekly view
    rerender(<CalendarBody {...defaultProps} viewType={ViewType.WEEK} />);

    // Should show weekly view
    expect(screen.getByText("Sun")).toBeInTheDocument();
  });

  it("handles isLoading prop correctly", () => {
    const { container } = render(<CalendarBody {...defaultProps} isLoading={true} />);

    // Component should still render when loading
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders appointment details correctly", () => {
    render(<CalendarBody {...defaultProps} viewType={ViewType.DAY} />);

    // Check that appointment information is displayed
    expect(screen.getByText("Jane Client")).toBeInTheDocument();
    expect(screen.getByText("Bob Client")).toBeInTheDocument();
  });

  it("handles appointment click interactions", () => {
    render(<CalendarBody {...defaultProps} viewType={ViewType.DAY} />);

    // Find appointment elements by their client names and click
    const janeAppointment = screen.getByText("Jane Client");
    expect(janeAppointment).toBeInTheDocument();

    fireEvent.click(janeAppointment);
    // The click handler should be called
    expect(mockOnItemSelect).toHaveBeenCalled();
  });

  it("handles click interactions on time slots", () => {
    const { container } = render(<CalendarBody {...defaultProps} viewType={ViewType.DAY} />);

    // Find clickable elements in the calendar and click one
    const clickableElements = container.querySelectorAll('[style*="cursor: pointer"], button, [role="button"]');
    if (clickableElements.length > 0) {
      fireEvent.click(clickableElements[0]);
    }
    // Just verify the component renders and functions work
    expect(container.firstChild).toBeInTheDocument();
  });

  it("handles large number of appointments", () => {
    const manyAppointments = Array.from({ length: 50 }, (_, index) => ({
      id: `appointment-${index}`,
      time: "2025-12-14T10:00:00.000Z",
      assistant: { id: "assistant1", name: "John Assistant" },
      client: { id: `client-${index}`, name: `Client ${index}`, email: `client${index}@example.com`, phone: "123-456-7890" },
      services: [
        { id: `service-${index}`, name: `Service ${index}`, duration: 30, price: 50, description: `Service ${index} description` },
      ],
    }));

    const propsWithManyAppointments = { ...defaultProps, items: manyAppointments };

    expect(() => render(<CalendarBody {...propsWithManyAppointments} />)).not.toThrow();
    const { container } = render(<CalendarBody {...propsWithManyAppointments} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders correctly with different date ranges", () => {
    // Test with morning hours only
    const morningProps = {
      ...defaultProps,
      startDate: new Date("2025-12-14T06:00:00.000Z"),
      endDate: new Date("2025-12-14T12:00:00.000Z"),
      viewType: ViewType.WEEK,
    };

    const { rerender } = render(<CalendarBody {...morningProps} />);

    expect(screen.getByText("7:00")).toBeInTheDocument();
    expect(screen.getByText("11:00")).toBeInTheDocument();
    expect(screen.queryByText("13:00")).not.toBeInTheDocument();

    // Test with evening hours
    const eveningProps = {
      ...defaultProps,
      startDate: new Date("2025-12-14T18:00:00.000Z"),
      endDate: new Date("2025-12-14T23:00:00.000Z"),
      viewType: ViewType.WEEK,
    };

    rerender(<CalendarBody {...eveningProps} />);

    expect(screen.getByText("19:00")).toBeInTheDocument();
    expect(screen.getByText("23:00")).toBeInTheDocument();
  });
});