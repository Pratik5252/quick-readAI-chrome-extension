import { useState } from "react";
import { promptApi } from "../services/prompt-api";
import { summarize } from "../services/summarise-api";
import SpeechToText from "./SpeechToText";
const PromptAPI = ({ content }) => {
  const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState(""); // Response state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null);

  const handlePrompt = async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponseText("");

    try {
      await promptApi(content,prompt, (chunk) => {
        const { text, model } = chunk;
        if (model === "chrome") {
          setResponseText(text);
        } else {
          setResponseText((prevResponse) => prevResponse + text);
        }
      });
    } catch (err) {
      setError("An error occurred while fetching the response.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        name="input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
      />
      <button onClick={handlePrompt}>{isLoading ? "Loading..." : "Run"}</button>
      <button onClick={summarize}>Summarize</button>
      <hr />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {responseText && <p>{responseText}</p>}
      <SpeechToText setPrompt={setPrompt} handlePrompt={handlePrompt} />
    </div>
  );
};

export default PromptAPI;
