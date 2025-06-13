import React, { useEffect } from "react";
import { useStore } from "@store/index";
import { observer } from "mobx-react-lite";
import { Table } from "@components/index";

const columns = [
  { id: "username", name: "Username" },
  { id: "email", name: "Email" },
  { id: "role", name: "Role" },
  { id: "isActive", name: "Active" },
  { id: "createdAt", name: "Created At" },
  { id: "updatedAt", name: "Updated At" },
];

const Admin: React.FC = observer(() => {
  const { adminStore } = useStore();

  useEffect(() => {
    adminStore.getUsers();
  }, [adminStore]);

  return (
    <div>
      <Table aria-label="Users Table">
        <Table.Header columns={columns}>
          {columns.map((column) => (
            <Table.Column
              key={column.id}
              id={column.id}
            >
              <span>{column.name}</span>
            </Table.Column>
          ))}
        </Table.Header>
        <Table.Body>
          {adminStore?.users.map((user) => (
            <Table.Row key={user.username} id={user.username} columns={columns}>
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell>{user.isActive ? "Active" : "Inactive"}</Table.Cell>
              <Table.Cell>{user.createdAt}</Table.Cell>
              <Table.Cell>{user.updatedAt}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
});

export default Admin;
