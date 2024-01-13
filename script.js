const container = document.querySelector(".container");

function rectanglePacking(arrayWithBlocks, containerSize) {
  // Generate container
  function containerGeneration(value) {
    container.style.width = containerSize.width + "px";
    container.style.height = containerSize.height + "px";
  }

  containerGeneration(containerSize);

  // Generate all rectangles
  function rectangleGeneration(arrayWithBlocks) {
    const colorMap = new Map();

    arrayWithBlocks.forEach((blockSize, index) => {
      const rectangle = document.createElement("div");
      rectangle.classList.add("block");
      rectangle.style.width = blockSize.width + "px";
      rectangle.style.height = blockSize.height + "px";

      let color;

      // Check if a block of the same size has been assigned a color before
      if (colorMap.has(JSON.stringify(blockSize))) {
        color = colorMap.get(JSON.stringify(blockSize));
      } else {
        color = getRandomColor();
        colorMap.set(JSON.stringify(blockSize), color);
      }

      rectangle.style.backgroundColor = color;

      // Create and append a text element with the index
      const indexText = document.createElement("span");
      indexText.textContent = index;
      rectangle.appendChild(indexText);

      container.appendChild(rectangle);
    });
  }

  rectangleGeneration(arrayWithBlocks);
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
    { width: 70, height: 144 },
  ],
  { width: 350, height: 300 }
);
