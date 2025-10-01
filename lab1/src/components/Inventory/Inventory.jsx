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

    function handleDrop(e, targetIndex) {
      e.preventDefault();

      const data = e.dataTransfer.getData("item");
      const parsed = JSON.parse(data);
      const item = parsed.item;
      const sourceIndex = parsed.sourceIndex;
      const from = parsed.from;

      setSquares(function (prev) {
        const newSquares = [...prev];

        if (from === "bigSquare") {
          if (newSquares[targetIndex]) {
            const temp = newSquares[targetIndex];
            newSquares[targetIndex] = item;
            if (moveToBigSquare) moveToBigSquare(temp, sourceIndex);
          } else {
            newSquares[targetIndex] = item;
            if (moveToBigSquare) moveToBigSquare(null, sourceIndex);
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

      setInventoryTrigger(function (prev) {
        return prev + 1;
      });
    }

    function addItem(item) {
      const firstEmpty = squares.findIndex(function (s) {
        return s === null;
      });

      const newSquares = [...squares];
      // daca am gasit o pozitie null
      if (firstEmpty !== -1) {
        newSquares[firstEmpty] = item;
      } else {
        newSquares.push(item);
      }
      setSquares(newSquares);
      if (setInventoryTrigger) {
        setInventoryTrigger(function (prev) {
          return prev + 1;
        });
      }
    }

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
