import React from "react";
import styles from "./Issue.module.css";
import { useStore } from "@store";
import { observer } from "mobx-react-lite";
import { Map, Select } from "@components/index";
import { pickedLocation } from "@assets/index";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import Lightbox from "yet-another-react-lightbox";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";
import { Status } from "@store/models";

/**
 * Issue page component.
 * Fetches and displays a real issue from the store.
 * @param props - expects an `id` prop for the issue id
 */
const Issue: React.FC<{ id: string | number }> = observer(({ id }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const { issuesStore } = useStore();
  const issueId = id;
  const { t } = useTranslation();

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
    return <div className={styles.container}>{t("loading")}</div>;
  }

  // Gallery: show images if available
  const hasImages = Array.isArray(issue.photos) && issue.photos.length > 0;

  const getImagePath = (filename: string) => {
    return `${import.meta.env.VITE_API_URL || ""}/images/${encodeURIComponent(
      filename
    )}`;
  };

  // Info fields to display above the gallery
  const infoFields = [
    {
      label: t("pages.issue.id"),
      value: issue.id,
    },
    {
      label: t("pages.issue.description"),
      value: issue.description,
    },
    {
      label: t("pages.issue.coordinates"),
      value: issue.coordinates
        ? `${issue.coordinates.x}, ${issue.coordinates.y}`
        : t("pages.issue.noCoordinates"),
    },
    {
      label: t("pages.issue.createdAt"),
      value: new Date(issue.created_at).toLocaleString(),
    },
    {
      label: t("pages.issue.updatedAt"),
      value: new Date(issue.updated_at).toLocaleString(),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.infoSection}>
        {infoFields.map((item, idx) => (
          <div className={styles.infoBlock} key={idx}>
            <strong>{item.label}</strong> {item.value}
          </div>
        ))}
        <div className={styles.infoBlock}>
          <strong>{t("pages.issue.status")}</strong>{" "}
          <Select
            name="status"
            value={issue.status}
            options={Object.values(Status).map((status) => ({
              value: status,
              label: t(`issueStatus.${status}`),
            }))}
            onChange={(newStatus: string) => {
              if (newStatus !== issue.status) {
                issuesStore.updateIssue(id, { status: newStatus });
              }
            }}
            aria-label={t("pages.issue.status")}
            className={styles.statusSelect}
          />
        </div>
      </div>

      {/* Gallery above the map */}
      {hasImages && (
        <>
          <div
            className={styles.gallery}
            role="region"
            aria-label={t("pages.issue.galleryLabel") || "Gallery"}
          >
            {issue.photos.map((filename: string, idx: number) => (
              <div
                className={styles.galleryItem}
                key={filename}
                tabIndex={0}
                aria-label={
                  t("pages.issue.openImage", { index: idx + 1 }) ||
                  `Open image ${idx + 1} in gallery`
                }
                onClick={() => setOpenIndex(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setOpenIndex(idx);
                }}
              >
                <img
                  src={getImagePath(filename)}
                  alt={
                    t("pages.issue.imageAlt", { index: idx + 1 }) ||
                    `Issue image ${idx + 1}`
                  }
                  className={styles.galleryImage}
                  loading="lazy"
                  role="button"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          <Lightbox
            slides={issue.photos.map((filename: string, idx: number) => ({
              src: getImagePath(filename),
              alt:
                t("pages.issue.imageAlt", { index: idx + 1 }) ||
                `Issue image ${idx + 1}`,
            }))}
            open={openIndex !== null}
            index={openIndex ?? 0}
            close={() => setOpenIndex(null)}
            plugins={[Slideshow]}
            aria-label={t("pages.issue.lightboxLabel") || "Image gallery modal"}
          />
        </>
      )}

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
