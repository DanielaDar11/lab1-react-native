import React, { useState, forwardRef, useImperativeHandle } from "react";
import Square from "./../Square/Square";
import styles from "./Inventory.module.css";
const Inventory = forwardRef(
  (
    {
      addItemToBigSquare,
      initialInventory = [],
      setInventoryTrigger,
      moveToBigSquare,
    },
    ref
  ) => {
    const [squares, setSquares] = useState(initialInventory);

    const allowDrop = (e) => e.preventDefault();

    const handleDrop = (e, targetIndex) => {
      e.preventDefault();
      const { item, sourceIndex, from } = JSON.parse(
        e.dataTransfer.getData("item")
      );
      setSquares((prev) => {
        const newSquares = [...prev];

        if (from === "bigSquare") {
          if (targetIndex === sourceIndex) return newSquares;
          if (newSquares[targetIndex]) {
            const temp = newSquares[targetIndex];
            newSquares[targetIndex] = item;
            moveToBigSquare && moveToBigSquare(temp, sourceIndex);
          } else {
            newSquares[targetIndex] = item;
            moveToBigSquare && moveToBigSquare(null, sourceIndex);
          }
        } else {
          if (newSquares[targetIndex] && sourceIndex !== undefined) {
            const temp = newSquares[targetIndex];
            newSquares[targetIndex] = newSquares[sourceIndex];
            newSquares[sourceIndex] = temp;
          } else {
            newSquares[targetIndex] = item;
            if (sourceIndex !== undefined) newSquares[sourceIndex] = null;
          }
        }

        return newSquares;
      });

      setInventoryTrigger && setInventoryTrigger((prev) => prev + 1);
    };

    const addItem = (item) => {
      const firstEmpty = squares.findIndex((s) => !s);
      const newSquares = [...squares];
      if (firstEmpty !== -1) newSquares[firstEmpty] = item;
      else newSquares.push(item);
      setSquares(newSquares);
      setInventoryTrigger && setInventoryTrigger((prev) => prev + 1);
    };

    useImperativeHandle(ref, () => ({
      addItem,
      removeItem: (index) => {
        const newSquares = [...squares];
        newSquares[index] = null;
        setSquares(newSquares);
        setInventoryTrigger && setInventoryTrigger((prev) => prev + 1);
      },
      getItems: () => squares,
      setInventory: (newInventory) => setSquares(newInventory),
      setItemAt: (index, item) => {
        const newSquares = [...squares];
        newSquares[index] = item;
        setSquares(newSquares);
      },
    }));

    return (
      <div className={styles.inventoryContainer}>
        {squares.map((item, index) => (
          <div
            key={index}
            className={styles.inventorySquare}
            draggable={!!item}
            onDragOver={allowDrop}
            onDrop={(e) => handleDrop(e, index)}
            onDragStart={(e) => {
              if (!item) return;
              e.dataTransfer.setData(
                "item",
                JSON.stringify({ item, sourceIndex: index, from: "inventory" })
              );
            }}
            onClick={() => item && addItemToBigSquare(item, index)}
          >
            <Square imgUrl={item ? item.url : null} />
          </div>
        ))}
      </div>
    );
  }
);

export default Inventory;
