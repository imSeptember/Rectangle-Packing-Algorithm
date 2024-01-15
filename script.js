const container = document.querySelector(".container");
const colorMap = new Map(); // Map to store colors based on dimensions

function rectanglePacking(arrayWithBlocks, containerSize) {
  // Generate container
  function containerGeneration(value) {
    container.style.width = containerSize.width + "px";
    container.style.height = containerSize.height + "px";
  }

  // Swap width and height if width is greater than height
  arrayWithBlocks.forEach((rect) => {
    if (rect.width > rect.height) {
      [rect.width, rect.height] = [rect.height, rect.width];
    }
  });

  // Sort blocks by both height and width in descending order
  arrayWithBlocks.sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });

  // Function to pack rectangles using Bottom-Left algorithm
  function packRectangles(rectangles) {
    let bottomLeft = { horizontal: 0, vertical: 0 };
    // Create an array filled with "0" where the number of "0" is container height
    let columnHeights = [Array(containerSize.height).fill(0)];

    rectangles.forEach((rect) => {
      // Initialize the starting position of the current rectangle to the current x-coordinate
      let column = bottomLeft.horizontal;

      // If the rectangle exceeds the container width, move to the next row
      for (let i = 1; i < rect.width; i++) {
        if (column + i >= containerSize.width) {
          bottomLeft.horizontal = 0;
          bottomLeft.vertical = Math.max(...columnHeights);
          column = 0;
        }
      }

      // Set the rectangle position
      rect.x = column;
      rect.y = bottomLeft.vertical;

      // Update column heights
      for (let i = 0; i < rect.width; i++) {
        columnHeights[column + i] = bottomLeft.vertical + rect.height;
      }

      // Move to the next position
      bottomLeft.horizontal = column + rect.width;
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
    { width: 170, height: 14 },
    { width: 80, height: 127 },
    { width: 70, height: 115 },
    { width: 70, height: 44 },
    { width: 70, height: 145 },
    { width: 80, height: 127 },
    { width: 70, height: 145 },
    { width: 70, height: 104 },
    { width: 70, height: 74 },
    { width: 80, height: 127 },
    { width: 70, height: 145 },
    { width: 70, height: 104 },
    { width: 70, height: 74 },
  ],
  { width: 350, height: 600 }
);
