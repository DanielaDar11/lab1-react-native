import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import Resources from "./components/Resources/Resources";
import Inventory from "./components/Inventory/Inventory";
import Square from "./components/Square/Square";
import Garbage from "./components/Garbage/Garbage";
import BigSquare from "./components/BigSquare/BigSquare";
import DiscoveredItems from "./components/DiscoveredItems/DiscoveredItems";
import recipesData from "./data/recipies.json";
import DiscoveredPanel from "./components/DiscoveredPanel/DiscoveredPanel";
import WinOverlay from "./components/WinOverlay/WinOverlay";

function App() {
  const inventoryRef = useRef();

  const [bigSquareItems, setBigSquareItems] = useState(() => {
    const saved = localStorage.getItem("bigSquareItems");
    return saved
      ? JSON.parse(saved)
      : Array(3)
          .fill(null)
          .map(() => Array(3).fill(null));
  });

  const [discoveredItems, setDiscoveredItems] = useState(() => {
    const saved = localStorage.getItem("discoveredItems");
    if (saved) return JSON.parse(saved);
    return [
      { name: "Microcip", url: "/images/res/microcip.png" },
      { name: "Rezistor", url: "/images/res/rezistor.png" },
      { name: "Condensator", url: "/images/res/condensator.png" },
    ];
  });

  const [inventoryTrigger, setInventoryTrigger] = useState(0);
  const [craftedItemUrl, setCraftedItemUrl] = useState(null);
  const [craftedItemName, setCraftedItemName] = useState(null);
  const [hasWon, setHasWon] = useState(false);

  const checkPattern = (grid) => {
    for (let recipe of recipesData) {
      let match = true;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const patternItem = recipe.pattern[r][c];
          const gridItem = grid[r][c]?.name || null;
          if (patternItem && patternItem !== gridItem) {
            match = false;
          }
        }
      }
      if (match) return recipe;
    }
    return null;
  };

  useEffect(() => {
    localStorage.setItem("bigSquareItems", JSON.stringify(bigSquareItems));
  }, [bigSquareItems]);

  useEffect(() => {
    localStorage.setItem("discoveredItems", JSON.stringify(discoveredItems));
  }, [discoveredItems]);

  useEffect(() => {
    if (inventoryRef.current) {
      const items = inventoryRef.current.getItems();
      localStorage.setItem("inventoryItems", JSON.stringify(items));
    }
  }, [inventoryTrigger]);

  const updateBigSquare = (newGrid) => {
    setBigSquareItems(newGrid);

    const matchedRecipe = checkPattern(newGrid);

    if (matchedRecipe) {
      setCraftedItemUrl(matchedRecipe.url);
      setCraftedItemName(matchedRecipe.name);
    } else {
      setCraftedItemUrl(null);
      setCraftedItemName(null);
    }
  };

  const addItemToBigSquare = (item, inventoryIndex) => {
    const newGrid = bigSquareItems.map((row) => [...row]);
    const flat = newGrid.flat();
    const targetIndex = flat.findIndex((i) => !i);
    if (targetIndex === -1) return;

    const row = Math.floor(targetIndex / 3);
    const col = targetIndex % 3;
    newGrid[row][col] = item;

    if (inventoryRef.current) inventoryRef.current.removeItem(inventoryIndex);

    updateBigSquare(newGrid);
    setInventoryTrigger((prev) => prev + 1);
  };

  const handleClickBigSquare = (item, index) => {
    if (inventoryRef.current && item) {
      inventoryRef.current.addItem(item);
    }

    const newGrid = bigSquareItems.map((row) => [...row]);
    const row = Math.floor(index / 3);
    const col = index % 3;
    newGrid[row][col] = null;

    updateBigSquare(newGrid);
  };

  const handleDropItem = (targetIndex, item, sourceIndex, from) => {
    const newGrid = bigSquareItems.map((row) => [...row]);
    const row = Math.floor(targetIndex / 3);
    const col = targetIndex % 3;

    if (from === "bigSquare") {
      const sourceRow = Math.floor(sourceIndex / 3);
      const sourceCol = sourceIndex % 3;
      if (targetIndex !== sourceIndex) {
        const temp = newGrid[row][col];
        newGrid[row][col] = item;
        newGrid[sourceRow][sourceCol] = temp || null;
      }
    } else if (from === "inventory") {
      const oldItem = newGrid[row][col];
      newGrid[row][col] = item;

      if (oldItem && inventoryRef.current) {
        inventoryRef.current.setItemAt(sourceIndex, oldItem);
      } else if (sourceIndex !== undefined) {
        inventoryRef.current.removeItem(sourceIndex);
      }
    }

    updateBigSquare(newGrid);
    setInventoryTrigger((prev) => prev + 1);
  };

  const restartGame = () => {
    setBigSquareItems(
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(null))
    );
    setDiscoveredItems([
      { name: "Microcip", url: "/images/res/microcip.png" },
      { name: "Rezistor", url: "/images/res/rezistor.png" },
      { name: "Condensator", url: "/images/res/condensator.png" },
    ]);

    if (inventoryRef.current)
      inventoryRef.current.setInventory(Array(24).fill(null));

    localStorage.removeItem("bigSquareItems");
    localStorage.removeItem("discoveredItems");
    localStorage.removeItem("inventoryItems");

    setCraftedItemName(null);
    setCraftedItemUrl(null);
    setInventoryTrigger((prev) => prev + 1);
    setHasWon(false);
  };

  const handleRemoveFromInventory = (index) => {
    if (inventoryRef.current) inventoryRef.current.removeItem(index);
    setInventoryTrigger((prev) => prev + 1);
  };

  const handleRemoveFromBigSquare = (index) => {
    const newGrid = bigSquareItems.map((row) => [...row]);
    const row = Math.floor(index / 3);
    const col = index % 3;
    newGrid[row][col] = null;
    updateBigSquare(newGrid);
  };

  const savedInventory =
    JSON.parse(localStorage.getItem("inventoryItems")) || Array(24).fill(null);

  const clearInventory = () => {
    if (inventoryRef.current)
      inventoryRef.current.setInventory(Array(24).fill(null));
    setInventoryTrigger((prev) => prev + 1);
  };

  const handleCraftItem = () => {
    if (!craftedItemUrl || !inventoryRef.current) return;

    const matchedRecipe = recipesData.find((r) => r.name === craftedItemName);
    if (!matchedRecipe) return;

    const newItem = {
      name: craftedItemName,
      url: craftedItemUrl,
      description: matchedRecipe.description,
      recipe: bigSquareItems,
    };

    inventoryRef.current.addItem({
      name: craftedItemName,
      url: craftedItemUrl,
    });

    setDiscoveredItems((prev) => {
      if (prev.some((item) => item.name === craftedItemName)) return prev;
      const newDiscovered = [...prev, newItem];
      if (craftedItemName === "Jucărie electronică") setHasWon(true);
      return newDiscovered;
    });

    setCraftedItemUrl(null);
    setCraftedItemName(null);
    setBigSquareItems(
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(null))
    );
    setInventoryTrigger((prev) => prev + 1);
  };

  return (
    <>
      <h2>Crafting</h2>
      <WinOverlay hasWon={hasWon} restartGame={restartGame} />

      <div className="mainContainer">
        <DiscoveredPanel
          discoveredItems={discoveredItems}
          allItems={recipesData}
        />

        <DiscoveredItems discoveredItems={discoveredItems} />

        <div className="craftingSection">
          <BigSquare
            gridItems={bigSquareItems}
            onDropItem={handleDropItem}
            onClickSquare={handleClickBigSquare}
          />
          <span className="arrow">&rarr;</span>
          <Square
            className="craftedSquare"
            imgUrl={craftedItemUrl}
            onClick={handleCraftItem}
          />
        </div>

        <div className="bottomPanel">
          <Resources inventoryRef={inventoryRef} />
          <Inventory
            ref={inventoryRef}
            addItemToBigSquare={addItemToBigSquare}
            initialInventory={savedInventory}
            setInventoryTrigger={setInventoryTrigger}
            moveToBigSquare={(item, index) => {
              const newGrid = bigSquareItems.map((row) => [...row]);
              if (index !== undefined) {
                const row = Math.floor(index / 3);
                const col = index % 3;
                newGrid[row][col] = item;
                updateBigSquare(newGrid);
              }
            }}
            removeFromBigSquare={handleRemoveFromBigSquare}
          />
          <div className="rightPanel">
            <Garbage
              removeFromInventory={handleRemoveFromInventory}
              removeFromBigSquare={handleRemoveFromBigSquare}
            />
            <button className="btnRed" onClick={restartGame}>
              Restart Game
            </button>
            <button className="btnBlue" onClick={clearInventory}>
              Clear Inventory
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
