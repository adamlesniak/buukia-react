import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useServices, useDeleteService } from "@/api";

import { server } from "../mocks/server";
import data from "../routes/data.json";

vi.mock("@/api", async () => ({
  useDeleteService: vi.fn(),
  useServices: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (value: string) => value }),
}));

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

const mockUseServices = useServices as unknown as ReturnType<typeof vi.fn>;
const mockUseDeleteService = useDeleteService as unknown as ReturnType<
  typeof vi.fn
>;
const mockMutate = vi.fn();

const Services = await import("./Services");

const user = userEvent.setup();

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockNavigate.mockClear();
    mockMutate.mockClear();

    mockUseServices.mockReturnValue({
      data: data.services,
      error: null,
      isLoading: false,
    });
    mockUseDeleteService.mockReturnValue({ mutate: mockMutate });
  });

  it("should service title, items count and add service button", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Services.default />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText("services.title")).toBeInTheDocument();
      expect(
        screen.queryByText(`${data.services.length} common.items`),
      ).toBeInTheDocument();
      expect(screen.queryByText("services.addService")).toBeInTheDocument();
    });
  });

  it("should show services name, category, duration, price and actions", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Services.default />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText("services.name")).toBeInTheDocument();
      expect(screen.queryByText("services.category")).toBeInTheDocument();
      expect(screen.queryByText("services.duration")).toBeInTheDocument();
      expect(screen.queryByText("services.price")).toBeInTheDocument();
      expect(screen.queryByText("services.actions")).toBeInTheDocument();

      data.services.forEach((service) => {
        expect(screen.queryAllByText(service.name)).toBeDefined();
        expect(screen.queryAllByText(service.category)).toBeDefined();
        expect(
          screen.queryAllByText(`${service.duration} common.minutes`),
        ).toBeDefined();
        expect(screen.queryAllByText(`€${service.price}`)).toBeDefined();
      });
    });
  });

  it("should navigate to specific service on service select", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Services.default />
      </QueryClientProvider>,
    );

    const serviceRows = screen.queryAllByTestId("service-row");

    await user.click(serviceRows[0]);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/services/${data.services[0].id}`,
      });
    });
  });

  it("should delete specific service on service deletion", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Services.default />
      </QueryClientProvider>,
    );

    const serviceRowsDelete = screen.queryAllByTestId("service-row-delete");

    await user.click(serviceRowsDelete[0]);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(data.services[0].id);
    });
  });

  it("should show error in case of services error", async () => {
    const queryClient = new QueryClient();

    mockUseServices.mockReturnValue({
      data: data.services,
      error: new Error("Services error"),
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Services.default />
      </QueryClientProvider>,
    );

    const error = screen.queryByText("services.loadingError");

    expect(error).toBeInTheDocument();
  });
});