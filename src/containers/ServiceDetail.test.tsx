import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  useCategories,
  useCreateCategory,
  useCreateService,
  useDeleteService,
  useService,
  useUpdateCategory,
  useUpdateService,
} from "@/api";
import type { BuukiaCategory, BuukiaService } from "@/types";
import { centsToFixed, createCategory } from "@/utils";

import data from "../routes/data.json";

// Mock the API hooks
vi.mock("@/api", async () => ({
  useCreateService: vi.fn(),
  useService: vi.fn(),
  useDeleteService: vi.fn(),
  useUpdateService: vi.fn(),
  useCategories: vi.fn(),
  useCreateCategory: vi.fn(),
  useDeleteCategory: vi.fn(),
  useUpdateCategory: vi.fn(),
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
const mockMutateDelete = vi.fn();
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

// Create test data
const mockService: BuukiaService = {
  id: "serviceId",
  name: "Service Name",
  description: "Service Description",
  duration: "60",
  price: 10000,
  category: data.categories[0],
};
const mockCategories: BuukiaCategory[] = [createCategory(data.categories[0])];

const mockUseCategories = useCategories as unknown as ReturnType<typeof vi.fn>;
const mockUseService = useService as unknown as ReturnType<typeof vi.fn>;
const mockUseCreateService = useCreateService as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseUpdateService = useUpdateService as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseDeleteService = useDeleteService as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseCreateCategory = useCreateCategory as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseUpdateCategory = useUpdateCategory as unknown as ReturnType<
  typeof vi.fn
>;

// Import the component after mocking
const ServiceDetail = await import("./ServiceDetail");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const user = userEvent.setup();

describe("ServiceDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockNavigate.mockClear();
    mockMutate.mockClear();
    mockMutateDelete.mockClear();
    mockRouterState.mockClear();
    mockUseService.mockClear();
    mockUseCategories.mockClear();

    // Mock route params
    mockUseParams.mockReturnValue({
      serviceId: mockService.id,
    });

    // Default mock implementations
    mockUseCategories.mockReturnValue({
      data: mockCategories,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
      isRefetching: false,
    });
    mockUseService.mockReturnValue({
      data: mockService,
      error: null,
      isLoading: false,
    });
    mockUseUpdateService.mockReturnValue({
      mutate: mockMutate,
    });
    mockUseCreateService.mockReturnValue({
      mutate: mockMutate,
    });
    mockUseDeleteService.mockReturnValue({
      mutate: mockMutate,
    });
    mockUseCreateCategory.mockReturnValue({
      mutate: mockMutate,
    });
    mockUseUpdateCategory.mockReturnValue({
      mutate: mockMutate,
    });
  });

  describe("ServiceDetail", () => {
    it("should render header title", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ServiceDetail.default />
        </QueryClientProvider>,
      );

      expect(screen.getByText("services.service")).toBeInTheDocument();
    });

    it("should render header title with functional close button", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ServiceDetail.default />
        </QueryClientProvider>,
      );

      const closeButton = await screen.findByLabelText("common.closeDrawer");

      await user.click(closeButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/services`,
      });
    });

    it("should ensure that overlay has functional close button", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ServiceDetail.default />
        </QueryClientProvider>,
      );

      const overlay = await screen.findByTestId("drawer-overlay");

      await user.click(overlay);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/services`,
      });
    });

    it("should populate form with expected values", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ServiceDetail.default />
        </QueryClientProvider>,
      );

      const serviceNameElement = await (screen.queryByTestId(
        "service-name-input",
      ) as HTMLInputElement);
      const categoryInputElement = await (screen.queryByTestId(
        "service-category-input",
      ) as HTMLSelectElement);
      const priceInputElement = await (screen.queryByTestId(
        "service-price-input",
      ) as HTMLInputElement);
      const durationInputElement = await (screen.queryByTestId(
        "service-duration-input",
      ) as HTMLInputElement);
      const serviceDescriptionInputElement = await (screen.queryByTestId(
        "service-description-input",
      ) as HTMLInputElement);
      const submitButton = (await screen.queryByText(
        "common.submit",
      )) as HTMLElement;

      await user.click(submitButton);

      expect(serviceNameElement).toHaveValue(mockService.name);
      expect(categoryInputElement?.querySelector("input")).toHaveValue(
        JSON.stringify([data.categories[0]]),
      );
      expect(priceInputElement).toHaveValue(centsToFixed(mockService.price));
      expect(durationInputElement).toHaveValue(mockService.duration);
      expect(serviceDescriptionInputElement).toHaveValue(
        mockService.description,
      );
    });

    it("should redirect to services view after successful service update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ServiceDetail.default />
        </QueryClientProvider>,
      );

      const button = screen.queryByText("common.submit");

      if (!button) {
        throw new Error("Button not found");
      }

      await user.click(button!);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/services`,
      });
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: "serviceId",
          category: data.categories[0],
          description: "Service Description",
          duration: "60",
          name: "Service Name",
          price: 10000,
        },
        {
          onSuccess: expect.any(Function),
        },
      );
    });

    it("should show error in case of services error", async () => {
      mockUseService.mockReturnValue({
        data: mockService,
        error: new Error("Service error"),
        isLoading: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <ServiceDetail.default />
        </QueryClientProvider>,
      );

      const error = await screen.queryByText("Service error");

      expect(error).toBeInTheDocument();
    });

    it("should show error in case of categories error", async () => {
      mockUseService.mockReturnValue({
        data: mockService,
        error: new Error("Category error"),
        isLoading: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <ServiceDetail.default />
        </QueryClientProvider>,
      );

      const error = await screen.queryByText("Category error");

      expect(error).toBeInTheDocument();
    });

    it("should remove service following by confirmation dialog", async () => {
      mockUseDeleteService.mockReturnValue({
        mutate: mockMutateDelete,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <ServiceDetail.default />
        </QueryClientProvider>,
      );

      await user.click(screen.getByText("services.deleteService"));

      expect(
        screen.getByText("services.modal.deleteTitle"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("services.modal.deleteMessage"),
      ).toBeInTheDocument();

      await user.click(screen.getByText("common.delete"));

      expect(
        screen.queryByText("services.modal.deleteTitle"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("services.modal.deleteMessage"),
      ).not.toBeInTheDocument();
      expect(mockMutateDelete).toHaveBeenCalledWith("serviceId");
    });

    it("should not remove service following by confirmation dialog", async () => {
      mockUseDeleteService.mockReturnValue({
        mutate: mockMutateDelete,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <ServiceDetail.default />
        </QueryClientProvider>,
      );

      await user.click(screen.getByText("services.deleteService"));

      expect(
        screen.getByText("services.modal.deleteTitle"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("services.modal.deleteMessage"),
      ).toBeInTheDocument();

      await user.click(screen.getByText("common.cancel"));

      expect(
        screen.queryByText("services.modal.deleteTitle"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("services.modal.deleteMessage"),
      ).not.toBeInTheDocument();
      expect(mockMutateDelete).not.toHaveBeenCalledWith("testAssistantId");
    });
  });
});
