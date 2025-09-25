import React from "react";
import styles from "./Square.module.css";

function Square({ imgUrl, onClick }) {
  return (
    <div className={styles.square} onClick={onClick}>
      {imgUrl && <img src={imgUrl} alt="" className={styles.squareImg} />}
    </div>
  );
}

export default Square;
