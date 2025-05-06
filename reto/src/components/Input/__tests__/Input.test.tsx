import React from "react";
import { render, screen, fireEvent } from "@test-utils/";
import { expect } from "vitest";
import Input from "../Input";

describe("Input Component", () => {
  test("renders Input with label", () => {
    render(<Input label="Email" placeholder="Enter your email" />);
    const labelElement = screen.getByText(/Email/i);
    const inputElement = screen.getByPlaceholderText(/Enter your email/i);

    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  test("renders Input with placeholder", () => {
    render(<Input label="Name" placeholder="Enter your name" />);
    const inputElement = screen.getByPlaceholderText(/Enter your name/i);

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("placeholder", "Enter your name");
  });

  test("renders Input with error message", () => {
    render(
      <Input
        label="Password"
        placeholder="Enter your password"
        errorMessage="Password is required"
      />
    );
    const errorMessageElement = screen.getByText(/Password is required/i);

    expect(errorMessageElement).toBeInTheDocument();
    expect(errorMessageElement).toHaveClass("errorMessage");
  });

  test("renders disabled Input", () => {
    render(
      <Input
        label="Username"
        placeholder="Enter your username"
        isDisabled={true}
      />
    );
    const inputElement = screen.getByPlaceholderText(/Enter your username/i);

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toBeDisabled();
  });

  test("calls onChange handler when typing", () => {
    const handleChange = vi.fn();
    render(
      <Input
        label="Search"
        placeholder="Search here"
        onChange={handleChange}
      />
    );
    const inputElement = screen.getByPlaceholderText(/Search here/i);

    fireEvent.change(inputElement, { target: { value: "Hello" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(inputElement).toHaveValue("Hello");
  });

  test("renders Input with children (e.g., icon)", () => {
    render(
      <Input label="Search" placeholder="Search here">
        <span role="img" aria-label="search-icon">
          🔍
        </span>
      </Input>
    );
    const iconElement = screen.getByLabelText(/search-icon/i);

    expect(iconElement).toBeInTheDocument();
  });
});