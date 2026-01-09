import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { addHours, addMinutes, differenceInHours } from "date-fns";

import { useAppointments, useAssistants } from "@/api";
import type { BuukiaAppointment, BuukiaAssistant } from "@/types";
import { createAssistant, createClient, createService } from "@/utils";

import data from "../routes/data.json";

// Mock the API hooks
vi.mock("@/api", () => ({
  useAppointments: vi.fn(),
  useAssistants: vi.fn(),
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
  lazy: vi.fn(),
}));
vi.mock("i18next", () => ({
  t: (value: string) => value,
}));

// Create test data
const mockAssistants: BuukiaAssistant[] = [
  createAssistant(data.assistants[0]),
  createAssistant(data.assistants[1]),
  createAssistant(data.assistants[2]),
  createAssistant(data.assistants[3]),
];
const mockAppointments: BuukiaAppointment[] = [
  {
    id: "appointmentId",
    time: "2025-12-14T10:00:00.000Z",
    assistant: mockAssistants[0],
    client: createClient(data.clients[0]),
    services: [createService(data.services[0])],
  },
];

const mockUseAssistants = useAssistants as unknown as ReturnType<typeof vi.fn>;
const mockUseAppointments = useAppointments as unknown as ReturnType<
  typeof vi.fn
>;

// Import the component after mocking
const CalendarDaily = await import("./CalendarDaily");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const user = userEvent.setup();

describe("CalendarDaily", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockNavigate.mockClear();

    // Mock route params
    mockUseParams.mockReturnValue({
      date: String(new Date("2025-12-14").getTime()),
    });

    // Default mock implementations
    mockUseAssistants.mockReturnValue({
      data: mockAssistants,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    mockUseAppointments.mockReturnValue({
      data: mockAppointments,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  describe("Calendar Header", () => {
    it("should render the header", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CalendarDaily.default />
        </QueryClientProvider>,
      );

      expect(await screen.findByTestId("calendar-header")).toBeInTheDocument();
    });

    it("should render the header with dates", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CalendarDaily.default />
        </QueryClientProvider>,
      );

      expect(await screen.findByText("December 2025")).toBeInTheDocument();
      expect(await screen.findByText("Dec 14, 2025")).toBeInTheDocument();
    });

    it("should render the header with daily title", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CalendarDaily.default />
        </QueryClientProvider>,
      );

      expect(
        await screen.findByText("calendar.teamDayView"),
      ).toBeInTheDocument();
    });

    it("should render two functional buttons that act as next and previous", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CalendarDaily.default />
        </QueryClientProvider>,
      );

      const previousButton = await screen.findByLabelText(
        "calendar.previousDay",
      );
      const nextButton = await screen.findByLabelText("calendar.nextDay");

      await user.click(previousButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/appointments/daily/1765584000000/",
      });

      await user.click(nextButton);

      expect(previousButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/appointments/daily/1765756800000/",
      });
    });
  });

  describe("Calendar Body", () => {
    it("should render error in case of error", async () => {
      mockUseAppointments.mockReturnValue({
        data: mockAppointments,
        error: new Error("test Error"),
        isLoading: false,
        refetch: vi.fn(),
      });

      render(
        <QueryClientProvider client={queryClient}>
          <CalendarDaily.default />
        </QueryClientProvider>,
      );

      expect(
        await screen.findByText("common.unknownError"),
      ).toBeInTheDocument();
    });

    it("should render the calendar body", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CalendarDaily.default />
        </QueryClientProvider>,
      );

      expect(await screen.findByTestId("calendar-body")).toBeInTheDocument();
    });

    it("should render column with time", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CalendarDaily.default />
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

    it("should render assistants as header", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CalendarDaily.default />
        </QueryClientProvider>,
      );

      for (const assistant of mockAssistants) {
        await screen.findByText(assistant.initials);
      }
    });

    it("should ensure that each column has 4 rows per hour for 15-minute intervals", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CalendarDaily.default />
        </QueryClientProvider>,
      );

      const slots = (
        await screen.findByTestId(mockAssistants[0].id)
      ).querySelectorAll("[data-testid='appointment-slot']");

      const [startDate, endDate] = [
        addMinutes(addHours(new Date("2025-12-14"), 8), 0),
        addMinutes(addHours(new Date("2025-12-14"), 21), 0),
      ];

      const hoursDiff = differenceInHours(endDate, startDate) * 4;

      expect(hoursDiff).toEqual(slots.length); // 13 hours * 4 slots per hour
    });

    it("should render available appointments", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CalendarDaily.default />
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
            <CalendarDaily.default />
          </QueryClientProvider>,
        );

        const emptySlot = (
          await screen.findByTestId(`${mockAssistants[0].id}`)
        ).querySelectorAll("div")[2]; // First slot of the day

        await user.click(emptySlot!);

        expect(mockNavigate).toHaveBeenCalledWith({
          to: `/appointments/daily/1765670400000/new/${mockAssistants[0].id}/1765699200000/`,
        });
      });

      it("should redirect to appointment page on appointment click", async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <CalendarDaily.default />
          </QueryClientProvider>,
        );

        const appointmentElement = await screen.findByText(
          mockAppointments[0].client.name,
        );

        await user.click(appointmentElement);

        expect(mockNavigate).toHaveBeenCalledWith({
          to: `/appointments/daily/1765670400000/appointmentId/`,
        });
      });
    });
  });
});
