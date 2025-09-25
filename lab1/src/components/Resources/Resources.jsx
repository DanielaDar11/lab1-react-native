import React, { useEffect, useState } from "react";
import itemsData from "./../../data/items.json";
import Square from "./../Square/Square";
import styles from "./Resources.module.css";

export default function Resources({ inventoryRef }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(itemsData);
  }, []);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  const handleClick = (item) => {
    if (inventoryRef.current) inventoryRef.current.addItem(item);
  };

  return (
    <div className={styles.resourcesContainer}>
      <div className={styles.resourcesHeader}>Resources</div>
      <div className={styles.resourcesItems}>
        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onClick={() => handleClick(item)}
          >
            <Square imgUrl={item.url} />
          </div>
        ))}
      </div>
    </div>
  );
}
