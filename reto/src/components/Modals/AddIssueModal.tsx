import React, { useState, useEffect } from "react";
import { Map } from "@components";
import styles from "./AddIssueModal.module.css";
import { Dialog, DialogTrigger, Modal } from "react-aria-components";
import { Button } from "@components";
import { Button as CloseButton } from "react-aria-components"
import { MdClose } from "react-icons/md";

export const AddIssueModal: React.FC = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1000);

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
              {isMapLoaded ? <Map isGetCoordinatesByClick /> : <p>Loading map...</p>}
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
