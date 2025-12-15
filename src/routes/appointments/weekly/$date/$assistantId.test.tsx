import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  addDays,
  addHours,
  addMinutes,
  differenceInDays,
  differenceInHours,
  format,
} from "date-fns";

import { useAppointments, useAssistant } from "@/api";
import type { BuukiaAppointment } from "@/types";
import { createAssistant, createClient, createService } from "@/utils";

import data from "../../../../routes/data.json";

// Mock the API hooks
vi.mock("@/api", () => ({
  useAppointments: vi.fn(),
  useAssistant: vi.fn(),
}));

// Mock TanStack Router
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  createFileRoute: (_path: string) => (options: unknown) => ({
    useParams: mockUseParams,
    options,
  }),
  Outlet: () => <div data-testid="outlet" />,
  lazyRouteComponent: vi.fn(),
}));

// Create test data
const mockAssistant = createAssistant(data.assistants[0]);
const mockAppointments: BuukiaAppointment[] = [
  {
    id: "appointmentId",
    time: "2025-12-15T10:00:00.000Z",
    assistant: mockAssistant,
    client: createClient(data.clients[0]),
    services: [createService(data.services[0])],
  },
];

const mockUseAssistant = useAssistant as unknown as ReturnType<typeof vi.fn>;
const mockUseAppointments = useAppointments as unknown as ReturnType<
  typeof vi.fn
>;

// Import the component after mocking
const { RouteComponent } = await import("./$assistantId");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const user = userEvent.setup();

describe("weekly/$date/$assistantId", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockNavigate.mockClear();

    // Mock route params
    mockUseParams.mockReturnValue({
      assistantId: mockAssistant.id,
      date: String(new Date("2025-12-14").getTime()),
    });

    // Default mock implementations
    mockUseAssistant.mockReturnValue({
      data: mockAssistant,
      error: null,
      isLoading: false,
    });

    mockUseAppointments.mockReturnValue({
      data: mockAppointments,
      error: null,
      isLoading: false,
    });
  });

  describe("Calendar Header", () => {
    it("should render the header", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      expect(await screen.findByTestId("calendar-header")).toBeInTheDocument();
    });

    it("should render the header with dates", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      expect(await screen.findByText("December 2025")).toBeInTheDocument();
      expect(await screen.findByText("Dec 14, 2025")).toBeInTheDocument();
    });

    it("should render the header with weekly title", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      expect(
        await screen.findByText("calendar.teamWeekView"),
      ).toBeInTheDocument();
    });

    it("should render two functional buttons that act as next and previous", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      const previousButton = await screen.findByLabelText(
        "calendar.previousWeek",
      );
      const nextButton = await screen.findByLabelText("calendar.nextWeek");

      await user.click(previousButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/appointments/weekly/1765062000000/3b5d8fda-f136-4696-b91d-4d3f28d4a9f9/",
      });

      await user.click(nextButton);

      expect(previousButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/appointments/weekly/1766271600000/3b5d8fda-f136-4696-b91d-4d3f28d4a9f9/",
      });
    });

    it("should render two functional button that toggles between day and week", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      const toggleButton = await screen.findByLabelText(
        "calendar.toggleViewDay",
      );

      await user.click(toggleButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/appointments/daily/1765753200000/",
      });
    });
  });

  describe("Calendar Body", () => {
    it("should render the calendar body", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      expect(await screen.findByTestId("calendar-body")).toBeInTheDocument();
    });

    it("should render column with time", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      const [startDate, endDate] = [
        addMinutes(addHours(new Date("2025-12-15"), 8), 0),
        addMinutes(addHours(new Date("2025-12-15"), 21), 0),
      ];

      const hoursDiff = differenceInHours(endDate, startDate);

      for (let i = 0; i < hoursDiff; i++) {
        await screen.findByText(`${String(i + 8).padStart(2, "0")}:00`);
      }
    });

    it("should render upcoming week days", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      const [startDate, endDate] = [
        addMinutes(addHours(new Date("2025-12-14"), 8), 0),
        addDays(addMinutes(addHours(new Date("2025-12-14"), 21), 0), 7),
      ];

      const daysDiff = differenceInDays(endDate, startDate);

      for (let i = 0; i < daysDiff; i++) {
        await screen.findByText(format(addDays(startDate, i), "EEE"));
      }
    });

    it("should ensure that each column has 4 rows per hour for 15-minute intervals", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      const slots = (
        await screen.findByTestId("date-2025-12-14")
      ).querySelectorAll("div");

      const [startDate, endDate] = [
        addMinutes(addHours(new Date("2025-12-14"), 8), 0),
        addMinutes(addHours(new Date("2025-12-14"), 21), 0),
      ];

      const hoursDiff = differenceInHours(endDate, startDate) * 4;

      expect(hoursDiff).toEqual(slots.length - 2); // 13 hours * 4 slots per hour
    });

    it("should render available appointments", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      for (const appointment of mockAppointments) {
        const appointmentElement = await screen.findByText(
          appointment.client.name,
        );
        expect(appointmentElement).toBeInTheDocument();
      }
    });

    describe("interactions", () => {
      it("should navigate to new appointment page on empty slot click", async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <RouteComponent />
          </QueryClientProvider>,
        );

        const emptySlot = (
          await screen.findByTestId("date-2025-12-16")
        ).querySelectorAll("div")[2]; // First slot of the day

        await user.click(emptySlot!);

        expect(mockNavigate).toHaveBeenCalledWith({
          to: `/appointments/weekly/1765666800000/${mockAssistant.id}/new/1765868400000/`,
        });
      });

      it("should redirect to appointment page on appoitment click", async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <RouteComponent />
          </QueryClientProvider>,
        );

        const appointmentElement = await screen.findByText(
          mockAppointments[0].client.name,
        );

        await user.click(appointmentElement);

        expect(mockNavigate).toHaveBeenCalledWith({
          to: `/appointments/weekly/1765666800000/${mockAssistant.id}/appointmentId/`,
        });
      });
    });
  });
});
