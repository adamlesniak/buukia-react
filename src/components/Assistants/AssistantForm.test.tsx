import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getDayName } from "@/utils";

import { server } from "../../mocks/server";
import data from "../../routes/data.json";

import { AssistantForm } from "./AssistantForm";

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

const user = userEvent.setup();

describe("AssistantForm", () => {
  const days = Array.from({ length: 7 }).map(
    (_, index) => `common.daysOfWeek.${getDayName(index)}`,
  );
  const testProps = {
    availability: Array.from({ length: 7 }).map((_, index) => ({
      dayOfWeek: index,
      times: [
        {
          start: "",
          end: "",
        },
      ],
    })),
    categories: [],
    firstName: "testFirstName",
    lastName: "testLastName",
    email: "test@test.com",
  };

  it("should show firstName field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AssistantForm
          categories={data.categories}
          onCategorySearch={() => {}}
          onSubmit={() => {}}
          values={testProps}
          isLoading={false}
          categoriesIsLoading={false}
          deleteCategory={() => {}}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByLabelText("assistants.detail.firstName"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("first-name-input")).not.toBeDisabled();
      expect(screen.queryByTestId("first-name-input")).toHaveValue(
        testProps.firstName,
      );
    });
  });

  it("should show lastName field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AssistantForm
          categories={data.categories}
          onCategorySearch={() => {}}
          onSubmit={() => {}}
          values={testProps}
          isLoading={false}
          categoriesIsLoading={false}
          deleteCategory={() => {}}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByLabelText("assistants.detail.lastName"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("last-name-input")).not.toBeDisabled();
      expect(screen.queryByTestId("last-name-input")).toHaveValue(
        testProps.lastName,
      );
    });
  });

  it("should ensure that certain fields are disabled once assistantId is set", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AssistantForm
          assistantId="testId"
          categories={data.categories}
          onCategorySearch={() => {}}
          onSubmit={() => {}}
          values={testProps}
          isLoading={false}
          categoriesIsLoading={false}
          deleteCategory={() => {}}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByLabelText("assistants.detail.firstName"),
      ).toBeDisabled();
      expect(
        screen.queryByLabelText("assistants.detail.lastName"),
      ).toBeDisabled();
    });
  });

  it("should show email field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AssistantForm
          categories={data.categories}
          onCategorySearch={() => {}}
          onSubmit={() => {}}
          values={testProps}
          isLoading={false}
          categoriesIsLoading={false}
          deleteCategory={() => {}}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByLabelText("assistants.detail.email"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("email-input")).not.toBeDisabled();
      expect(screen.queryByTestId("email-input")).toHaveValue(testProps.email);
    });
  });

  describe("availability field", () => {
    it("should show availability field", async () => {
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <AssistantForm

            categories={data.categories}
            onCategorySearch={() => {}}
            onSubmit={() => {}}
            values={testProps}
            isLoading={false}
            categoriesIsLoading={false}
            deleteCategory={() => {}}
          />
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(
          screen.queryByText("assistants.detail.availability"),
        ).toBeInTheDocument();

        for (let i = 0; i < 6; i++) {
          expect(
            screen
              .queryByTestId(`timeslot-${i}`)
              ?.querySelector(`[data-testid="copy-availability-button"]`),
          ).toBeInTheDocument();
          expect(
            screen
              .queryByTestId(`timeslot-${i}`)
              ?.querySelector(`[data-testid="add-availability-button"]`),
          ).toBeInTheDocument();
          expect(screen.queryByText(days[i])).toBeInTheDocument();
        }
      });
    });

    it("should show availability field with copyTo dropdown", async () => {
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <AssistantForm

            categories={data.categories}
            onCategorySearch={() => {}}
            onSubmit={() => {}}
            values={testProps}
            isLoading={false}
            categoriesIsLoading={false}
            deleteCategory={() => {}}
          />
        </QueryClientProvider>,
      );

      await user.type(
        screen.getByTestId(`availability-0-start-time-input-0`),
        "09:00",
      );
      await user.type(
        screen.getByTestId(`availability-0-end-time-input-0`),
        "18:00",
      );

      await user.click(screen.getAllByTestId("copy-availability-button")[0]);

      await waitFor(async () => {
        expect(
          screen.queryByTestId("assistant-availability-dropdown"),
        ).toBeInTheDocument();
        expect(
          screen.getAllByTestId("copy-availability-button")[0],
        ).toBeInTheDocument();

        for (let i = 0; i < 6; i++) {
          await user.click(screen.getByTestId(`copy-to-${i}-input`));
        }

        await user.click(screen.getByTestId(`submit-copy-availability-button`));

        for (let i = 0; i < 6; i++) {
          expect(
            screen.getByTestId(`availability-${i}-start-time-input-0`),
          ).toHaveValue("09:00");
          expect(
            screen.getByTestId(`availability-${i}-end-time-input-0`),
          ).toHaveValue("18:00");
        }

        expect(
          screen.queryByTestId("assistant-availability-dropdown"),
        ).not.toBeInTheDocument();
      });
    });

    it("should show availability field with add and delete button", async () => {
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <AssistantForm
            categories={data.categories}
            onCategorySearch={() => {}}
            onSubmit={() => {}}
            values={testProps}
            isLoading={false}
            categoriesIsLoading={false}
            deleteCategory={() => {}}
          />
        </QueryClientProvider>,
      );

      await user.click(screen.getAllByTestId("add-availability-button")[0]);

      await waitFor(() => {
        expect(
          screen.queryByText("assistants.detail.availability"),
        ).toBeInTheDocument();

        expect(
          screen.queryByTestId(`availability-0-start-time-input-0`),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId(`availability-0-end-time-input-0`),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId(`availability-0-start-time-input-1`),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId(`availability-0-end-time-input-1`),
        ).toBeInTheDocument();
      });

      await user.click(screen.getAllByTestId("delete-availability-button")[0]);

      await waitFor(() => {
        expect(
          screen.queryByTestId(`availability-0-start-time-input-0`),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId(`availability-0-end-time-input-0`),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId(`availability-0-start-time-input-1`),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId(`availability-0-end-time-input-1`),
        ).not.toBeInTheDocument();
      });
    });
  });

  it("should show errors", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AssistantForm
          categories={data.categories}
          onCategorySearch={() => {}}
          onSubmit={() => {}}
          values={{
            availability: [],
            categories: [],
            firstName: "",
            lastName: "",
            email: "",
          }}
          isLoading={false}
          categoriesIsLoading={false}
          deleteCategory={() => {}}
        />
      </QueryClientProvider>,
    );

    await user.click(screen.getByText("common.submit"));

    await waitFor(() => {
      expect(
        screen.queryByText("assistants.form.errors.firstNameError"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("assistants.form.errors.lastNameError"),
      ).toBeInTheDocument();
    });
  });
});
