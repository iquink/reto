import React from "react";
import { useLocation } from "wouter";
import styles from "./Issues.module.css";
import { IssueCard } from "@components/IssueCard/IssueCard";
import { Button } from "@components/index";
import { useStore } from "@store/index";
import { observer } from "mobx-react-lite";
import { getFormattedDate } from "./utils";
import type { Instance } from "mobx-state-tree";
import { UserIssuesListItemModel } from "@store/models";
import { useTranslation } from "react-i18next";

// TUserIssue type for userIssues
export type TUserIssue = Instance<typeof UserIssuesListItemModel>;

const Issues: React.FC = observer(() => {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  const handleAddIssue = () => {
    navigate("/issues/add");
  };

  const { issuesStore } = useStore();
  const [rows, setRows] = React.useState<TUserIssue[]>([]);

  React.useEffect(() => {
    issuesStore.getUserIssues().then(() => {
      setRows(issuesStore.userIssues.slice());
    });
  }, [issuesStore]);

  return (
    <div className={styles.container}>
      {rows.length === 0 ? (
        <p className={styles.message}>
          {t("pages.issues.noIssues")} {/* Localized no issues message */}
        </p>
      ) : (
        <div className={styles.cardsGrid}>
          {rows.map((row) => (
            <IssueCard
              key={row.id}
              id={row.id}
              title={row.title}
              status={row.status}
              created_at={getFormattedDate(row.created_at)}
              updated_at={getFormattedDate(row.updated_at)}
              onClick={() => navigate(`/issues/${row.id}`)}
            />
          ))}
        </div>
      )}
      <Button onClick={handleAddIssue} className={styles.addButton}>
        {t("pages.issues.createIssue")} {/* Localized add button */}
      </Button>
    </div>
  );
});

export default Issues;
