import React from "react";
import { render, screen, fireEvent } from "@test-utils/";
import { expect } from "vitest";
import Switch from "../Switch";

describe("Switch Component", () => {
  test("renders Switch with label", () => {
    render(<Switch label="Enable notifications" />);
    const labelElement = screen.getByText(/Enable notifications/i);
    expect(labelElement).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(<Switch label="Custom Class" className="custom-class" />);
    const switchElement = screen.getByText(/Custom Class/i).closest("label");
    expect(switchElement).toHaveClass("custom-class");
  });

  test("renders disabled Switch", () => {
    render(<Switch label="Disabled Switch" isDisabled />);
    const switchElement = screen.getByText(/Disabled Switch/i).closest("label");
    expect(switchElement).toHaveClass("disabled");
  });

  test("toggles state when clicked", () => {
    const handleChange = vi.fn();
    render(<Switch label="Toggle Switch" onChange={handleChange} />);
    const switchElement = screen.getByText(/Toggle Switch/i).closest("label");

    fireEvent.click(switchElement!);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("does not toggle when disabled", () => {
    const handleChange = vi.fn();
    render(<Switch label="Disabled Toggle" isDisabled onChange={handleChange} />);
    const switchElement = screen.getByText(/Disabled Toggle/i).closest("label");

    fireEvent.click(switchElement!);
    expect(handleChange).not.toHaveBeenCalled();
  });

  test("renders theme switch variant", () => {
    render(<Switch label="Theme Switch" isThemeSwitch />);
    const switchElement = screen.getByText(/Theme Switch/i).closest("label");
    expect(switchElement).toHaveClass("themeSwitch");
  });
});