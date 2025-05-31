import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./Table";
import { ThemeProvider } from "../../context/ThemeContext";
import React from "react";

const columns: Array<{
  id: keyof (typeof rows)[0];
  name: string;
  allowsSorting: boolean;
}> = [
  { id: "id", name: "ID", allowsSorting: true },
  { id: "title", name: "Title", allowsSorting: true },
  { id: "created_at", name: "Created At", allowsSorting: true },
  { id: "updated_at", name: "Updated At", allowsSorting: true },
  { id: "status", name: "Status", allowsSorting: true },
];

const rows: Array<{
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  status: string;
}> = [
  {
    id: "1",
    title: "First Issue",
    created_at: "2024-05-01",
    updated_at: "2024-05-02",
    status: "open",
  },
  {
    id: "2",
    title: "Second Issue",
    created_at: "2024-05-03",
    updated_at: "2024-05-04",
    status: "closed",
  },
];

const meta = {
  title: "Components/Table",
  component: Table,
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
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table aria-label="Issues Table">
      <Table.Header columns={columns}>
        {columns.map((column) => (
          <Table.Column
            key={column.id}
            id={column.id}
            allowsSorting={column.allowsSorting}
          >
            {column.name}
          </Table.Column>
        ))}
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.id} id={row.id} columns={columns}>
            {columns.map((column) => (
              <Table.Cell key={column.id}>{row[column.id]}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

export const Empty: Story = {
  render: () => (
    <Table aria-label="Empty Table">
      <Table.Header columns={columns}>
        {columns.map((column) => (
          <Table.Column
            key={column.id}
            id={column.id}
            allowsSorting={column.allowsSorting}
          >
            {column.name}
          </Table.Column>
        ))}
      </Table.Header>
      <Table.Body />
    </Table>
  ),
};

export const WithCustomCell: Story = {
  render: () => (
    <Table aria-label="Table with Custom Cell">
      <Table.Header columns={columns}>
        {columns.map((column) => (
          <Table.Column
            key={column.id}
            id={column.id}
            allowsSorting={column.allowsSorting}
          >
            {column.name}
          </Table.Column>
        ))}
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.id} id={row.id} columns={columns}>
            {columns.map((column) => (
              <Table.Cell key={column.id}>
                {column.id === "status" ? (
                  <span
                    style={{ color: row.status === "open" ? "green" : "red" }}
                  >
                    {row[column.id]}
                  </span>
                ) : (
                  row[column.id]
                )}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};
