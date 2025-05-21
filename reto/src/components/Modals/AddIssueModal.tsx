import React, { useState, useEffect } from "react";
import { Map } from "@components";
import styles from "./AddIssueModal.module.css";
import { Dialog, DialogTrigger, Modal } from "react-aria-components";
import Button from "@components/Button/Button";

interface MapContainerWrapperProps {
  width?: string;
  height?: string;
}

export const AddIssueModal: React.FC<MapContainerWrapperProps> = ({
  width = "100%",
  height = "100%",
}) => {
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
          {isMapLoaded ? <Map /> : <p>Loading map...</p>}
          <Button slot="close">Close</Button>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};
