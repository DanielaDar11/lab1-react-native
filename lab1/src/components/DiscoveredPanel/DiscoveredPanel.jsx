import React from "react";
import styles from "./DiscoveredPanel.module.css";
const DiscoveredPanel = ({ discoveredItems, allItems }) => {
  const canCraft = (item) => {
    if (!item.pattern) return false;
    return item.pattern.every((row) =>
      row.every((cell) => {
        if (!cell) return true;
        return discoveredItems.some((d) => d.name === cell);
      })
    );
  };

  const craftableItems = allItems.filter(
    (item) =>
      !discoveredItems.some((d) => d.name === item.name) && canCraft(item)
  );

  if (craftableItems.length === 0) return null;

  return (
    <div className={styles.discoveredPanel}>
      <h4>Ready to craft</h4>
      {craftableItems.map((item) => (
        <div key={item.id} className={styles.craftableItem}>
          <img
            src={item.url}
            alt={item.name}
            className={styles.craftableItemImg}
          />
          <span className={styles.craftableItemText}>{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default DiscoveredPanel;
