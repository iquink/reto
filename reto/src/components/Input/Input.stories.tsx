import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { ThemeProvider } from "../../context/ThemeContext";
import React from "react";

// Meta information for the component
const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Visible label for the input",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the input field",
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default input story
export const Default: Story = {
  args: {
    label: "Default Input",
    placeholder: "Enter text here",
  },
};

// Input with error message
export const WithError: Story = {
  args: {
    label: "Input with Error",
    placeholder: "Enter text here",
    error: { type: "required", message: "Value is required." },
    invalid: true,
  },
};

// Disabled input
export const Disabled: Story = {
  args: {
    label: "Disabled Input",
    placeholder: "Cannot type here",
    isDisabled: true,
  },
};

// Input with children (e.g., icons)
export const WithChildren: Story = {
  args: {
    label: "Input with Icon",
    placeholder: "Search...",
    type: "search",
    children: (
      <span role="img" aria-label="search-icon">
        🔍
      </span>
    ),
  },
};
