import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns/format";

import {
  useAppointment,
  useServices,
  useClients,
  useUpdateAppointment,
  appointmentQueryKeys,
} from "@/api";
import type { BuukiaAppointment, BuukiaClient, BuukiaService } from "@/types";
import { createAssistant, createClient, createService } from "@/utils";

import data from "../../routes/data.json";

// Mock the API hooks
vi.mock("@/api", () => ({
  useAppointment: vi.fn(),
  useServices: vi.fn(),
  useClients: vi.fn(),
  useUpdateAppointment: vi.fn(),
  appointmentQueryKeys: vi.fn(),
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
}));

// Create test data
const mockAppointment: BuukiaAppointment = {
  id: "appointmentId",
  time: "2025-12-15T10:00:00.000Z",
  assistant: createAssistant(data.assistants[0]),
  client: createClient(data.clients[0]),
  services: [createService(data.services[0])],
};
const mockServices: BuukiaService[] = [createService(data.services[0])];
const mockClients: BuukiaClient[] = [createClient(data.clients[0])];

const mockUseAppointment = useAppointment as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseServices = useServices as unknown as ReturnType<typeof vi.fn>;
const mockUseClients = useClients as unknown as ReturnType<typeof vi.fn>;
const mockUseUpdateAppointment = useUpdateAppointment as unknown as ReturnType<
  typeof vi.fn
>;
const mockAppointmentQueryKeys = appointmentQueryKeys as unknown as ReturnType<
  typeof vi.fn
>;

// Import the component after mocking
const EditAppointment = await import("./EditAppointment");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const user = userEvent.setup();

describe("weekly/$assistantId/$appointmentId", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockNavigate.mockClear();
    mockMutate.mockClear();
    mockRouterState.mockClear();

    // Mock route params
    mockUseParams.mockReturnValue({
      appointmentId: mockAppointment.id,
      date: String(new Date("2025-12-14").getTime()),
      assistantId: mockAppointment.assistant.id,
    });

    // Default mock implementations
    mockUseAppointment.mockReturnValue({
      data: mockAppointment,
      error: null,
      isLoading: false,
    });
    mockUseServices.mockReturnValue({
      data: mockServices,
      error: null,
      isLoading: false,
    });
    mockUseClients.mockReturnValue({
      data: mockClients,
      error: null,
      isLoading: false,
    });
    mockUseUpdateAppointment.mockReturnValue({
      mutate: mockMutate,
    });
    mockAppointmentQueryKeys.mockReturnValue({ all: "appointments-all" });
  });

  describe("Drawer", () => {
    it("should render header title", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <EditAppointment.default />
        </QueryClientProvider>,
      );

      expect(screen.getByText("appointments.appointment")).toBeInTheDocument();
    });

    it("should render header title with functional close button", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <EditAppointment.default />
        </QueryClientProvider>,
      );

      const closeButton = await screen.findByLabelText("common.closeDrawer");

      await user.click(closeButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/appointments/daily/1765670400000`,
      });
    });

    it("should ensure that overlay has functional close button", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <EditAppointment.default />
        </QueryClientProvider>,
      );

      const overlay = await screen.findByTestId("drawer-overlay");

      await user.click(overlay);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/appointments/daily/1765670400000`,
      });
    });

    it("should display error when there is an appointment error", async () => {
      mockUseAppointment.mockReturnValueOnce({
        data: null,
        error: new Error("Appointment error"),
        isLoading: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <EditAppointment.default />
        </QueryClientProvider>,
      );

      expect(await screen.findByText("error.message")).toBeInTheDocument();
    });

    it("should display error when there is an services error", async () => {
      mockUseServices.mockReturnValueOnce({
        data: null,
        error: new Error("Services error"),
        isLoading: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <EditAppointment.default />
        </QueryClientProvider>,
      );

      expect(await screen.findByText("error.message")).toBeInTheDocument();
    });

    it("should display error when there is clients error", async () => {
      mockUseClients.mockReturnValueOnce({
        data: null,
        error: new Error("Clients error"),
        isLoading: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <EditAppointment.default />
        </QueryClientProvider>,
      );

      expect(await screen.findByText("error.message")).toBeInTheDocument();
    });

    it("should populate form with expected values", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <EditAppointment.default />
        </QueryClientProvider>,
      );

      const timeInputElement = await (screen.queryByTestId(
        "time-input",
      ) as HTMLInputElement);
      const assistantNameInputElement = await (screen.queryByTestId(
        "assistant-name-input",
      ) as HTMLInputElement);
      const submitButton = (await screen.queryByText(
        "common.submit",
      )) as HTMLElement;
      const elements = await screen.queryAllByTestId("services-list-item");

      await user.click(submitButton);

      expect(elements.length).toEqual(mockAppointment.services.length);
      expect(assistantNameInputElement).toHaveValue(
        mockAppointment.assistant.name,
      );
      expect(timeInputElement).toHaveValue(
        format(new Date(mockAppointment.time), "PPpp"),
      );
    });

    it("should redirect to daily view after successful appointment creation", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <EditAppointment.default />
        </QueryClientProvider>,
      );

      const button = screen.queryByText("common.submit");

      if (!button) {
        throw new Error("Button not found");
      }

      await user.click(button!);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/appointments/daily/1765670400000`,
      });
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: mockAppointment.id,
          assistantId: "3b5d8fda-f136-4696-b91d-4d3f28d4a9f9",
          clientId: "0105b195-3533-4be8-a143-8f8d53b4bce7",
          serviceIds: ["0f15e666-855d-4dfe-ae57-b925cee00452"],
          time: "2025-12-15T10:00:00.000Z",
        },
        {
          onSuccess: expect.any(Function),
        },
      );
    });

    it("should redirect to weekly view after successful appointment creation", async () => {
      mockRouterState.mockReturnValueOnce("weekly");

      render(
        <QueryClientProvider client={queryClient}>
          <EditAppointment.default />
        </QueryClientProvider>,
      );

      const button = screen.queryByText("common.submit");

      if (!button) {
        throw new Error("Button not found");
      }

      await user.click(button!);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/appointments/weekly/1765670400000/3b5d8fda-f136-4696-b91d-4d3f28d4a9f9`,
      });
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: mockAppointment.id,
          assistantId: "3b5d8fda-f136-4696-b91d-4d3f28d4a9f9",
          clientId: "0105b195-3533-4be8-a143-8f8d53b4bce7",
          serviceIds: ["0f15e666-855d-4dfe-ae57-b925cee00452"],
          time: "2025-12-15T10:00:00.000Z",
        },
        {
          onSuccess: expect.any(Function),
        },
      );
    });
  });
});
