import React from "react";
import { useLocation } from "wouter";
import { Button } from "@components";
import styles from "./Issues.module.css"; // Add a CSS module for styling

const Issues: React.FC = () => {
  const [, navigate] = useLocation();

  const handleAddIssue = () => {
    navigate("/issues/add");
  };

  return (
    <div className={styles.container}>
      <p className={styles.message}>
        You don't have any issues. Press Add to create one.
      </p>
      <Button onClick={handleAddIssue} className={styles.addButton}>
        Add
      </Button>
    </div>
  );
};

export default Issues;
