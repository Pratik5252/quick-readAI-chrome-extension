// settings.js

// Default settings for model parameters
const defaultParams = {
  temperature: 0.30,
  topK: 10,
  topP: 1,
};

let userParams = { ...defaultParams };

// Function to get the current parameters
export function getParams() {
  return userParams;
}

//Update specific parameters
export function updateParams(newParams) {
  userParams = { ...userParams, ...newParams };
  console.log("Updated parameters:", userParams);
}

//Reset parameters to default
export function resetParams() {
  userParams = { ...defaultParams };
  console.log("Parameters reset to default:", userParams);
}
