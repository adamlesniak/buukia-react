import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns/format";

import {
  useAssistant,
  useServices,
  useClients,
  useUpdateAssistant,
  useCreateAssistant,
} from "@/api";
import type { BuukiaAssistant, BuukiaClient, BuukiaService } from "@/types";
import { createAssistant, createClient, createService } from "@/utils";

import data from "../routes/data.json";

// Mock the API hooks
vi.mock("@/api", async (importOriginal) => ({
  useAssistant: vi.fn(),
  useServices: vi.fn(),
  useClients: vi.fn(),
  useCreateAssistant: vi.fn(),
  useUpdateAssistant: vi.fn(),
  appointmentQueryKeys: (
    (await importOriginal()) as { appointmentQueryKeys: unknown }
  ).appointmentQueryKeys,
  clientQueryKeys: ((await importOriginal()) as { clientQueryKeys: unknown })
    .clientQueryKeys,
  serviceQueryKeys: ((await importOriginal()) as { serviceQueryKeys: unknown })
    .serviceQueryKeys,
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
const mockAssistant: BuukiaAssistant = {
  id: "appointmentId",
  time: "2025-12-15T10:00:00.000Z",
  assistant: createAssistant(data.assistants[0]),
  client: createClient(data.clients[0]),
  services: [createService(data.services[0])],
};
const mockServices: BuukiaService[] = [createService(data.services[0])];
const mockClients: BuukiaClient[] = [createClient(data.clients[0])];

const mockUseAssistant = useAssistant as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseServices = useServices as unknown as ReturnType<typeof vi.fn>;
const mockUseClients = useClients as unknown as ReturnType<typeof vi.fn>;
const mockUseUpdateAssistant = useUpdateAssistant as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseCreateAssistant = useCreateAssistant as unknown as ReturnType<
  typeof vi.fn
>;

// Import the component after mocking
const AssistantDetail = await import("./AssistantDetail");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const user = userEvent.setup();

describe("AssistantDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockNavigate.mockClear();
    mockMutate.mockClear();
    mockRouterState.mockClear();

    // Mock route params
    mockUseParams.mockReturnValue({
      appointmentId: mockAssistant.id,
      date: String(new Date("2025-12-14").getTime()),
      assistantId: mockAssistant.assistant.id,
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
      refetch: vi.fn(),
    });
    mockUseClients.mockReturnValue({
      data: mockClients,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });
    mockUseUpdateAssistant.mockReturnValue({
      mutate: mockMutate,
    });
    mockUseCreateAssistant.mockReturnValue({
      mutate: mockMutate,
    });
  });

  describe("Drawer", () => {
    it("should render header title", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AssistantDetail.default />
        </QueryClientProvider>,
      );

      expect(screen.getByText("appointments.appointment")).toBeInTheDocument();
    });

    it("should render header title with functional close button", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AssistantDetail.default />
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
          <AssistantDetail.default />
        </QueryClientProvider>,
      );

      const overlay = await screen.findByTestId("drawer-overlay");

      await user.click(overlay);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/appointments/daily/1765670400000`,
      });
    });

    it("should display error when there is an appointment error", async () => {
      mockUseAssistant.mockReturnValueOnce({
        data: null,
        error: new Error("Assistant error"),
        isLoading: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <AssistantDetail.default />
        </QueryClientProvider>,
      );

      expect(await screen.findByText("error.message")).toBeInTheDocument();
    });

    it("should display error when there is an services error", async () => {
      mockUseServices.mockReturnValueOnce({
        data: null,
        error: new Error("Services error"),
        isLoading: false,
        refetch: vi.fn(),
      });

      render(
        <QueryClientProvider client={queryClient}>
          <AssistantDetail.default />
        </QueryClientProvider>,
      );

      expect(await screen.findByText("error.message")).toBeInTheDocument();
    });

    it("should display error when there is clients error", async () => {
      mockUseClients.mockReturnValueOnce({
        data: null,
        error: new Error("Clients error"),
        isLoading: false,
        refetch: vi.fn(),
      });

      render(
        <QueryClientProvider client={queryClient}>
          <AssistantDetail.default />
        </QueryClientProvider>,
      );

      expect(await screen.findByText("error.message")).toBeInTheDocument();
    });

    it("should populate form with expected values", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AssistantDetail.default />
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

      expect(elements.length).toEqual(mockAssistant.services.length);
      expect(assistantNameInputElement).toHaveValue(
        mockAssistant.assistant.name,
      );
      expect(timeInputElement).toHaveValue(
        format(new Date(mockAssistant.time), "PPpp"),
      );
    });

    it("should redirect to daily view after successful appointment creation", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AssistantDetail.default />
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
          id: mockAssistant.id,
          assistantId: mockAssistant.assistant.id,
          clientId: mockAssistant.client.id,
          serviceIds: mockAssistant.services.map((service) => service.id),
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
          <AssistantDetail.default />
        </QueryClientProvider>,
      );

      const button = screen.queryByText("common.submit");

      if (!button) {
        throw new Error("Button not found");
      }

      await user.click(button!);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/appointments/weekly/1765670400000/${mockAssistant.assistant.id}`,
      });
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: mockAssistant.id,
          assistantId: mockAssistant.assistant.id,
          clientId: mockAssistant.client.id,
          serviceIds: mockAssistant.services.map((service) => service.id),
          time: "2025-12-15T10:00:00.000Z",
        },
        {
          onSuccess: expect.any(Function),
        },
      );
    });
  });
});
