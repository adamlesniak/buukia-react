import { render, screen } from "@testing-library/react";
import Header from "./Header";

test("Renders the main page", () => {
  const testMessage = "Header";
  render(<Header />);
  expect(screen.getByText(testMessage)).toBeInTheDocument();
});
