import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";
import { ThemeProvider } from "../../context/ThemeContext";
import React from "react";
import { MdLanguage } from "react-icons/md";

const options = [
  {
    value: "en",
    label: "English",
    icon: (
      <span role="img" aria-label="English">
        🇬🇧
      </span>
    ),
  },
  {
    value: "ru",
    label: "Русский",
    icon: (
      <span role="img" aria-label="Russian">
        🇷🇺
      </span>
    ),
  },
  {
    value: "es",
    label: "Español",
    icon: (
      <span role="img" aria-label="Spanish">
        🇪🇸
      </span>
    ),
  },
];

const meta = {
  title: "Components/Select",
  component: Select,
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
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Select {...args} />,
  args: {
    name: "language",
    label: "Language",
    options,
    value: "en",
  },
};

export const WithIcon: Story = {
  render: (args) => <Select {...args} />,
  args: {
    name: "language",
    label: "Language",
    options,
    value: "en",
    icon: <MdLanguage />,
  },
};
