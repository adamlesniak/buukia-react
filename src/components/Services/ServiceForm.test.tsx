import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { server } from "../../mocks/server";
import data from "../../routes/data.json";

import { ServiceForm } from "./ServiceForm";

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

describe("ServiceForm", () => {
  const testProps = {
    name: "testName",
    category: [
      {
        id: "testId",
        name: "Beauty",
      },
    ],
    duration: "45",
    price: "123",
    description: "testDescription",
  };

  it("should show name field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ServiceForm
          onSubmit={() => {}}
          values={testProps}
          isLoading={false}
          categories={data.categories}
          categoriesIsLoading={false}
          deleteCategory={() => {}}
          onCategorySearch={() => {}}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByLabelText("services.detail.name"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("service-name-input")).not.toBeDisabled();
      expect(screen.queryByTestId("service-name-input")).toHaveValue(
        testProps.name,
      );
    });
  });

  it("should show category field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ServiceForm
          onSubmit={() => {}}
          values={testProps}
          isLoading={false}
          categories={data.categories}
          categoriesIsLoading={false}
          deleteCategory={() => {}}
          onCategorySearch={() => {}}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("services.detail.category"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("service-category-input")).not.toBeDisabled();
      expect(
        screen.queryByTestId("service-category-input")?.querySelector("input"),
      ).toHaveValue(JSON.stringify(testProps.category));
    });
  });

  it("should show price field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ServiceForm
          onSubmit={() => {}}
          values={testProps}
          isLoading={false}
          categories={data.categories}
          categoriesIsLoading={false}
          deleteCategory={() => {}}
          onCategorySearch={() => {}}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText("services.detail.price")).toBeInTheDocument();
      expect(screen.queryByTestId("service-price-input")).toBeInTheDocument();
      expect(screen.queryByTestId("service-price-input")).toHaveValue(
        testProps.price.toString(),
      );
    });
  });

  it("should show duration field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ServiceForm
          onSubmit={() => {}}
          values={testProps}
          isLoading={false}
          categories={data.categories}
          categoriesIsLoading={false}
          deleteCategory={() => {}}
          onCategorySearch={() => {}}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("services.detail.duration"),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("service-duration-input"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("service-duration-input")).toHaveValue(
        testProps.duration.toString(),
      );
    });
  });

  it("should show description field", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ServiceForm
          onSubmit={() => {}}
          values={testProps}
          isLoading={false}
          categories={data.categories}
          categoriesIsLoading={false}
          deleteCategory={() => {}}
          onCategorySearch={() => {}}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("services.detail.description"),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("service-description-input"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("service-description-input")).toHaveValue(
        testProps.description,
      );
    });
  });

  it("should show errors", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ServiceForm
          onSubmit={() => {}}
          values={{
            name: "",
            category: [],
            duration: "",
            price: "0",
            description: "",
          }}
          isLoading={false}
          categories={data.categories}
          categoriesIsLoading={false}
          deleteCategory={() => {}}
          onCategorySearch={() => {}}
        />
      </QueryClientProvider>,
    );

    await user.click(screen.getByText("common.submit"));

    await waitFor(() => {
      expect(
        screen.queryByText("services.form.errors.nameError"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("services.form.errors.categoryError"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("services.form.errors.priceError"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("services.form.errors.timeError"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("services.form.errors.descriptionError"),
      ).toBeInTheDocument();
    });
  });

  describe("modal", () => {
    it("should show list of categories", async () => {
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <ServiceForm
            onSubmit={() => {}}
            values={testProps}
            isLoading={false}
            categories={data.categories}
            categoriesIsLoading={false}
            deleteCategory={() => {}}
            onCategorySearch={() => {}}
          />
        </QueryClientProvider>,
      );
      await user.click(screen.getByTestId("combobox-container-input"));
      await user.click(screen.getByText("services.addCategory"));

      await waitFor(() => {
        expect(
          screen.getByText("services.manageCategories"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("category-name-input")).toBeInTheDocument();

        const categories = screen.queryAllByTestId("category-list-item");

        expect(categories.length).toEqual(data.categories.length);
      });
    });

    it("should show error on add new category submit when input is empty", async () => {
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <ServiceForm
            onSubmit={() => {}}
            values={testProps}
            isLoading={false}
            categories={data.categories}
            categoriesIsLoading={false}
            deleteCategory={() => {}}
            onCategorySearch={() => {}}
          />
        </QueryClientProvider>,
      );

      await user.click(screen.getByTestId("combobox-container-input"));
      await user.click(screen.getByText("services.addCategory"));

      await waitFor(async () => {
        const addCategoryForm = screen.getByTestId("add-category-form");

        const button = addCategoryForm.querySelector("button");
        await user.click(button!);

        expect(screen.getByText("common.requiredField")).toBeInTheDocument();
      });
    });

    it("should call deleteCategory props", async () => {
      const deleteCategoryMock = vi.fn();

      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <ServiceForm
            onSubmit={() => {}}
            values={testProps}
            isLoading={false}
            categories={data.categories}
            categoriesIsLoading={false}
            deleteCategory={deleteCategoryMock}
            onCategorySearch={() => {}}
          />
        </QueryClientProvider>,
      );

      await user.click(screen.getByTestId("combobox-container-input"));
      await user.click(screen.getByText("services.addCategory"));

      await waitFor(async () => {
        await user.click(
          screen
            .getAllByTestId("category-list-item")[0]
            .querySelector("button")!,
        );

        expect(deleteCategoryMock).toHaveBeenCalledWith(data.categories[0].id);
      });
    });

    it("should close modal and call onSubmit", async () => {
      const onSubmitMock = vi.fn();

      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <ServiceForm
            onSubmit={onSubmitMock}
            values={testProps}
            isLoading={false}
            categories={data.categories}
            categoriesIsLoading={false}
            deleteCategory={() => {}}
            onCategorySearch={() => {}}
          />
        </QueryClientProvider>,
      );

      await user.click(screen.getByTestId("combobox-container-input"));
      await user.click(screen.getByText("services.addCategory"));
      await user.type(
        screen.getByTestId("category-name-input"),
        "New Category",
      );

      await waitFor(async () => {
        const addCategoryForm = screen.getByTestId("add-category-form");

        const button = addCategoryForm.querySelector("button");
        await user.click(button!);

        expect(onSubmitMock).toHaveBeenCalledWith(
          { name: "New Category" },
          expect.any(Object),
        );
      });
    });

    it("should close modal on close button select", async () => {
      const onSubmitMock = vi.fn();

      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <ServiceForm
            onSubmit={onSubmitMock}
            values={testProps}
            isLoading={false}
            categories={data.categories}
            categoriesIsLoading={false}
            deleteCategory={() => {}}
            onCategorySearch={() => {}}
          />
        </QueryClientProvider>,
      );

      await user.click(screen.getByTestId("combobox-container-input"));
      await user.click(screen.getByText("services.addCategory"));
      await user.click(screen.getByLabelText("common.closeModal"));

      await waitFor(async () => {
        expect(
          screen.queryByText("services.manageCategories"),
        ).not.toBeInTheDocument();
      });
    });
  });
});
