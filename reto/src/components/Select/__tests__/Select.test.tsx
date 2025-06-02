import React from "react";
import { render, screen, fireEvent } from "@test-utils/";
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

  // test("renders Select with label and options", () => {
  //   render(<Select name="lang" label="Language" options={options} />);
  //   expect(screen.getByText(/Language/i)).toBeInTheDocument();
  //   // Button should show label before selection
  //   expect(screen.getByText("Language")).toBeInTheDocument();
  // });

  // test("opens dropdown and displays all options", () => {
  //   render(<Select name="lang" label="Language" options={options} />);
  //   const button = screen.getByRole("button");
  //   fireEvent.click(button);
  //   options.forEach((opt) => {
  //     expect(screen.getByText(opt.label)).toBeInTheDocument();
  //   });
  // });

  test("calls onChange when option is selected", () => {
    const handleChange = vi.fn();
    render(
      <Select
        name="lang"
        label="Language"
        options={options}
        onChange={handleChange}
      />
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const option = screen.getByText("Русский");
    fireEvent.click(option);
    expect(handleChange).toHaveBeenCalledWith("ru-RU");
  });

  test("renders with selected value", () => {
    render(
      <Select name="lang" label="Language" options={options} value="fi-FI" />
    );
    // Button should show selected label
    expect(screen.getByText("Suomi")).toBeInTheDocument();
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
