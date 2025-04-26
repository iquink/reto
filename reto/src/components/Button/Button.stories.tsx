import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

// Meta information for the component
const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
      description: "Button variant",
    },
    onClick: { action: "clicked" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary button story
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

// Secondary button story
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

// Danger button story
export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Danger Button",
  },
};

// Disabled button story
export const Disabled: Story = {
  args: {
    variant: "primary",
    children: "Disabled Button",
    disabled: true,
  },
};

// Button with custom width
export const CustomWidth: Story = {
  args: {
    variant: "primary",
    children: "Wide Button",
    style: { width: "300px" },
  },
};
