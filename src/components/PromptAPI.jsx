import { useState } from "react";
import { promptApi } from "../services/prompt-api";
const PromptAPI = () => {
  const [prompt, setPrompt] = useState("");
  const [text, setText] = useState("");

  const handlePrompt = async () => {
    const response = await promptApi(prompt);
    setText(response);
    console.log(text);
  };
  return (
    <div>
      <input
        type="text"
        name="input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handlePrompt}>Run</button>
      <hr />
      <p>{text}</p>
    </div>
  );
};

export default PromptAPI;
