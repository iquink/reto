import React from "react";
import { render, screen, fireEvent, waitFor } from "@test-utils/index";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";
import { Select } from "../Select";
import { MdLanguage } from "react-icons/md";

describe("Select Component", () => {
  const options = [
    {
      value: "en-US",
      label: "English",
      icon: <MdLanguage data-testid="icon" />,
    },
    {
      value: "ru-RU",
      label: "Русский",
      icon: <MdLanguage data-testid="icon" />,
    },
    { value: "fi-FI", label: "Suomi", icon: <MdLanguage data-testid="icon" /> },
  ];

  test("renders Select with label and options", () => {
    render(<Select name="lang" label="Language" options={options} />);
    expect(screen.getByText(/Language/i)).toBeInTheDocument();
    // Button should show label before selection
    expect(screen.getByText("Language")).toBeInTheDocument();
  });

  test("opens dropdown and displays all options", async () => {
    const user = userEvent.setup();
    render(<Select name="lang" label="Language" options={options} />);
    // Find the button that opens the dropdown by its accessible name
    const button = screen.getByRole("button", { name: /language/i });
    // Simulate clicking the button to open the dropdown
    await user.click(button);
    // Wait for the dropdown to appear
    for (const option of options) {
      const optionElement = await screen.findByRole("option", {
        name: option.label,
      });
      expect(optionElement).toBeInTheDocument();
    }
  });

  test("calls onChange when option is selected", async () => {
    // Mock the onChange handler
    const handleChange = vi.fn();

    // Render the Select component with test props
    render(
      <Select
        name="lang"
        label="Language"
        options={options}
        onChange={handleChange}
      />
    );

    // Find the button that opens the dropdown by its accessible name
    const button = screen.getByRole("button", { name: /language/i });

    // Simulate clicking the button to open the dropdown
    fireEvent.click(button);

    // Wait for the dropdown to appear
    const dropdown = await screen.findByRole("listbox", { name: /language/i });
    expect(dropdown).toBeInTheDocument();

    // Find the option by role and text
    const option = await screen.findByRole("option", { name: /Русский/i });

    // Simulate clicking the option
    fireEvent.click(option);

    // Assert that the onChange handler was called with the correct value
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith("ru-RU");
    });
  });
  test("renders with selected value", () => {
    render(
      <Select name="lang" label="Language" options={options} value="fi-FI" />
    );
    // Button should show selected label
    const button = screen.getByRole("button", { name: /language/i });
    expect(button).toHaveTextContent("Suomi");
  });

  test("renders disabled Select", () => {
    render(
      <Select name="lang" label="Language" options={options} isDisabled />
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  test("renders option icons when dropdown is opened", () => {
    // Render the component with test data
    render(<Select name="lang" label="Language" options={options} />);

    // Find the button by role and accessible name (e.g., by label)
    const button = screen.getByRole("button", { name: /language/i });

    // Click the button to open the dropdown
    fireEvent.click(button);

    // Check that the dropdown is open (e.g., via attribute or element)
    const dropdown = screen.getByRole("listbox", { name: /language/i });
    expect(dropdown).toBeInTheDocument();

    // Check that icons for options are displayed
    const icons = screen.getAllByTestId("icon");
    expect(icons).toHaveLength(options.length); // Expect as many icons as there are options
  });

  test("applies custom className", () => {
    render(
      <Select
        name="lang"
        label="Language"
        options={options}
        className="custom-class"
      />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });
});
