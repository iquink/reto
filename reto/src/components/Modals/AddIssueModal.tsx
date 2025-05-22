import React, { useState, useEffect } from "react";
import { Map } from "@components";
import styles from "./AddIssueModal.module.css";
import { Dialog, DialogTrigger, Modal } from "react-aria-components";
import { Button } from "@components";
import { Button as CloseButton } from "react-aria-components";
import { MdClose } from "react-icons/md";
import { useStore } from "@store";

/**
 * AddIssueModal component displays a modal dialog with a map for selecting coordinates.
 *
 * - Opens a modal when the "Open map" button is clicked.
 * - Loads the map after a short delay for smoother UX.
 * - Allows the user to pick a location on the map, saving coordinates to the issuesStore.
 * - Includes Submit and Cancel buttons, and a close icon in the top-right corner.
 *
 * @component
 * @example
 * ```tsx
 * <AddIssueModal />
 * ```
 */
export const AddIssueModal: React.FC = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { issuesStore } = useStore();

  /**
   * Callback for when a location is picked on the map.
   * Updates the selectedLocation in the issuesStore.
   *
   * @param lat - Latitude of the picked location.
   * @param lng - Longitude of the picked location.
   */
  const setPickedLocation = (lat: number, lng: number) => {
    issuesStore.setSelectedLocation([lat, lng]);
    console.log("Selected location:", issuesStore.selectedLocation);
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
      <Button>Open map</Button>
      <Modal>
        <Dialog className={styles.modal}>
          <CloseButton className={styles.closeButton} slot="close" aria-label="Close">
            <MdClose size={28} />
          </CloseButton>
          <div className={styles.content}>
            <div className={styles.mapWrapper}>
              {isMapLoaded ? (
                <Map isGetCoordinatesByClick setPickedLocation={setPickedLocation} />
              ) : (
                <p>Loading map...</p>
              )}
            </div>
            <div className={styles.buttonContainer}>
              <Button slot="close">Submit</Button>
              <Button slot="close" variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};
