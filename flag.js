// List of countries to randomly pick the correct flag and generate options
const countries = [
  "Brazil",
  "China",
  "Denmark",
  "Egypt",
  "England",
  "France",
  "India",
  "Italy",
  "Jordan",
  "Kenya",
  "Mexico",
  "Norway",
  "Portugal",
  "Russia",
  "Turkey",
  "Ukraine",
];
let allOptions; // Variable to hold the shuffled options (correct and incorrect)
game(); // Start the flag guessing game

function game() {
  // Clear the main flag display and the options section
  document.getElementById("main").innerHTML = "";
  document.getElementById("optionSetion").innerHTML = "";

  // Randomly select the correct flag name from the countries list
  let correctFlagNamae =
    countries[Math.floor(Math.random() * countries.length)];
  allOptions = [correctFlagNamae]; // Initialize options array with the correct flag name

  // Create an image element to display the correct flag
  let correctFlag = document.createElement("img");
  correctFlag.src = `images/${correctFlagNamae}.png`; // Set the flag image source
  document.getElementById("main").appendChild(correctFlag); // Add the flag to the main section

  // Add 3 additional random countries to the options array
  for (let i = 0; i < 3; i++) {
    allOptions.push(countries[Math.floor(Math.random() * countries.length)]);
  }

  console.log(allOptions); // Log the options for debugging

  // Fisher-Yates algorithm to shuffle the array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Pick a random index
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
  }

  shuffleArray(allOptions); // Shuffle the options array

  // Create a clickable option for each country in the shuffled options
  allOptions.forEach((element) => {
    let option = document.createElement("div");
    option.textContent = element; // Set the option's text
    option.id = element; // Assign a unique ID based on the country name
    option.classList.add("option"); // Add the "option" CSS class
    document.getElementById("optionSetion").appendChild(option); // Append the option to the options section
  });

  // Add click event listeners to each option
  let options = document.querySelectorAll(".option");
  options.forEach((option) => {
    option.addEventListener("click", () => {
      if (option.textContent === correctFlagNamae) {
        // If the clicked option is correct
        option.classList.add("correctOption"); // Highlight it as correct
        setTimeout(() => game(), 1000); // Restart the game after 1.5 seconds
      } else {
        // If the clicked option is incorrect
        option.classList.add("incorrectOption"); // Highlight it as incorrect
        setTimeout(
          () =>
            document
              .getElementById(`${correctFlagNamae}`)
              .classList.add("correctOption"), // Highlight the correct answer
          1000
        );
        setTimeout(() => game(), 1500); // Restart the game after 1.5 seconds
      }
    });
  });
}

//----------------------------------------------------------------
// Initialize voice recognition model
init();

async function createModel() {
  const URL = "https://teachablemachine.withgoogle.com/models/XnLAQWwNO/";
  const checkpointURL = URL + "model.json"; // URL to the model JSON
  const metadataURL = URL + "metadata.json"; // URL to the metadata JSON

  const recognizer = speechCommands.create(
    "BROWSER_FFT", // FFT type for browser-based processing
    undefined,
    checkpointURL,
    metadataURL
  );

  // Ensure the model is loaded before using
  await recognizer.ensureModelLoaded();
  return recognizer; // Return the loaded recognizer
}

async function init() {
  const recognizer = await createModel(); // Load the recognizer model
  const classLabels = recognizer.wordLabels(); // Get the class labels from the model
  const labelContainer = document.getElementById("names"); // Container for displaying labels

  // Create and append div elements for each label (optional UI feedback)
  for (let i = 0; i < classLabels.length; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }

  // Start listening for voice commands
  recognizer.listen(
    (result) => {
      const scores = result.scores; // Probability scores for each label
      for (let i = 0; i < classLabels.length; i++) {
        console.log(classLabels[i], result.scores[i]); // Log label probabilities

        if (scores[i] > 0.45) {
          // If the confidence score for a label is high enough
          const clickableElement = document.getElementById(`${classLabels[i]}`); // Get the corresponding option element
          if (clickableElement) {
            console.log(`Triggering click for: ${classLabels[i]}`); // Log triggered click
            clickableElement.click(); // Simulate a click on the element
          } else {
            console.warn("Element not found."); // Warn if the element doesn't exist
          }
        }
      }
    },
    {
      includeSpectrogram: true, // Option to include spectrogram data in results
      probabilityThreshold: 0.1, // Minimum probability threshold for detection
      invokeCallbackOnNoiseAndUnknown: true, // Allow callback on unknown/noisy inputs
      overlapFactor: 0.1, // Overlap factor for continuous listening
    }
  );
}


