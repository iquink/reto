import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";
import { ThemeProvider } from "../../context/ThemeContext";
import React from "react";

// Meta information for the component
const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Visible label for the switch",
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the switch is disabled",
    },
    isThemeSwitch: {
      control: "boolean",
      description: "Whether the switch is used for theme switching",
    },
    onChange: { action: "toggled" },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default switch story
export const Default: Story = {
  args: {
    label: "Default Switch",
  },
};

// Disabled switch story
export const Disabled: Story = {
  args: {
    label: "Disabled Switch",
    isDisabled: true,
  },
};

// Theme switch story
export const ThemeSwitch: Story = {
  args: {
    label: "Theme Switch",
    isThemeSwitch: true,
  },
};

// Custom class switch story
export const CustomClass: Story = {
  args: {
    label: "Custom Class Switch",
    className: "custom-class",
  },
};
