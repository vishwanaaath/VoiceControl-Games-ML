let cell;
let cells = [];
let solvedGrid;
const URL = "https://teachablemachine.withgoogle.com/models/Z5IO_MWlH/";
const gridSize = 9;
let prevCell;
let firstcell = true;
let loadingInterval;
let sudokuGrid;
let usersSolvedGrid = createEmptyGrid();
let CheckingGrid;

emptygrid();

function generateSudokuGrid(difficulty) {
  //difficulty levels
  const difficultyLevels = {
    easy: 27,
    medium: 31,
    hard: 54,
  };

  const solvedGrid = generateFullSudoku();
  grid = JSON.parse(JSON.stringify(solvedGrid)); // Deep copy
  CheckingGrid = JSON.parse(JSON.stringify(grid)); // Deep copy 
  
  let cellsToRemove = difficultyLevels[difficulty];

  while (cellsToRemove > 0) {
    let row = Math.floor(Math.random() * gridSize);
    let col = Math.floor(Math.random() * gridSize);

    if (grid[row][col] !== 0) {
      grid[row][col] = 0;
      cellsToRemove--;
    }
  }
  return grid;
}

// Generate full Sudoku grid
function generateFullSudoku() {

  const grid = createEmptyGrid();

  for (let i = 0; i < gridSize; i++) {
    const num = Math.floor(Math.random() * gridSize) + 1;

    const row = 0;
    const col = i; 

    if (isValid(grid, row, col, num)) 
      grid[row][col] = num;
  }
  solvedGrid = grid;
  solveSudoku(grid);
  return grid;
}

// Create empty 9x9 grid
function createEmptyGrid() {
  array = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  return array;
}

// Helper function to check if a number can be placed in a given cell
function isValid(grid, row, col, num) {
  for (let i = 0; i < gridSize; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;

    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if (grid[boxRow][boxCol] === num) return false;
  }
  return true;
}

// Backtracking solver
function solveSudoku(grid) {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= gridSize; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

let currentcell;
let position = {
  i: 0,
  j: 0,
};

// Function to create the Sudoku board in the DOM
function createSudokuGrid(sudokuGrid) {
  const sudokuBoard = document.getElementById("sudoku-board");
  firstcell = true;
  let position = { i: 0, j: 0 };

  
  sudokuBoard.innerHTML = ""; 

  sudokuGrid.forEach((row, i) => {
    row.forEach((element, j) => {
      let cell;

      if (element !== 0) {
        cell = document.createElement("div");
        cell.id = `${i}${j}`;
        cell.innerHTML = element;
        cell.classList.add("cell", "unchangeable");
        sudokuBoard.appendChild(cell);
      } else { 
        if (firstcell) {
          position.i = i;
          position.j = j;
          console.log(position.i, position.j
          );
          
          firstcell = false;
        }
        let input = document.createElement("input");
        input.id = `${i}${j}`;
        input.type = "number";
        input.classList.add("cell", "input", "no-spinner");

        // Add highlight-border to the first input cell
        if (firstcell === false && position.i === i && position.j === j) {
          prevCell = sudokuGrid[i][j];
          input.classList.add("highlight-border");
        }

        sudokuBoard.appendChild(input);
      }
    });
  });
   
}

// Generate Sudoku based on the selected difficulty
function generateSudoku(difficulty) {
  startLoadingAnimation();
  init();
  

  firstcell = true;
  if (difficulty == "easy") {
    document.getElementById("medium").style.display = "none";
    document.getElementById("hard").style.display = "none";
  } else if (difficulty == "hard") {
    document.getElementById("easy").style.display = "none";
    document.getElementById("medium").style.display = "none";
  } else {
    document.getElementById("easy").style.display = "none";
    document.getElementById("hard").style.display = "none";
  }
  
  document.getElementById("controls").style.justifyContent = "center";
  document.getElementById("controls").style.display = "flex";
  document.getElementById("finish2").style.display = "none"; 
  
  document.getElementById("check").style.display = "block";
  document.getElementById("solve").style.display = "block";
  document.getElementById("exit").style.display = "block";
  document.getElementById("finish").style.display = "none";

  sudokuGrid = generateSudokuGrid(difficulty);

  createSudokuGrid(sudokuGrid);
}

async function createModel() {
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata
 
  const recognizer = speechCommands.create(
    "BROWSER_FFT",
    undefined, 
    checkpointURL,
    metadataURL
  );

  // check that model and metadata are loaded via HTTPS requests.
  await recognizer.ensureModelLoaded();

  return recognizer;
}

let count = 0;
async function init() {
  const recognizer = await createModel();
  const classLabels = recognizer.wordLabels();
  const labelContainer = document.getElementById("label-container");
 
  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields

  recognizer.listen(
    (result) => {
      clearInterval(loadingInterval);
      const scores = result.scores; // probability of prediction for each class
      // render the probability scores per class
      for (let i = 0; i < classLabels.length; i++) { 
        if (scores[i] > 0.90) {
          console.log(scores[i]);
          
          labelContainer.innerHTML = `Command: ${
            classLabels[i]
          }, Probability: ${scores[i].toFixed(2)}`;

          switch (classLabels[i]) {
            case "one":
              setNewValue(1);
              break;

            case "two":
              setNewValue(2);
              break;

            case "three":
              setNewValue(3);
              break;

            case "four":
              setNewValue(4);
              break;

            case "five":
              setNewValue(5);
              break;

            case "six":
              setNewValue(6);
              break;

            case "seven":
              setNewValue(7);
              break;

            case "eight":
              setNewValue(8);
              break;

            case "nine":
              setNewValue(9);
              break;

            case "up":
              let newXUp = position.i - 1;
              let newJUp = position.j;
              moveTo(newXUp, newJUp, "left");
              break;

            case "down":
              let newXDown = position.i + 1;
              let newJDown = position.j;
              moveTo(newXDown, newJDown, "right");
              break;

            case "left":
              let newXLeft = position.i;
              let newJLeft = position.j - 1;
              moveTo(newXLeft, newJLeft, "left");
              break;

            case "right":
              let newXRight = position.i;
              let newJRight = position.j + 1;
              moveTo(newXRight, newJRight, "right");
              break;
          }
        }
      }
    },
    {
      includeSpectrogram: true, // in case listen should return result.spectrogram
      probabilityThreshold: 0.85,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.7,
    }
  );

  // Stop the recognition in 5 seconds.
  // setTimeout(() => recognizer.stopListening(), 5000);
}
let newCell;

// Function to update the current position and highlight the selected cell
function moveTo(newX, newJ, direction) {

  // Get the previous cell
  prevCell = document.getElementById(`${position.i}${position.j}`);

  // Remove highlight from previous cell, if it exists
  if (prevCell) {
    prevCell.classList.remove("highlight-border");
  }

  // Update position, ensuring it stays within grid bounds
  position.i = Math.max(0, Math.min(sudokuGrid.length - 1, newX)); 
  position.j = Math.max(0, Math.min(sudokuGrid[0].length - 1, newJ)); 
  
  checkPositionCell(position.i, position.j, direction);

  // Function to check the position of the cell
  function checkPositionCell(i, j, direction) {

    // Get the new cell
    newCell = document.getElementById(`${i}${j}`);

    // Check if the cell exists and is changeable
    if (newCell) {
      if (newCell.classList.contains("unchangeable")) {
        // If the cell is unchangeable, find the next valid cell by iterating in both directions
        let found = false;

        if (direction == "right") {
          // Checking right is done down and right of the cell
          for (let x = i; x < sudokuGrid.length; x++) {
            for (let y = j + 1; y < sudokuGrid[x].length; y++) {
              newCell = document.getElementById(`${x}${y}`);
              if (newCell && !newCell.classList.contains("unchangeable")) {
                found = true;
                position.i = x;
                position.j = y;
                newCell.classList.add("highlight-border");
                return;
              }
            }
            // Reset j to ensure we start from the first column in the next row
            j = -1; 
          }
        } else if (direction == "left") {
          // Checking left is done up and left of the cell
          for (let x = i; x >= 0; x--) {
            for (let y = j - 1; y >= 0; y--) {
              newCell = document.getElementById(`${x}${y}`);
              if (newCell && !newCell.classList.contains("unchangeable")) {
                found = true;
                position.i = x;
                position.j = y;
                newCell.classList.add("highlight-border");
                return;
              }
            }
            j = sudokuGrid[0].length; // Reset j to ensure we start from the last column in the previous row
          }
        }

        // If no changeable cell is found, keep the previous position
        if (!found) {
          position.i = newX;
          position.j = newJ;
        }
      } else {
        // If the new cell is changeable, add the highlight class
        newCell.classList.add("highlight-border");
        return;
      }
    }
  }
}

function setNewValue(newValue) { 
  if (newCell && !newCell.classList.contains("unchangeable")) {
    newCell.value = newValue;
    //updating the user solved grid as well
    usersSolvedGrid[position.i][position.j] = newValue;
  }
}

function solve() { 
  document.getElementById("sudoku-board").innerHTML = "";
  document.getElementById("check").style.display = "none";
  document.getElementById("solve").style.display = "none";
  document.getElementById("exit").style.display = "none";
  document.getElementById("finish").style.display = "block";
  solvedGrid.forEach((row, i) => {
    row.forEach((element, j) => {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      if (sudokuGrid[i][j] == 0) {
        cell.classList.add("grey");
      }
      cell.innerText = element;
      document.getElementById("sudoku-board").appendChild(cell);
    });
  });
}

function emptygrid() { 

    document.getElementById("finish").style.display = "none";
    document.getElementById("check").style.display = "none";
    document.getElementById("solve").style.display = "none";
    document.getElementById("exit").style.display = "none";

  // Showing the level selector buttons again
  document.querySelectorAll(".level-selectors").forEach((selector) => {
    selector.style.display = "block";
  });
  document.getElementById("game-level").style.justifyContent = "center";
  document.getElementById("game-level").style.display = "flex";
  
  document.getElementById("sudoku-board").innerHTML = "";
  
  let emptyGrid = createEmptyGrid();
  emptyGrid.forEach((row) => {
    row.forEach((column) => {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      document.getElementById("sudoku-board").appendChild(cell);
    });
  });

}


function startLoadingAnimation() {
  const labelContainer = document.getElementById("label-container");
  let dotCount = 0; 
  
   loadingInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 5; 
    labelContainer.innerHTML = "Voice control is loading" + ".".repeat(dotCount); // Add dots

  }, 600); 
}
   
function check() {
  let isCorrect = true; // Flag to track if the entire grid is correct

  sudokuGrid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) {
        const elementText = document.getElementById(`${i}${j}`).value;
        usersSolvedGrid[i][j] = parseInt(elementText) || 0;

        if (CheckingGrid[i][j] !== usersSolvedGrid[i][j]) {
          isCorrect = false;
        }
      }
    });
  }); 

  if (isCorrect) {
    document.getElementById("check").style.display = "none";
    document.getElementById("solve").style.display = "none";
    document.getElementById("exit").style.display = "none";

    document.getElementById("notification").style.display = "flex";
    document.getElementById("notification-message").innerText = "Correct!"; 
    document.getElementById("finish2").style.display = "block"; // Show the button
  } else {
    document.getElementById("notification").style.display = "flex"; 
    document.getElementById("notification-message").innerText =
      "Incorrect! Please check.";
    setTimeout(() => {
      document.getElementById("notification").style.display = "none"; 
    }, 800);
  }
}



function end(){ 
  document.getElementById('notification').style.display = "none" 
}

 