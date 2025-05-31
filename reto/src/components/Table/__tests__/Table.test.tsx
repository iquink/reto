import React from "react";
import { render, screen, fireEvent } from "@test-utils/";
import { expect } from "vitest";
import { Table } from "../Table";

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

describe("Table Component", () => {
  test("renders table with columns and rows", () => {
    render(
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
    );
    columns.forEach((col) => {
      expect(screen.getByText(col.name)).toBeInTheDocument();
    });
    rows.forEach((row) => {
      expect(screen.getByText(row.title)).toBeInTheDocument();
      expect(screen.getByText(row.status)).toBeInTheDocument();
    });
  });

  test("renders empty table body", () => {
    render(
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
    );
    columns.forEach((col) => {
      expect(screen.getByText(col.name)).toBeInTheDocument();
    });
    expect(screen.queryByText("First Issue")).not.toBeInTheDocument();
  });

  test("renders custom cell content", () => {
    render(
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
                      data-testid="status-span"
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
    );
    expect(screen.getAllByTestId("status-span")[0]).toHaveTextContent("open");
    expect(screen.getAllByTestId("status-span")[1]).toHaveTextContent("closed");
  });

  test("renders sort indicators for sortable columns", () => {
    render(
      <Table aria-label="Sortable Table">
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
    );
    // Sort indicators are present (arrows)
    expect(screen.getAllByText("▼").length).toBeGreaterThan(0);
  });

  test("calls onRowAction when row is clicked", () => {
    const handleRowAction = vi.fn();
    render(
      <Table aria-label="Clickable Table" onRowAction={handleRowAction}>
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
    );
    const firstRow = screen.getByText("First Issue").closest("tr");
    if (firstRow) fireEvent.click(firstRow);
    expect(handleRowAction).toHaveBeenCalled();
  });
});
