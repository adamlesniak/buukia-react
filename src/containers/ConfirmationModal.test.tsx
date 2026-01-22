import { render, screen } from "@testing-library/react";

const ConfirmationModal = await import("./ConfirmationModal");

describe("ConfirmationModal", () => {
  const mockClose = vi.fn();

  beforeEach(() => {
    mockClose.mockClear();
  });

  it("should render correctly and handle actions", () => {
    render(<ConfirmationModal.default close={mockClose} />);

    expect(screen.getByText("settings.modal.deleteTitle")).toBeInTheDocument();
  });

  it("should render description", () => {
    render(<ConfirmationModal.default close={mockClose} />);

    expect(
      screen.getByTestId("confirmation-modal-description"),
    ).toBeInTheDocument();
  });

  it("should call close with false when selecting cancel button", () => {
    render(<ConfirmationModal.default close={mockClose} />);

    screen.getByText("common.cancel").click();

    expect(mockClose).toHaveBeenCalledWith(false);
  });

  it("should call close with true when selecting delete button", () => {
    render(<ConfirmationModal.default close={mockClose} />);

    screen.getByText("common.delete").click();

    expect(mockClose).toHaveBeenCalledWith(true);
  });
});
