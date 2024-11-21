// /*global chrome*/


// The Below commet out code is using Built-in API through aiOriginTrial
// let session;
// export async function initDefaults() {
//   if (!chrome.aiOriginTrial) {
//     console.log("Error: chrome.aiOriginTrial not supported in this browser");
//     return;
//   }

//   try {
//     const defaults = await chrome.aiOriginTrial.languageModel.capabilities();
//     console.log("Model default:", defaults);

//     if (defaults.available !== "readily") {
//       console.log(
//         `Model not yet available (current state: "${defaults.available}")`
//       );
//       return;
//     }
//   } catch (error) {
//     console.error("Error initializing defaults:", error);
//   }
// }

// // Reset session
// async function reset() {
//   if (session) {
//     session.destroy();
//     session = null;
//   }
// }

// // Run a prompt with given parameters
// async function runPrompt(prompt, params) {
//   try {
//     if (!session) {
//       session = await chrome.aiOriginTrial.languageModel.create(params);
//     }

//     if (session) {
//       return session.prompt(prompt);
//     } else {
//       throw new Error("Failed to create session");
//     }
//   } catch (error) {
//     console.log("Prompt failed");
//     console.error(error);
//     console.log("Prompt:", prompt);

//     // Reset session
//     await reset();
//     throw error;
//   }
// }

// // Expose a prompt API function
// export async function promptApi(prompt) {
//   try {
//     const params = {
//       temperature: 0.3,
//       topK: 1,
//     };

//     const response = await runPrompt(prompt, params);
//     console.log(response);
//   } catch (error) {
//     console.error("Error in promptApi:", error);
//   }
// }

// // Initialize defaults
// initDefaults();

let session;
export async function initDefaults() {
  if (!ai) {
    console.log("Error: chrome.aiOriginTrial not supported in this browser");
    return;
  }

  try {
    const defaults = await ai.languageModel.capabilities();
    console.log("Model default:", defaults);

    if (defaults.available !== "readily") {
      console.log(
        `Model not yet available (current state: "${defaults.available}")`
      );
      return;
    }
  } catch (error) {
    console.error("Error initializing defaults:", error);
  }
}

// Reset session
async function reset() {
  if (session) {
    session.destroy();
    session = null;
  }
}

// Run a prompt with given parameters
async function runPrompt(prompt, params) {
  try {
    if (!session) {
      session = await ai.languageModel.create(params);
    }

    if (session) {
      return session.promptStreaming(prompt);
    } else {
      throw new Error("Failed to create session");
    }
  } catch (error) {
    console.log("Prompt failed");
    console.error(error);
    console.log("Prompt:", prompt);

    // Reset session
    await reset();
    throw error;
  }
}

// Expose a prompt API function
export async function promptApi(prompt) {
  try {
    const params = {
      temperature: 0.3,
      topK: 1,
    };

    const response = await runPrompt(prompt, params);
    for await (const chunk of response) {
      console.log(chunk);
    }
  } catch (error) {
    console.error("Error in promptApi:", error);
  }
}

// Initialize defaults
initDefaults();
