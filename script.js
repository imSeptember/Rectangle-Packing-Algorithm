const container = document.querySelector(".container");
const colorMap = new Map(); // Map to store colors based on dimensions

function rectanglePacking(arrayWithBlocks, containerSize) {
  // Generate container
  function containerGeneration(value) {
    container.style.width = containerSize.width + "px";
    container.style.height = containerSize.height + "px";
  }

  // Sort blocks by height in descending order
  arrayWithBlocks.sort((a, b) => b.height - a.height);

  // Function to pack rectangles using Bottom-Left algorithm
  function packRectangles(rectangles) {
    let currentX = 0;
    let currentY = 0;
    let maxHeightInCurrentRow = 0;

    // Array to store the height of each column on the bottom level
    const bottomLevelHeights = new Array(containerSize.width).fill(0);

    rectangles.forEach((rect) => {
      // Find the column with the minimum height on the bottom level
      const minColumn = bottomLevelHeights.indexOf(
        Math.min(...bottomLevelHeights)
      );

      if (currentX + rect.width <= containerSize.width) {
        // Pack the rectangle at the current position
        rect.x = currentX;
        rect.y = currentY;

        // Update the currentX position for the next rectangle
        currentX += rect.width;

        // Update the bottomLevelHeights for the columns covered by the rectangle
        for (let i = rect.x; i < rect.x + rect.width; i++) {
          bottomLevelHeights[i] = currentY + rect.height;
        }

        // Update the maxHeightInCurrentRow
        if (rect.height > maxHeightInCurrentRow) {
          maxHeightInCurrentRow = rect.height;
        }
      } else {
        // Move to the next row
        currentX = minColumn;
        currentY = Math.min(...bottomLevelHeights); // Use the minimum height on the bottom level

        // Pack the rectangle at the new position
        rect.x = currentX;
        rect.y = currentY;

        // Update the currentX position for the next rectangle
        currentX += rect.width;

        // Update the bottomLevelHeights for the columns covered by the rectangle
        for (let i = rect.x; i < rect.x + rect.width; i++) {
          bottomLevelHeights[i] = currentY + rect.height;
        }

        // Reset maxHeightInCurrentRow for the new row
        maxHeightInCurrentRow = rect.height;
      }
    });
  }

  // Function to display rectangles in the container
  function displayRectangles(rectangles) {
    rectangles.forEach((rect, index) => {
      const block = document.createElement("div");
      block.style.width = rect.width + "px";
      block.style.height = rect.height + "px";
      block.style.position = "absolute";

      // Set color to block based on dimensions
      const dimensionsKey = `${rect.width}-${rect.height}`;
      if (!colorMap.has(dimensionsKey)) {
        colorMap.set(dimensionsKey, getRandomColor());
      }
      block.style.backgroundColor = colorMap.get(dimensionsKey);

      // Set top property based on container height and rectangle y-coordinate
      block.style.top = containerSize.height - rect.y - rect.height + "px";
      block.style.left = rect.x + "px";

      // Add a number label to each block
      const label = document.createElement("div");
      label.textContent = index + 1; // Adding 1 to start numbering from 1
      label.className = "block-label";

      // Add block to container and label to block
      container.appendChild(block);
      block.appendChild(label);
    });
  }

  // Set container size
  containerGeneration(containerSize);

  // Pack rectangles using the Bottom-Left algorithm
  packRectangles(arrayWithBlocks);

  // Display rectangles in the container
  displayRectangles(arrayWithBlocks);
}

// Function to get a random color for demonstration purposes
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

rectanglePacking(
  [
    { width: 90, height: 90 },
    { width: 90, height: 90 },
    { width: 80, height: 127 },
    { width: 70, height: 145 },
    { width: 70, height: 14 },
    { width: 80, height: 127 },
    { width: 70, height: 115 },
    { width: 70, height: 44 },
    { width: 70, height: 145 },
    { width: 80, height: 127 },
    { width: 70, height: 145 },
    { width: 70, height: 104 },
    { width: 70, height: 74 },
  ],
  { width: 350, height: 300 }
);
