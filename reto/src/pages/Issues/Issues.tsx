import React from "react";
import { useLocation } from "wouter";
import styles from "./Issues.module.css"; // Add a CSS module for styling
import { Table, Button } from "@components/index";
import { useStore } from "@store/index";
import { observer } from "mobx-react-lite";
import { getFormattedDate } from "./utils";

const Issues: React.FC = observer(() => {
  const [, navigate] = useLocation();

  const handleAddIssue = () => {
    navigate("/issues/add");
  };

  interface Column {
    id: string;
    name: string;
    allowsSorting?: boolean;
  }

  interface RowData {
    id: string;
    [key: string]: any;
  }

  const columns: Column[] = [
    { id: "id", name: "ID", allowsSorting: true },
    { id: "title", name: "Title", allowsSorting: true },
    { id: "created_at", name: "Created At", allowsSorting: true },
    { id: "updated_at", name: "Updated At", allowsSorting: true },
    { id: "status", name: "Status", allowsSorting: true },
  ];

  const [rows, setRows] = React.useState<RowData[]>([]);
  const { issuesStore } = useStore(); // Assuming you have a store to manage issues

  React.useEffect(() => {
    issuesStore.getUserIssues().then(() => {
      setRows(
        issuesStore.userIssues.map((issue) => ({
          id: issue.id.toString(),
          title: issue.title,
          created_at: getFormattedDate(issue.created_at),
          updated_at: getFormattedDate(issue.updated_at),
          status: issue.status,
        }))
      );
    });
  }, [issuesStore]);

  return (
    <div className={styles.container}>
      {rows.length === 0 ? (
        <p className={styles.message}>
          You don't have any issues. Press Add to create one.
        </p>
      ) : (
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
      )}
      <Button onClick={handleAddIssue} className={styles.addButton}>
        Add
      </Button>
    </div>
  );
});

export default Issues;
