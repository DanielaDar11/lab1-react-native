import React from "react";
import styles from "./WinOverlay.module.css";

const WinOverlay = ({ hasWon, restartGame }) => {
  if (!hasWon) return null;

  return (
    <div className={styles.overlay}>
      <img src="/images/trophy.png" alt="Trophy" className={styles.trophy} />

      <h1 className={styles.title}>AŢI CÂŞTIGAT!!!</h1>

      <button onClick={restartGame} className={styles.resetButton}>
        Reset Game
      </button>
    </div>
  );
};

export default WinOverlay;
