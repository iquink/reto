import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./TextArea";
import { ThemeProvider } from "../../context/ThemeContext";
import React from "react";

// Meta information for the component
const meta = {
  title: "Components/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Visible label for the textarea",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the textarea field",
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the textarea is disabled",
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default textarea story
export const Default: Story = {
  args: {
    label: "Default TextArea",
    placeholder: "Enter your description here",
  },
};

// Textarea with error message
export const WithError: Story = {
  args: {
    label: "TextArea with Error",
    placeholder: "Enter your description here",
    error: { type: "required", message: "Description is required." },
    invalid: true,
  },
};

// Disabled textarea
export const Disabled: Story = {
  args: {
    label: "Disabled TextArea",
    placeholder: "Cannot type here",
    isDisabled: true,
  },
};

// Textarea with children (e.g., icons or additional elements)
export const WithChildren: Story = {
  args: {
    label: "TextArea with Icon",
    placeholder: "Enter your description here",
    children: (
      <span role="img" aria-label="icon">
        ✍️
      </span>
    ),
  },
};
