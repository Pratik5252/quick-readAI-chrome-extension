import { useState } from "react";
import { promptApi } from "../services/prompt-api";
import { summarize } from "../services/summarise-api";
import SpeechToText from "./SpeechToText";
import { Box, Button, ButtonGroup, TextField } from '@mui/material'
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';

const PromptAPI = () => {
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
      await promptApi(prompt, (chunk) => {
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'primary.light'
      }}
    >
      <TextField
        id="outlined-basic"
        label="Enter your prompt"
        variant="outlined"
        name="input"
        onChange={(e) => setPrompt(e.target.value)}
        sx={{
          mt: 2,
          color: 'primary.light',
          '& .MuiInputLabel-root': {
            color: 'primary.light', // Set label color to white
          },
          '& .MuiInputBase-input': {
            color: 'primary.light', // Set input text color to white
          },
        }}
      />
      <ButtonGroup orientation="vertical"
        aria-label="Vertical button group"
        variant="text"
      >
        <Button onClick={handlePrompt}
          startIcon={<ArrowUpwardOutlinedIcon />}
        >{isLoading ? "Loading..." : "Run"}</Button>
        <Button
          onClick={summarize}
          startIcon={<SummarizeOutlinedIcon />}
        >
          Summarize
        </Button>
      </ButtonGroup>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {responseText && <p>{responseText}</p>}
      <SpeechToText setPrompt={setPrompt} handlePrompt={handlePrompt} />
    </Box>
  );
};

export default PromptAPI;
