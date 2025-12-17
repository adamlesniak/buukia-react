import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  useAssistant,
  useServices,
  useClients,
  useCreateAppointment,
} from "@/api";
import type { BuukiaAssistant, BuukiaClient, BuukiaService } from "@/types";
import { createAssistant, createClient, createService } from "@/utils";

import data from "../../../../../data.json";

// Mock the API hooks
vi.mock("@/api", () => ({
  useAssistant: vi.fn(),
  useServices: vi.fn(),
  useClients: vi.fn(),
  useCreateAppointment: vi.fn(),
}));
vi.mock("i18next", () => ({
  t: (value: string) => value,
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
const mockAssistant: BuukiaAssistant = createAssistant(data.assistants[0]);
const mockServices: BuukiaService[] = [createService(data.services[0])];
const mockClients: BuukiaClient[] = [createClient(data.clients[0])];

const mockUseAssistant = useAssistant as unknown as ReturnType<typeof vi.fn>;
const mockUseServices = useServices as unknown as ReturnType<typeof vi.fn>;
const mockUseClients = useClients as unknown as ReturnType<typeof vi.fn>;
const mockUseCreateAppointment = useCreateAppointment as unknown as ReturnType<
  typeof vi.fn
>;
const mockMutate = vi.fn().mockImplementation((_data, { onSuccess }) => {
  onSuccess();
});

const { RouteComponent } = await import("./$time");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const user = userEvent.setup();

describe("weekly/$date/$assistantId/new/$time", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockMutate.mockClear();
    mockNavigate.mockClear();

    // Mock route params
    mockUseParams.mockReturnValue({
      assistantId: mockAssistant.id,
      date: String(new Date("2025-12-14").getTime()),
      time: String(new Date("2025-12-14").getTime()),
    });

    // Default mock implementations
    mockUseAssistant.mockReturnValue({
      data: mockAssistant,
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
    mockUseCreateAppointment.mockReturnValue({
      mutate: mockMutate,
    });
  });

  describe("Drawer", () => {
    it("should render header title", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      expect(screen.getByText("appointments.appointment")).toBeInTheDocument();
    });

    it("should render header title with functional close button", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      const closeButton = await screen.findByLabelText("common.closeDrawer");

      await user.click(closeButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/appointments/weekly/1765670400000/3b5d8fda-f136-4696-b91d-4d3f28d4a9f9/`,
      });
    });

    it("should ensure that overlay has functional close button", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      const overlay = await screen.findByTestId("drawer-overlay");

      await user.click(overlay);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/appointments/weekly/1765670400000/3b5d8fda-f136-4696-b91d-4d3f28d4a9f9/`,
      });
    });

    it("should display error when there is an assistant error", async () => {
      mockUseAssistant.mockReturnValueOnce({
        data: null,
        error: new Error("Assistant error"),
        isLoading: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
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
          <RouteComponent />
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
          <RouteComponent />
        </QueryClientProvider>,
      );

      expect(await screen.findByText("error.message")).toBeInTheDocument();
    });

    it("should render form with expected values and show errors when its not completed", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      const element = await (screen.queryByTestId(
        "time-input",
      ) as HTMLInputElement);

      const submitButton = (await screen.queryByText(
        "common.submit",
      )) as HTMLElement;

      await user.click(submitButton);

      expect(
        await screen.queryByText("appointments.form.errors.clientNameError"),
      ).toBeInTheDocument();
      expect(
        await screen.queryByText("appointments.form.errors.servicesError"),
      ).toBeInTheDocument();
      expect(element).toHaveValue("Dec 14, 2025, 1:00:00 AM");
    });

    it("should redirect to daily view after successful appointment creation", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <RouteComponent />
        </QueryClientProvider>,
      );

      // Select client
      const clientInput = (
        await screen.findByTestId("client-name-input")
      ).querySelectorAll("input")[0] as HTMLInputElement;

      await user.click(clientInput);

      const clientOption = await screen.findByText(`${mockClients[0].name}`);

      await user.click(clientOption);

      // Select service
      await user.click(screen.getByText("appointments.detail.addService"));

      const item = screen.queryAllByTestId("services-list-item")[0];
      const serviceAddButton = item.querySelector("button");

      await user.click(serviceAddButton!);

      const button = screen.queryByText("common.submit");

      if (!button) {
        throw new Error("Button not found");
      }

      await user.click(button!);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/appointments/weekly/1765670400000/3b5d8fda-f136-4696-b91d-4d3f28d4a9f9/`,
      });
      expect(mockMutate).toHaveBeenCalledWith(
        {
          assistantId: "3b5d8fda-f136-4696-b91d-4d3f28d4a9f9",
          clientId: "0105b195-3533-4be8-a143-8f8d53b4bce7",
          serviceIds: ["0f15e666-855d-4dfe-ae57-b925cee00452"],
          time: "2025-12-14T00:00:00.000Z",
        },
        {
          onSuccess: expect.any(Function),
        },
      );
    });
  });
});
