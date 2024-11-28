/*global chrome*/
import { GoogleGenerativeAI } from "@google/generative-ai"; // Replace with the actual path to the Gemini SDK
import { getParams } from "./setting";

const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
let session;

function formatLinks(text) {
  // Regular expression to match URLs (basic version)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => `[${url}](${url})`);
}

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
async function runChromePrompt(systemInstructions, prompt, params, onChunk) {
  try {
    if (!session) {
      session = await chrome.aiOriginTrial.languageModel.create({
        systemPrompt: systemInstructions,
      });
      console.log("Session created:", session);
    }
    if (session) {
      for await (const chunk of session.promptStreaming(prompt)) {
        let chunkText = chunk;

        chunkText = formatLinks(chunkText);
        console.log(chunkText);
        if (onChunk) {
          onChunk({ text: chunkText, model: "chrome" }); // Include model name
        }
      }
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
async function runGeminiPrompt(systemInstructions, prompt, params, onChunk) {
  try {
    const geminiModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstructions,
      generationConfig: params,
    });
    const response = await geminiModel.generateContentStream(prompt);

    for await (const chunk of response.stream) {
      let chunkText = chunk.text();
      chunkText = formatLinks(chunkText);
      console.log(chunk.text());
      if (onChunk) {
        onChunk({ text: chunkText, model: "gemini" }); // Pass the chunk to the callback
      }
    }
  } catch (error) {
    console.error("Error running Gemini prompt:", error);
    throw error;
  }
}

// Expose a unified prompt API function
export async function promptApi(content, prompt, onChunk) {
  const isChromeAvailable = await initDefaults(); // Check if chrome.aiOriginTrial is available and ready

  const systemInstructions = `
You are a specialized assistant designed to answer questions related to the content of the current webpage. Below is the extracted data from the page:

--- Begin Page Data ---
${content}
--- End Page Data ---

When responding:
1. Understand the question fully before generating an answer.
2. Use the provided page data as the primary source for your response.
3. Be concise, accurate, and provide additional context when necessary.
4. Format your response in **markdown**, ensuring it is well-structured and readable.
5. If the question cannot be answered from the given data, explicitly state that.

Your primary goal is to provide relevant and context-aware answers based on the provided page data.
`;

  const params = getParams();
  if (isChromeAvailable) {
    console.log("Using chrome.aiOriginTrial model");

    try {
      await runChromePrompt(systemInstructions, prompt, params, onChunk);
    } catch (error) {
      console.error("Error in chrome.aiOriginTrial prompt:", error);
      console.log("Falling back to Gemini model...");
      await runGeminiPrompt(systemInstructions, prompt, params, onChunk);
    }
  } else {
    console.log("Using Gemini model");
    await runGeminiPrompt(systemInstructions, prompt, params, onChunk); // Fall back to the Gemini model
  }
}

// Initialize the defaults on script load
initDefaults();
