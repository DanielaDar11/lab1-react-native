import React from "react";
import styles from "./Garbage.module.css";

export default function Garbage({ removeFromInventory, removeFromBigSquare }) {
  const allowDrop = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("item"));

    if (data.from === "inventory" && removeFromInventory) {
      removeFromInventory(data.sourceIndex);
    }

    if (data.from === "bigSquare" && removeFromBigSquare) {
      removeFromBigSquare(data.sourceIndex);
    }
  };

  return (
    <div
      className={styles.garbageContainer}
      onDragOver={allowDrop}
      onDrop={handleDrop}
    >
      <div className={styles.garbageHeader}>🗑️ Garbage</div>
      <div className={styles.garbageBody}></div>
    </div>
  );
}
