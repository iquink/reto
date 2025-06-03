import React from "react";
import styles from "./IssueCard.module.css";
import { useTranslation } from "react-i18next";

export interface IssueCardProps {
  id: string | number;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
  coordinates?: { longitude: number; latitude: number };
  photos?: string[];
  onClick?: (id: string | number) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({
  id,
  title,
  description,
  status,
  created_at,
  updated_at,
  coordinates,
  photos,
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={styles.card}
      tabIndex={0}
      role="button"
      onClick={() => onClick?.(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(id);
      }}
    >
      <div className={styles.header}>
        <span className={styles.status + " " + styles[status] || ""}>
          {t(`issueStatus.${status}`)}
        </span>
        <span className={styles.id}>#{id}</span>
      </div>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {coordinates && (
        <div className={styles.coordinates}>
          <strong>Coordinates:</strong> {coordinates.longitude},{" "}
          {coordinates.latitude}
        </div>
      )}
      <div className={styles.dates}>
        <span className={styles.created}>{t("issueCard.createdAt")} {created_at}</span>
        <span className={styles.updated}>{t("issueCard.updatedAt")} {updated_at}</span>
      </div>
      {photos && photos.length > 0 && (
        <div className={styles.photos}>
          {photos.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Issue photo ${idx + 1}`}
              className={styles.photo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { IssueCard };
