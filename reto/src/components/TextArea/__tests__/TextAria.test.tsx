import React from "react";
import { render, screen, fireEvent } from "@test-utils/";
import {TextArea} from "../TextArea";

describe("TextArea Component", () => {
  test("renders TextArea with label", () => {
    render(<TextArea name="description" label="Description" />);
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  test("renders TextArea with placeholder", () => {
    render(
      <TextArea
        name="description"
        label="Description"
        placeholder="Enter your description"
      />
    );
    expect(screen.getByPlaceholderText("Enter your description")).toBeInTheDocument();
  });

  test("calls onChange handler when value changes", () => {
    const handleChange = vi.fn();
    render(
      <TextArea
        name="description"
        label="Description"
        onChange={handleChange}
      />
    );
    const textArea = screen.getByRole("textbox");
    fireEvent.change(textArea, { target: { value: "New value" } });
    expect(handleChange).toHaveBeenCalledWith("New value");
  });

  test("displays error message", () => {
    render(
      <TextArea
        name="description"
        label="Description"
        error={{ type: 'required', message: "This field is required" }}
        invalid={true}
      />
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  test("renders disabled TextArea", () => {
    render(
      <TextArea
        name="description"
        label="Description"
        isDisabled={true}
      />
    );
    const textArea = screen.getByRole("textbox");
    expect(textArea).toBeDisabled();
  });
});