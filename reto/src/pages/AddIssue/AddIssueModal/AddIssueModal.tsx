import React, { useState, useEffect } from "react";
import { Map } from "@components";
import styles from "./AddIssueModal.module.css";
import { Dialog, DialogTrigger, Modal } from "react-aria-components";
import { Button } from "@components";
import { Button as CloseButton } from "react-aria-components";
import { MdClose } from "react-icons/md";
import { useStore } from "@store";
import L, { LatLngExpression } from "leaflet";
import { pickedLocation } from "@assets/index";
import { MdOutlineMap as GoToMapIcon } from "react-icons/md";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

/**
 * AddIssueModal component displays a modal dialog with a map for selecting coordinates.
 *
 * - Opens a modal when the map button is clicked.
 * - Loads the map after a short delay for smoother UX.
 * - Allows the user to pick a location on the map, saving coordinates to the issuesStore.
 * - Calls the optional `onCoordinatesChanged` callback when coordinates are picked.
 * - Includes Submit and Cancel buttons, and a close icon in the top-right corner.
 *
 * @component
 * @param {Object} props
 * @param {(coords: [number, number]) => void} [props.onCoordinatesChanged] - Optional callback called when coordinates are picked.
 * @example
 * ```tsx
 * <AddIssueModal onCoordinatesChanged={(coords) => console.log(coords)} />
 * ```
 */
export const AddIssueModal: React.FC<{
  onCoordinatesChanged?: (coords: [number, number]) => void;
}> = observer(({ onCoordinatesChanged }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [markers, setMarkers] = useState<{ [name: string]: [LatLngExpression, L.Icon] }>({});
  const { issuesStore } = useStore();
  const { t } = useTranslation();

  /**
   * Callback for when a location is picked on the map.
   * Updates the selectedLocation in the issuesStore and calls onCoordinatesChanged if provided.
   *
   * @param lat - Latitude of the picked location.
   * @param lng - Longitude of the picked location.
   */
  const setPickedLocation = (lat: number, lng: number) => {
    issuesStore.setSelectedLocation([lat, lng]);
    if (onCoordinatesChanged) {
      onCoordinatesChanged([lat, lng]);
    }
    setMarkers({
      pickedLocation: [
        [lat, lng],
        L.icon({ iconUrl: pickedLocation, iconSize: [32, 32], iconAnchor: [16, 32] }),
      ],
    });
  };

  // Load the map after a short delay for smoother modal animation.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 300);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  return (
    <DialogTrigger>
      <Button variant="icon" aria-label={t("modals.addIssue.openMap")}> {/* Accessible label for open map */}
        <GoToMapIcon />
      </Button>
      <Modal>
        <Dialog className={styles.modal}>
          <CloseButton className={styles.closeButton} slot="close" aria-label={t("modals.addIssue.close")}> {/* Localized close label */}
            <MdClose size={28} />
          </CloseButton>
          <div className={styles.content}>
            <div className={styles.mapWrapper}>
              {isMapLoaded ? (
                <Map isGetCoordinatesByClick setPickedLocation={setPickedLocation} markers={markers} />
              ) : (
                <p>{t("modals.addIssue.loadingMap")}</p>
              )}
            </div>
            <div className={styles.buttonContainer}>
              <Button slot="close">{t("modals.addIssue.submit")}</Button>
              <Button slot="close" variant="secondary">
                {t("modals.addIssue.cancel")}
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
});
