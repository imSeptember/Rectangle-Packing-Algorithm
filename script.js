const container = document.getElementById("resultContainer");
const colorMap = new Map(); // Карта для збереження кольорів за розмірами

let arrayWithBlocks; // Глобальна змінна для доступу до даних у функції зміни розміру

window.addEventListener("resize", () => {
  // Оновлюємо контейнер і викликаємо алгоритм при зміні розміру вікна
  const containerSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  rectanglePacking(arrayWithBlocks, containerSize);
});

fetch("input.json")
  .then((response) => response.json())
  .then((data) => {
    // Зберігаємо дані у глобальній змінній для доступу у функції зміни розміру
    arrayWithBlocks = data.blocks;

    // Викликаємо алгоритм при завантаженні сторінки
    const containerSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    rectanglePacking(arrayWithBlocks, containerSize);
  })
  .catch((error) => console.error("Error reading JSON:", error));

// Решта коду залишається без змін

// Решта коду залишається без змін

function rectanglePacking(arrayWithBlocks, containerSize) {
  // Generate container
  function containerGeneration(value) {
    container.style.width = containerSize.width + "px";
    container.style.height = containerSize.height + "px";
  }

  // Swap width and height if width is greater than height
  function sortBlocks(rectangles) {
    rectangles.forEach((rect, index) => {
      // Добавление исходного индекса в каждый блок
      rect.initialOrder = index;
      if (rect.width > rect.height) {
        [rect.width, rect.height] = [rect.height, rect.width];
      }
    });

    rectangles.sort((a, b) => {
      const areaA = a.width * a.height;
      const areaB = b.width * b.height;
      const result = areaB - areaA;

      // Если площади равны, используем исходные индексы для сортировки
      return result !== 0 ? result : a.initialOrder - b.initialOrder;
    });
  }

  // Function to pack rectangles using Bottom-Left algorithm
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

      // Check for available space in the current column
      let availableSpace = true;
      for (let i = 0; i < rect.width; i++) {
        if (columnHeights[column + i] > bottomLeft.vertical) {
          availableSpace = false;
          break;
        }
      }

      // If there is available space, set the rectangle position
      if (availableSpace) {
        rect.x = column;
        rect.y = bottomLeft.vertical;

        // Update column heights
        for (let i = 0; i < rect.width; i++) {
          columnHeights[column + i] = bottomLeft.vertical + rect.height;
        }

        // Move to the next position
        bottomLeft.horizontal = column + rect.width;
      } else {
        // If no available space, move to the next row
        bottomLeft.horizontal = 0;
        bottomLeft.vertical = Math.max(...columnHeights);
      }
    });
  }

  // Function to display rectangles in the container
  function displayRectangles(rectangles) {
    // Clear existing blocks from the container
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

      // Set color to block based on dimensions
      const dimensionsKey = `${rect.width}-${rect.height}`;
      if (!colorMap.has(dimensionsKey)) {
        colorMap.set(dimensionsKey, getRandomColor());
      }
      block.style.backgroundColor = colorMap.get(dimensionsKey);

      // Set top property based on container height and rectangle y-coordinate
      const topPosition = containerSize.height - rect.y - rect.height;
      if (topPosition < 0) {
        // If the rectangle exceeds the container height, hide it
        block.style.display = "none";
      } else {
        block.style.top = topPosition + "px";
        block.style.left = rect.x + "px";

        // Add a number label to each block using initialOrder
        const label = document.createElement("div");
        label.textContent = rect.initialOrder; // Adding 1 to start numbering from 1
        label.className = "block-label";

        // Add block to container and label to block
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
