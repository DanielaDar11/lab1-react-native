import React from "react";
import Square from "./../Square/Square";
import styles from "./BigSquare.module.css";

const BigSquare = ({ gridItems, onDropItem, onClickSquare }) => {
  const flatItems = gridItems.flat();

  const allowDrop = (e) => e.preventDefault();

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const { item, sourceIndex, from } = JSON.parse(
      e.dataTransfer.getData("item")
    );
    if (sourceIndex === targetIndex && from === "bigSquare") return;
    onDropItem(targetIndex, item, sourceIndex, from);
  };

  return (
    <div className={styles.bigSquare}>
      {flatItems.map((item, index) => (
        <div
          key={index}
          draggable={!!item}
          onDragOver={allowDrop}
          onDrop={(e) => handleDrop(e, index)}
          onDragStart={(e) => {
            if (!item) return;
            e.dataTransfer.setData(
              "item",
              JSON.stringify({ item, sourceIndex: index, from: "bigSquare" })
            );
          }}
          onClick={() => item && onClickSquare && onClickSquare(item, index)}
        >
          <Square imgUrl={item ? item.url : null} />
        </div>
      ))}
    </div>
  );
};

export default BigSquare;
