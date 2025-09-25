import React, { useState } from "react";
import Square from "../Square/Square";
import writing from "./../../image/writing.png";
import styles from "./DiscoveredItems.module.css";

const ingredientImages = {
  Microcip: "/images/res/microcip.png",
  Rezistor: "/images/res/rezistor.png",
  Condensator: "/images/res/condensator.png",
  "Placa de circuit": "/images/res/placa_de_circuit.png",
  "Senzor temperatură": "/images/res/senzor.png",
  "Circuit LED": "/images/res/circuit_led.png",
  Microcontroller: "/images/res/microcontroller.png",
  "Robot mind": "/images/res/robot-mind.png",
  "Automatizare casă": "/images/res/automatizare.png",
  Dronă: "/images/res/drone.png",
  "Jucărie electronică": "/images/res/electric-car.png",
};

const ItemRecipe = ({ recipe }) => (
  <div className={styles.itemRecipe}>
    {recipe?.flat().map((ing, i) => (
      <Square
        key={i}
        imgUrl={ing ? ing.url || ingredientImages[ing.name] : null}
      />
    ))}
  </div>
);

const DiscoveredItem = ({ item }) => (
  <li className={styles.discoveredItem}>
    <Square imgUrl={item.url} />
    <h4>{item.name}</h4>
    <p>{item.description}</p>
    <ItemRecipe recipe={item.recipe} />
  </li>
);

const DiscoveredItemList = ({ items }) =>
  items.length === 0 ? (
    <p className={styles.emptyMessage}>Nu ai descoperit încă obiecte.</p>
  ) : (
    <ul className={styles.itemList}>
      {items.map((item, index) => (
        <DiscoveredItem key={index} item={item} />
      ))}
    </ul>
  );

const DiscoveredItems = ({ discoveredItems }) => {
  const [expanded, setExpanded] = useState(false);

  const filteredItems = discoveredItems.filter(
    (item) =>
      item.name !== "Microcip" &&
      item.name !== "Rezistor" &&
      item.name !== "Condensator"
  );

  return (
    <>
      <div className={styles.toggleButton} onClick={() => setExpanded(true)}>
        <img src={writing} alt="writing" />
      </div>

      {expanded && (
        <div className={styles.panelOverlay}>
          <div className={styles.panelContent}>
            <div
              className={styles.closeButton}
              onClick={() => setExpanded(false)}
            >
              ✕
            </div>
            <h3>Discovered Items</h3>
            <DiscoveredItemList items={filteredItems} />
          </div>
        </div>
      )}
    </>
  );
};

export default DiscoveredItems;
