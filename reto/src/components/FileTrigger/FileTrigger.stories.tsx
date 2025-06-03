import type { Meta, StoryObj } from "@storybook/react";
import { FileTrigger } from "./FileTrigger";
import { ThemeProvider } from "../../context/ThemeContext";
import React from "react";

const meta = {
  title: "Components/FileTrigger",
  component: FileTrigger,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof FileTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        children: "Select a file",
        allowsMultiple: false,
        acceptedFileTypes: ["image/*"],
        acceptDirectory: false,
        isDisabled: false,
    },
};

