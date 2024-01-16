const container = document.getElementById("resultContainer");
const colorMap = new Map(); // Map to store colors based on dimensions

let arrayWithBlocks; // Global variable for accessing data in the resize function

// Event listener for window resize
window.addEventListener("resize", () => {
  // Update the container and invoke the algorithm on window resize
  const containerSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  rectanglePacking(arrayWithBlocks, containerSize);
});

// Fetch data from input.json on page load
fetch("input.json")
  .then((response) => response.json())
  .then((data) => {
    // Save data in a global variable for access in the resize function
    arrayWithBlocks = data.blocks;

    // Invoke the algorithm on page load
    const containerSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    rectanglePacking(arrayWithBlocks, containerSize);
  })
  .catch((error) => console.error("Error reading JSON:", error));

// Function to perform rectangle packing algorithm
function rectanglePacking(arrayWithBlocks, containerSize) {
  // Function to set container size
  function containerGeneration() {
    container.style.width = containerSize.width + "px";
    container.style.height = containerSize.height + "px";
  }

  // Function to swap width and height if width is greater than height
  function sortBlocks(rectangles) {
    rectangles.forEach((rect, index) => {
      // Add the initial order to each block
      rect.initialOrder = index;
      if (rect.width > rect.height) {
        [rect.width, rect.height] = [rect.height, rect.width];
      }
    });

    rectangles.sort((a, b) => {
      const areaA = a.width * a.height;
      const areaB = b.width * b.height;
      const result = areaB - areaA;

      // If areas are equal, use initial order for sorting
      return result !== 0 ? result : a.initialOrder - b.initialOrder;
    });
  }

  // Function to calculate the fullness coefficient
  function calculateFullnessCoefficient(rectangles, containerSize) {
    const totalArea = containerSize.width * containerSize.height;
    let innerEmptySpace = 0;

    rectangles.forEach((rect) => {
      innerEmptySpace += (rect.width - 1) * (rect.height - 1);
    });

    return 1 - innerEmptySpace / totalArea;
  }

  // Function to display the fullness coefficient in the UI
  function displayFullnessCoefficient(fullnessCoefficient) {
    const fullnessElement = document.getElementById("fullness");
    if (fullnessElement) {
      fullnessElement.textContent = `Fullness Coefficient: ${(
        fullnessCoefficient * 100
      ).toFixed(2)}%`;
    } else {
      console.error("Fullness element not found in the UI.");
    }
  }

  // Function to pack rectangles using Bottom-Left algorithm
  function packRectangles(rectangles) {
    let bottomLeft = { horizontal: 0, vertical: 0 };
    let columnHeights = [Array(containerSize.height).fill(0)];

    rectangles.forEach((rect) => {
      let column = bottomLeft.horizontal;

      for (let i = 1; i < rect.width; i++) {
        if (column + i >= containerSize.width) {
          bottomLeft.horizontal = 0;
          bottomLeft.vertical = Math.max(...columnHeights);
          column = 0;
        }
      }

      let availableSpace = true;
      for (let i = 0; i < rect.width; i++) {
        if (columnHeights[column + i] > bottomLeft.vertical) {
          availableSpace = false;
          break;
        }
      }

      if (availableSpace) {
        rect.x = column;
        rect.y = bottomLeft.vertical;

        for (let i = 0; i < rect.width; i++) {
          columnHeights[column + i] = bottomLeft.vertical + rect.height;
        }

        bottomLeft.horizontal = column + rect.width;
      } else {
        bottomLeft.horizontal = 0;
        bottomLeft.vertical = Math.max(...columnHeights);
      }
    });
  }

  // Function to display rectangles in the container
  function displayRectangles(rectangles) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    rectangles.forEach((rect, index) => {
      const block = document.createElement("div");
      block.style.width = rect.width + "px";
      block.style.height = rect.height + "px";
      block.style.position = "absolute";
      block.style.border = "0.1px solid #000";
      block.style.boxSizing = "border-box";

      const dimensionsKey = `${rect.width}-${rect.height}`;
      if (!colorMap.has(dimensionsKey)) {
        colorMap.set(dimensionsKey, getRandomColor());
      }
      block.style.backgroundColor = colorMap.get(dimensionsKey);

      const topPosition = containerSize.height - rect.y - rect.height;
      if (topPosition >= 0) {
        block.style.top = topPosition + "px";
        block.style.left = rect.x + "px";

        const label = document.createElement("div");
        label.textContent = rect.initialOrder;
        label.className = "block-label";

        container.appendChild(block);
        block.appendChild(label);
      }
    });
  }

  // Set container size
  containerGeneration(containerSize);

  // Sort rectangles based on area
  sortBlocks(arrayWithBlocks);

  // Pack rectangles using the Bottom-Left algorithm
  packRectangles(arrayWithBlocks);

  // Display rectangles in the container
  displayRectangles(arrayWithBlocks);

  // Calculate and display fullness coefficient
  const fullnessCoefficient = calculateFullnessCoefficient(
    arrayWithBlocks,
    containerSize
  );
  displayFullnessCoefficient(fullnessCoefficient);

  // Create an array to store block coordinates
  const blockCoordinates = [];

  // Iterate through rectangles to populate blockCoordinates
  arrayWithBlocks.forEach((rect) => {
    const topPosition = containerSize.height - rect.y - rect.height;

    if (topPosition >= 0) {
      const coordinates = {
        top: topPosition,
        left: rect.x,
        right: rect.x + rect.width,
        bottom: topPosition + rect.height,
        initialOrder: rect.initialOrder,
      };
      blockCoordinates.push(coordinates);
    }
  });

  // Log the result to the console
  const resultObject = {
    fullness: fullnessCoefficient,
    blockCoordinates: blockCoordinates,
  };
  console.log(resultObject);
}

// Function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
