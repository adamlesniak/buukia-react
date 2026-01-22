import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useAssistant, useDeleteAssistant, useUpdateAssistant } from "@/api";
import type { BuukiaAssistant } from "@/types";
import { createAssistant } from "@/utils";

import data from "../routes/data.json";

const AssistantSettings = await import("./AssistantSettings");

const mockUseParams = vi
  .fn()
  .mockReturnValue({ assistantId: "testAssistantId" });
const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  Link: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (value: string) => value }),
}));

vi.mock("@/api", () => ({
  useUpdateAssistant: vi.fn(),
  useDeleteAssistant: vi.fn(),
  useAssistant: vi.fn(),
}));

const mockAssistant: BuukiaAssistant = createAssistant(data.assistants[0]);

const mockUseAssistant = useAssistant as unknown as ReturnType<typeof vi.fn>;
const mockUseDeleteAssistant = useDeleteAssistant as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseUpdateAssistant = useUpdateAssistant as unknown as ReturnType<
  typeof vi.fn
>;
const mockMutate = vi.fn().mockImplementation(() => {});

const user = userEvent.setup();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});
describe("AssistantSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const date = new Date("2025-12-14");

    vi.setSystemTime(date);

    mockUseAssistant.mockReturnValue({
      data: mockAssistant,
      error: null,
      isLoading: false,
      refetch: vi.fn(),
    });

    mockUseUpdateAssistant.mockReturnValue({
      mutate: mockMutate,
    });
    mockUseDeleteAssistant.mockReturnValue({ mutate: mockMutate });
  });

  describe("settings", () => {
    it("should render settings title", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AssistantSettings.default />
        </QueryClientProvider>,
      );

      expect(screen.getByText("settings.title")).toBeInTheDocument();
    });

    it("should render holidays setting", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AssistantSettings.default />
        </QueryClientProvider>,
      );

      expect(screen.getByText("settings.holidays.title")).toBeInTheDocument();
      expect(
        screen.getByText("settings.holidays.description"),
      ).toBeInTheDocument();
    });

    it("should call updateAssistant when toggling holidays setting", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AssistantSettings.default />
        </QueryClientProvider>,
      );

      const toggle = screen.getByTestId("holidays-toggle");
      await user.click(toggle);

      expect(mockMutate).toHaveBeenCalled();
    });
  });

  describe("actions", () => {
    it("should render actions title", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AssistantSettings.default />
        </QueryClientProvider>,
      );

      expect(screen.getByText("settings.actions.title")).toBeInTheDocument();
    });

    it("should remove assistant following by confirmation dialog", async () => {
      mockUseDeleteAssistant.mockReturnValue({
        mutate: mockMutate,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <AssistantSettings.default />
        </QueryClientProvider>,
      );

      await user.click(screen.getByText("settings.actions.deleteAssistant"));

      expect(
        screen.getByText("settings.modal.deleteTitle"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("settings.modal.deleteMessage"),
      ).toBeInTheDocument();

      await user.click(screen.getByText("common.delete"));

      expect(
        screen.queryByText("settings.modal.deleteTitle"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("settings.modal.deleteMessage"),
      ).not.toBeInTheDocument();
      expect(mockMutate).toHaveBeenCalledWith("testAssistantId");
    });

    it("should not remove assistant following by confirmation dialog", async () => {
      mockUseDeleteAssistant.mockReturnValue({
        mutate: mockMutate,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <AssistantSettings.default />
        </QueryClientProvider>,
      );

      await user.click(screen.getByText("settings.actions.deleteAssistant"));

      expect(
        screen.getByText("settings.modal.deleteTitle"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("settings.modal.deleteMessage"),
      ).toBeInTheDocument();

      await user.click(screen.getByText("common.cancel"));

      expect(
        screen.queryByText("settings.modal.deleteTitle"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("settings.modal.deleteMessage"),
      ).not.toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalledWith("testAssistantId");
    });
  });
});
