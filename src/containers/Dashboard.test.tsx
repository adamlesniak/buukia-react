import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import getSymbolFromCurrency from "currency-symbol-map";
import { format } from "date-fns";

import { useAppointments } from "@/api";
import { SETTINGS } from "@/constants";
import type { BuukiaAppointment } from "@/types";
import {
  centsToFixed,
  createAssistant,
  createClient,
  createService,
} from "@/utils";

import data from "../routes/data.json";

const user = userEvent.setup();

// Mock the API hooks
vi.mock("@/api", async () => ({
  useAppointments: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (value: string) => value }),
}));

// Mock TanStack Router
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
const mockMutate = vi.fn().mockImplementation((_data, { onSuccess }) => {
  onSuccess();
});
const mockMutateCancel = vi.fn();
const mockRouterState = vi.fn().mockReturnValue("daily");

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  createFileRoute: (_path: string) => (options: unknown) => ({
    useParams: mockUseParams,
    options,
  }),
  Outlet: () => <div data-testid="outlet" />,
  lazyRouteComponent: vi.fn(),
  useRouterState: mockRouterState,
  Link: vi.fn(),
}));

const mockAppointment: BuukiaAppointment = {
  id: "appointmentId",
  time: "2025-12-15T10:00:00.000Z",
  assistant: createAssistant(data.assistants[0]),
  client: createClient(data.clients[0]),
  services: [createService(data.services[0])],
  payments: [],
  stats: {
    services: {
      price: 14000,
      duration: 14000,
    },
  },
};
const mockAppointment2 = {
  ...mockAppointment,
  stats: {
    services: {
      ...mockAppointment.stats,
      price: 12000,
      duration: 12000,
    },
  },
};

const appointments = [mockAppointment, mockAppointment2];

// Create test data
const mockUseAppointments = useAppointments as unknown as ReturnType<
  typeof vi.fn
>;

// Import the component after mocking
const Dashboard = await import("./Dashboard");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

// const user = userEvent.setup();

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockNavigate.mockClear();
    mockMutate.mockClear();
    mockMutateCancel.mockClear();
    mockRouterState.mockClear();

    // Mock route params
    mockUseParams.mockReturnValue({
      payoutId: undefined,
    });

    // Default mock implementations
    mockUseAppointments.mockReturnValue({
      data: appointments,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
      isRefetching: false,
    });
  });

  it("should display date and title", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard.default />
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText(format(new Date("2025-12-14"), "eeee, io MMMM")),
    ).toBeInTheDocument();
    expect(await screen.findByText(`${["common.hello", "Adam"].join(" ")},`)).toBeInTheDocument();
  });

  it("should display stats cards for appointments", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard.default />
      </QueryClientProvider>,
    );

    expect(await screen.findByTestId("card-total")).toHaveTextContent(
      "transactions.payments.cards.total€260.00",
    );
    expect(await screen.findByTestId("card-averagePayment")).toHaveTextContent(
      "transactions.payments.cards.averagePayment€130.00",
    );
    expect(await screen.findByTestId("card-totalCount")).toHaveTextContent(
      "transactions.payments.cards.totalCount2",
    );
    expect(await screen.findByTestId("card-totalDuration")).toHaveTextContent(
      "transactions.payments.cards.totalDuration26000 common.mins",
    );
  });

  it("should display upcoming appointments", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard.default />
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText("appointments.upcomingAppointments"),
    ).toBeInTheDocument();
    expect(await screen.findByText("appointments.table.date"));
    expect(await screen.findByText("appointments.table.client"));
    expect(await screen.findByText("appointments.table.assistant"));
    expect(await screen.findByText("appointments.table.duration"));
    expect(await screen.findByText("appointments.table.price"));

    appointments.forEach((appointment) => {
      expect(
        screen.getAllByText(format(new Date(appointment.time), "Pp"))[0],
      ).toBeInTheDocument();
      expect(screen.getAllByText(appointment.client.name)[0]).toBeInTheDocument();
      expect(screen.getAllByText(appointment.assistant.name)[0]).toBeInTheDocument();
      expect(
        screen.getByText(
          [appointment.stats.services.duration, "common.minutes"].join(" "),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          [
            getSymbolFromCurrency(SETTINGS.currency),
            centsToFixed(appointment.stats.services.price),
          ].join(""),
        ),
      );
    });
  });

  it("should navigate to specific appointment on appointment select", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard.default />
      </QueryClientProvider>,
    );

    const assistantRows = screen.queryAllByTestId("appointment-row");

    await user.click(assistantRows[0]);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/dashboard/${appointments[0].id}`,
      });
    });
  });
});
