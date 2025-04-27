import React from "react";
import { render, screen } from "@test-utils/";
import { expect } from "vitest";
import Button from "../Button";

describe("Button Component", () => {
  test("renders Button with primary variant", () => {
    window.matchMedia("(prefers-color-scheme: dark)");
    render(<Button variant="primary">Primary Button</Button>);
    const buttonElement = screen.getByText(/Primary Button/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass("primary");
  });

  test("renders Button with secondary variant", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const buttonElement = screen.getByText(/Secondary Button/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass("secondary");
  });

  test("renders Button with danger variant", () => {
    render(<Button variant="danger">Danger Button</Button>);
    const buttonElement = screen.getByText(/Danger Button/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass("danger");
  });

  test("renders Button with disabled state", () => {
    render(<Button isDisabled>Disabled Button</Button>);
    const buttonElement = screen.getByText(/Disabled Button/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute("disabled");
  });

  test("renders disabled button with correct callback behavior", () => {
    const handleClick = vi.fn();
    render(
      <Button isDisabled onClick={handleClick}>
        Disabled Button
      </Button>
    );
    const buttonElement = screen.getByText(/Disabled Button/i);
    expect(buttonElement).toBeInTheDocument();
    buttonElement.click();
    expect(handleClick).not.toHaveBeenCalled();
  });
});
