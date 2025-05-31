import React from "react";
import styles from "./Issue.module.css";
import { useStore } from "@store";
import { observer } from "mobx-react-lite";
import { Map } from "@components/index";
import { pickedLocation } from "@assets/index";
import L from "leaflet";

/**
 * Issue page component.
 * Fetches and displays a real issue from the store.
 * @param props - expects an `id` prop for the issue id
 */
const Issue: React.FC<{ id: string | number }> = observer(({ id }) => {
  const { issuesStore } = useStore();
  const issueId = id;

  React.useEffect(() => {
    if (issueId) {
      issuesStore.getIssueById(Number(issueId));
    }
    return () => {
      issuesStore.clearCurrentIssue(); // Clear the current issue when component unmounts
    };
  }, [issueId, issuesStore]);

  const issue = issuesStore.currentIssue;

  if (!issue) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{issue.title}</h1>
      <p>
        <strong>ID:</strong> {issue.id}
      </p>
      <p>
        <strong>Description:</strong> {issue.description}
      </p>
      <p>
        <strong>Coordinates:</strong>{" "}
        {issue.coordinates
          ? `${issue.coordinates.x}, ${issue.coordinates.y}`
          : "-"}
      </p>
      <p>
        <strong>Created at:</strong>{" "}
        {new Date(issue.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Updated at:</strong>{" "}
        {new Date(issue.updated_at).toLocaleString()}
      </p>
      {/* TODO: Render photos if available */}
      <div className={styles.mapWrapper}>
        <Map
          center={
            issue.coordinates
              ? [issue.coordinates.y, issue.coordinates.x]
              : undefined
          }
          markers={{
            [`issue-${issue.id}`]: [
              [issue.coordinates.y, issue.coordinates.x],
              L.icon({
                iconUrl: pickedLocation,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
              }),
            ],
          }}
          isGetCoordinatesByClick={false}
        />
      </div>
    </div>
  );
});

export default Issue;
