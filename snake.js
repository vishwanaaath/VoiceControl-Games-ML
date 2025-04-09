// Select the canvas element from the HTML
var canvas = document.getElementById("game");

// Set up the drawing context for the canvas
var context = canvas.getContext("2d");

// URL for the voice recognition model trained with Teachable Machine
const URL = "https://teachablemachine.withgoogle.com/models/t5xL_ZZgs/";

// Set the grid size for the game and initialize the loop counter
var grid = 16;
var count = 0;

// Object representing the snake
var snake = {
  x: 160, // Initial horizontal position of the snake
  y: 160, // Initial vertical position of the snake
  dx: grid, // Initial horizontal movement direction
  dy: 0, // Initial vertical movement direction
  cells: [], // Array to store the parts of the snake's body
  maxCells: 4, // Initial length of the snake
};

// Object representing the apple, made of 4 blocks
var apple = {
  blocks: [], // Array to store the positions of the apple blocks
};

// Function to generate a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Function to reset the game to its initial state
function resetGame() {
  snake.x = 160; // Reset the snake's horizontal position
  snake.y = 160; // Reset the snake's vertical position
  snake.cells = []; // Clear the snake's body
  snake.maxCells = 4; // Reset the snake's length
  snake.dx = grid; // Reset horizontal movement
  snake.dy = 0; // Reset vertical movement
  placeApple(); // Place a new apple
}

// Function to place the apple on the grid as 4 adjacent blocks
function placeApple() {
  apple.blocks = []; // Clear previous apple positions
  let startX = getRandomInt(0, canvas.width / grid) * grid; // Random horizontal position
  let startY = getRandomInt(0, canvas.height / grid) * grid; // Random vertical position

  // Loop to ensure the apple does not overlap with the snake's body
  do {
    apple.blocks = [
      { x: startX, y: startY }, // Top-left block of the apple
      { x: startX + grid, y: startY }, // Top-right block of the apple
      { x: startX, y: startY + grid }, // Bottom-left block of the apple
      { x: startX + grid, y: startY + grid }, // Bottom-right block of the apple
    ];
    startX = getRandomInt(0, canvas.width / grid) * grid; // Recalculate horizontal position
    startY = getRandomInt(0, canvas.height / grid) * grid; // Recalculate vertical position
  } while (
    apple.blocks.some(
      (
        block // Check if any apple block overlaps
      ) =>
        snake.cells.some(
          (
            cell // with any part of the snake
          ) => cell.x === block.x && cell.y === block.y
        )
    )
  );
}

// Function to draw the apple on the canvas
function drawApple() {
  context.fillStyle = "green"; // Set the apple's color
  apple.blocks.forEach((block) => {
    // Loop through each block of the apple
    context.fillRect(block.x, block.y, grid - 1, grid - 1); // Draw the block
  });
}

// Function to check if the snake eats any part of the apple
function checkAppleCollision() {
  return snake.cells.some(
    (
      cell // Check if any part of the snake
    ) =>
      apple.blocks.some(
        (
          block // overlaps with any block of the apple
        ) => cell.x === block.x && cell.y === block.y
      )
  );
}

// Main game loop function
function loop() {
  requestAnimationFrame(loop); // Continuously request the next frame

  if (++count < 30) {
    // Slow down the game loop
    return;
  }

  count = 0; // Reset the counter
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Update the snake's position
  snake.x += snake.dx; // Update horizontal position
  snake.y += snake.dy; // Update vertical position

  // Wrap the snake around the canvas edges
  if (snake.x < 0) snake.x = canvas.width - grid; // Wrap left edge to right
  if (snake.x >= canvas.width) snake.x = 0; // Wrap right edge to left
  if (snake.y < 0) snake.y = canvas.height - grid; // Wrap top edge to bottom
  if (snake.y >= canvas.height) snake.y = 0; // Wrap bottom edge to top

  // Add the new head position to the snake's body
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // Remove the last cell if the snake exceeds its maximum length
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Draw the apple
  drawApple();

  // Draw the snake and check for collisions
  context.fillStyle = "#bdc4fe"; // Set the snake's color
  snake.cells.forEach(function (cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1); // Draw each part of the snake

    // Check if the snake eats the apple
    if (checkAppleCollision()) {
      snake.maxCells++; // Increase the snake's length
      placeApple(); // Place a new apple
    }

    // Check if the snake collides with itself
    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        console.log("Collision detected. Resetting game."); // Log collision
        resetGame(); // Reset the game
      }
    }
  });
}

// Functions to control the snake's movement
function left() {
  if (snake.dx === 0) {
    // Prevent reversing direction
    snake.dx = -grid; // Move left
    snake.dy = 0;
  }
}

function up() {
  if (snake.dy === 0) {
    // Prevent reversing direction
    snake.dx = 0;
    snake.dy = -grid; // Move up
  }
}

function right() {
  if (snake.dx === 0) {
    // Prevent reversing direction
    snake.dx = grid; // Move right
    snake.dy = 0;
  }
}

function down() {
  if (snake.dy === 0) {
    // Prevent reversing direction
    snake.dx = 0;
    snake.dy = grid; // Move down
  }
}

// Add keyboard controls for the snake
document.addEventListener("keydown", function (e) {
  if (e.which === 37) left(); // Left arrow key
  else if (e.which === 38) up(); // Up arrow key
  else if (e.which === 39) right(); // Right arrow key
  else if (e.which === 40) down(); // Down arrow key
});

// Function to load the Teachable Machine voice recognition model
async function createModel() {
  const checkpointURL = URL + "model.json"; // Model checkpoint URL
  const metadataURL = URL + "metadata.json"; // Model metadata URL

  // Load the model
  const recognizer = speechCommands.create(
    "BROWSER_FFT",
    undefined,
    checkpointURL,
    metadataURL
  );

  await recognizer.ensureModelLoaded(); // Ensure the model is loaded
  return recognizer;
}

// Function to initialize voice recognition
async function init() {
  const recognizer = await createModel(); // Load the voice recognition model
  const classLabels = recognizer.wordLabels(); // Get the recognized words

  // Start listening for voice commands
  recognizer.listen(
    (result) => {
      const scores = result.scores; // Get the scores for each command
      for (let i = 0; i < classLabels.length; i++) {
        console.log(classLabels[i], result.scores[i]); // Log command and score

        if (scores[i] > 0.30) {
          // Check if confidence is high enough
          switch (
            classLabels[i] // Perform action based on command
          ) {
            case "Up":
              up();
              break;
            case "Down":
              down();
              break;
            case "Left":
              left();
              break;
            case "Right":
              right();
              break;
          }
        }
      }
    },
    {
      includeSpectrogram: true, // Include audio data
      probabilityThreshold: 0.5, // Minimum confidence for detection
      invokeCallbackOnNoiseAndUnknown: false, // Ignore unknown commands
      overlapFactor: 0.5, // Overlap between audio frames
    }
  );
}

// Start the game
resetGame(); // Initialize the game state
requestAnimationFrame(loop); // Start the game loop
init(); // Initialize voice recognition
