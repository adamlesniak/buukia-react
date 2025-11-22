import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Combobox } from "./Combobox";

const mockItems = Array.from({ length: 5 }).map((_) => {
  const value = faker.person.fullName();
  const item = {
    id: faker.string.uuid(),
    name: value,
    value: value,
  };

  return item;
});

const user = userEvent.setup();

describe("Combobox Component", () => {
  it("renders the initial dropdown", () => {
    render(<Combobox items={mockItems} />);

    const inputElement = screen.getByRole("combobox");

    expect(inputElement).toBeInTheDocument();
  });

  it("renders initial prompt", () => {
    render(<Combobox items={mockItems} />);

    const inputElement = screen.getByPlaceholderText("Please select an item.");

    expect(inputElement).toBeInTheDocument();
  });

  it("should not render the dropdown when it's closed", () => {
    render(<Combobox items={mockItems} />);

    const dropdown = screen.queryByTestId("combobox-dropdown");

    expect(dropdown).not.toBeInTheDocument();
  });

  it("should render the dropdown with items when it's open", async () => {
    render(<Combobox items={mockItems} />);

    await user.click(screen.getByTestId("combobox-container-input"));

    const dropdown = screen.queryByTestId("combobox-dropdown");
    const items = screen
      .queryByTestId("combobox-dropdown")
      ?.querySelectorAll("li");

    expect(dropdown).toBeInTheDocument();
    expect(items?.length).toBe(mockItems.length);
  });

  it("should select the item when selected", async () => {
    render(<Combobox items={mockItems} />);

    await user.click(screen.getByTestId("combobox-container-input"));

    const dropdown = screen.queryByTestId("combobox-dropdown");
    const item = screen
      .queryByTestId("combobox-dropdown")
      ?.querySelectorAll("li")[0];

    if (!item) {
      throw Error("Item not found");
    }

    await user.click(item);

    expect(dropdown).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Please select an item.")).toHaveValue(
      item.textContent || "",
    );
  });

  it("should render the search input", async () => {
    render(<Combobox search={true} items={mockItems} />);

    await user.click(screen.getByTestId("combobox-container-input"));

    const search = screen.getByTestId("combobox-dropdown");

    expect(search).toBeInTheDocument();
    expect(search.querySelector('svg')).toBeInTheDocument();
  });
});
