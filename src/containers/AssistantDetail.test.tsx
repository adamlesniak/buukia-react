import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  useUpdateAssistant,
  useCreateAssistant,
  useCreateCategory,
  useDeleteCategory,
  useCategories,
  useAssistant,
} from "@/api";
import type { BuukiaAssistant, BuukiaCategory } from "@/types";
import { createAssistant } from "@/utils";

import data from "../routes/data.json";

// Mock the API hooks
vi.mock("@/api", async () => ({
  useAssistant: vi.fn(),
  useCategories: vi.fn(),
  useCreateAssistant: vi.fn(),
  useCreateCategory: vi.fn(),
  useDeleteCategory: vi.fn(),
  useUpdateAssistant: vi.fn(),
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
const mockMutateCategory = vi.fn().mockImplementation((_data) => {});
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
const mockAssistant: BuukiaAssistant = createAssistant(data.assistants[0]);
const mockCategories: BuukiaCategory[] = [...data.categories];

const mockUseCreateCategory = useCreateCategory as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseDeleteCategory = useDeleteCategory as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseUpdateAssistant = useUpdateAssistant as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseCreateAssistant = useCreateAssistant as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseCategories = useCategories as unknown as ReturnType<typeof vi.fn>;
const mockUseAssistant = useAssistant as unknown as ReturnType<typeof vi.fn>;

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
    mockMutateCategory.mockClear();

    // Mock route params
    mockUseParams.mockReturnValue({
      assistantId: mockAssistant.id,
    });

    mockUseCategories.mockReturnValue({
      data: mockCategories,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });
    mockUseAssistant.mockReturnValue({
      data: mockAssistant,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    // Default mock implementations
    mockUseCreateCategory.mockReturnValue({
      mutate: mockMutateCategory,
    });
    mockUseDeleteCategory.mockReturnValue({
      mutate: mockMutate,
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

      expect(screen.getByText("assistants.assistant")).toBeInTheDocument();
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
        to: `/assistants`,
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
        to: `/assistants`,
      });
    });

    it("should display error when there is categories error", async () => {
      mockUseCategories.mockReturnValueOnce({
        data: null,
        error: new Error("Categories error"),
        isLoading: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <AssistantDetail.default />
        </QueryClientProvider>,
      );

      expect(await screen.findByText("error.message")).toBeInTheDocument();
    });

    it("should display error when there is assistant error", async () => {
      mockUseAssistant.mockReturnValueOnce({
        data: null,
        error: new Error("Assistant error"),
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

      const firstNameInputElement = await (screen.queryByTestId(
        "first-name-input",
      ) as HTMLInputElement);
      const lastNameInputElement = await (screen.queryByTestId(
        "last-name-input",
      ) as HTMLInputElement);
      const emailInputElement = await (screen.queryByTestId(
        "email-input",
      ) as HTMLInputElement);
      const categoriesInputElement = await (screen.queryByTestId(
        "categories-input",
      ) as HTMLInputElement);
      const submitButton = (await screen.queryByText(
        "common.submit",
      )) as HTMLElement;

      await user.click(submitButton);

      expect(firstNameInputElement).toHaveValue(mockAssistant.firstName);
      expect(categoriesInputElement?.querySelector("input")).toHaveValue(
        JSON.stringify(data.assistants[0].categories),
      );
      expect(lastNameInputElement).toHaveValue(mockAssistant.lastName);
      expect(emailInputElement).toHaveValue(mockAssistant.email);
    });

    it("should redirect to assistants view after successful assistant update", async () => {
      mockUseParams.mockReturnValue({
        assistantId: mockAssistant.id,
      });

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
        to: `/assistants`,
      });
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: mockAssistant.id,
          firstName: mockAssistant.firstName,
          lastName: mockAssistant.lastName,
          email: mockAssistant.email,
          categories: mockAssistant.categories,
          availability: mockAssistant.availability,
        },
        {
          onSuccess: expect.any(Function),
        },
      );
    });

    it("should redirect to assistants view after successful assistant create", async () => {
      mockUseParams.mockReturnValue({
        assistantId: undefined,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <AssistantDetail.default />
        </QueryClientProvider>,
      );

      const firstNameInputElement = await (screen.queryByTestId(
        "first-name-input",
      ) as HTMLInputElement);
      const lastNameInputElement = await (screen.queryByTestId(
        "last-name-input",
      ) as HTMLInputElement);
      const emailInputElement = await (screen.queryByTestId(
        "email-input",
      ) as HTMLInputElement);
      const categoriesInputElement = await (screen.queryByTestId(
        "categories-input",
      ) as HTMLInputElement);

      await user.type(firstNameInputElement, mockAssistant.firstName);
      await user.type(lastNameInputElement, mockAssistant.lastName);
      await user.type(emailInputElement, mockAssistant.email);
      await user.click(
        categoriesInputElement.querySelector(".combobox-container-input")!,
      );

      const items = categoriesInputElement
        .querySelector(".combobox-dropdown")
        ?.querySelectorAll("li");

      if (!items || items.length === 0) {
        throw new Error("No items found in combobox dropdown");
      }

      await user.click(items[0]);
      await user.click(items[1]);

      const button = screen.queryByText("common.submit");

      if (!button) {
        throw new Error("Button not found");
      }

      await user.click(button!);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: `/assistants`,
      });
      expect(mockMutate).toHaveBeenCalledWith(
        {
          firstName: mockAssistant.firstName,
          lastName: mockAssistant.lastName,
          email: mockAssistant.email,
          categories: [data.categories[0], data.categories[1]],
          availability: Array.from({ length: 7 }).map((_, index) => ({
            dayOfWeek: index,
            times: [
              {
                start: "",
                end: "",
              },
            ],
          })),
        },
        {
          onSuccess: expect.any(Function),
        },
      );
    });

    it("should create category", async () => {
      mockUseParams.mockReturnValue({
        assistantId: undefined,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <AssistantDetail.default />
        </QueryClientProvider>,
      );

      const categoriesInputElement = await (screen.queryByTestId(
        "categories-input",
      ) as HTMLInputElement);

      await user.click(
        categoriesInputElement.querySelector(".combobox-container-input")!,
      );

      await user.click(screen.getByText("assistants.addCategory"));

      await waitFor(async () => {
        const addCategoryForm = screen.getByTestId("add-category-form");
        await user.type(
          screen.getByTestId("category-name-input"),
          "New Category",
        );

        const button = addCategoryForm.querySelector("button");
        await user.click(button!);

        expect(mockMutateCategory).toHaveBeenCalledWith({
          name: "New Category",
        });
      });
    });
  });
});
