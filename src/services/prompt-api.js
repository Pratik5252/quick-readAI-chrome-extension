/*global chrome*/
import { GoogleGenerativeAI } from "@google/generative-ai"; // Replace with the actual path to the Gemini SDK

const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let session;

// Initialize defaults for chrome.aiOriginTrial
export async function initDefaults() {
  if (!("aiOriginTrial" in chrome)) {
    console.log(
      "Error: chrome.aiOriginTrial not supported in this browser. Using Gemini model."
    );
    return false;
  }

  try {
    const defaults = await chrome.aiOriginTrial.languageModel.capabilities();
    console.log("Model default:", defaults);

    if (defaults.available !== "readily") {
      console.log(
        `Model not yet available (current state: "${defaults.available}")`
      );
      return false;
    }

    return true; // Model is ready to use
  } catch (error) {
    console.error("Error initializing defaults:", error);
    return false; // Return false on error
  }
}

// Reset the session for chrome.aiOriginTrial
async function reset() {
  if (session) {
    session.destroy();
    session = null;
  }
}

// Run a prompt with chrome.aiOriginTrial
async function runChromePrompt(prompt, params) {
  try {
    if (!session) {
      session = await chrome.aiOriginTrial.languageModel.create(params);
      console.log("Session created:", session);
    }

    if (session) {
      return session.promptStreaming(prompt);
    } else {
      throw new Error("Failed to create session");
    }
  } catch (error) {
    console.error("Error running chrome prompt:", error);
    await reset();
    throw error;
  }
}

// Run a prompt with the Gemini model
async function runGeminiPrompt(prompt, onChunk) {
  try {
    const response = await geminiModel.generateContentStream(prompt);

    for await (const chunk of response.stream) {
      console.log(chunk.text());
      if (onChunk) {
        onChunk(chunk.text()); // Pass the chunk to the callback
      }
    }
  } catch (error) {
    console.error("Error running Gemini prompt:", error);
    throw error;
  }
}

// Expose a unified prompt API function
export async function promptApi(prompt, onChunk) {
  const isChromeAvailable = await initDefaults(); // Check if chrome.aiOriginTrial is available and ready

  if (isChromeAvailable) {
    console.log("Using chrome.aiOriginTrial model");
    const params = {
      temperature: 0.3,
      topK: 10,
    };

    try {
      const response = await runChromePrompt(prompt, params);

      for await (const chunk of response) {
        console.log(chunk);
        if (onChunk) {
          onChunk(chunk);
        }
      }
    } catch (error) {
      console.error("Error in chrome.aiOriginTrial prompt:", error);
    }
  } else {
    console.log("Using Gemini model");
    await runGeminiPrompt(prompt, onChunk); // Fall back to the Gemini model
  }
}

// Initialize the defaults on script load
initDefaults();

// let session;
// export async function initDefaults() {
//   if (!ai) {
//     console.log("Error: chrome.aiOriginTrial not supported in this browser");
//     return;
//   }

//   try {
//     const defaults = await ai.languageModel.capabilities();
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
//       session = await ai.languageModel.create(params);
//     }

//     if (session) {
//       return session.promptStreaming(prompt);
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
//     for await (const chunk of response) {
//       console.log(chunk);
//     }
//   } catch (error) {
//     console.error("Error in promptApi:", error);
//   }
// }

// // Initialize defaults
// initDefaults();
