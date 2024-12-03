import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { promptApi } from "../services/prompt-api";
import SpeechToText from "./SpeechToText";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import SummarizationAPI from "./SummarizationAPI";
import SkeletonLoader from "../ui/SkeletonLoader";

const PromptAPI = ({ content }) => {
  const [prompt, setPrompt] = useState(""); // Set a default prompt if needed
  const [responseText, setResponseText] = useState(""); // Response state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  const handlePrompt = async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponseText("");

    try {
      console.log(prompt)
      await promptApi(content, prompt, (chunk) => {
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

  // Automatically trigger the prompt when the component mounts or content changes
  useEffect(() => {
    if (content && prompt) {
      handlePrompt();
    }
  }, [content, prompt]);

  return (
    <div className="flex flex-col h-full p-2 mx-3 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {/* Prompt Response */}
        {isLoading ? (
          <div className="flex flex-col bg-secondary-bg px-2 py-3 border border-br rounded">
            <SkeletonLoader width="40%" height={24} />
            <SkeletonLoader count={2} width="95%" height={16} />
            <SkeletonLoader width="70%" height={16} />
          </div>
        ) : responseText ? (
          <div className="w-full flex flex-col bg-secondary-bg px-3 py-3 mb-2 border border-br rounded overflow-auto">
            <p className="text-primary text-sm text-left">
              <ReactMarkdown className="prose">{responseText}</ReactMarkdown>
            </p>
          </div>
        ) : null}

        {loading ? (
          <div className="flex flex-col bg-secondary-bg px-2 py-3 border border-br rounded">
            <SkeletonLoader width="40%" height={24} />
            <SkeletonLoader count={2} width="95%" height={16} />
            <SkeletonLoader width="70%" height={16} />
          </div>
        ) : summary ? (
          <div className="flex flex-col bg-secondary-bg px-1 py-3 border border-br rounded">
            <h1 className="text-primary text-base font-medium mb-2 px-3">
              <ArticleRoundedIcon /> Page Summary
            </h1>
            <p className="text-secondary text-sm text-left text-wrap px-3 overflow-x-hidden">
              <ReactMarkdown className="prose">{summary}</ReactMarkdown>
            </p>
          </div>
        ) : null}
      </div>

      {/* Sticky Footer Section */}
      <div className="sticky bottom-0 bg-secondary-bg py-2 px-3 mb-2 border border-br shadow-md rounded-md">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className={`text-primary transition-transform duration-500 ${
              toggle ? "-rotate-180" : "rotate-0"
            }`}
          >
            <KeyboardArrowDownIcon />
          </button>
          <textarea
            name="input"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Here..."
            className="flex-1 text-primary text-sm bg-transparent outline-none py-1 placeholder:text-secondary resize-none"
            rows="1"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
          {prompt && (
            <button
              onClick={handlePrompt}
              className="bg-accent hover:bg-accent/90 flex justify-center items-center text-sm text-primary p-1 transition-all duration-500 rounded"
            >
              {isLoading ? (
                <StopCircleOutlinedIcon fontSize="small" />
              ) : (
                <ArrowUpwardRoundedIcon fontSize="small" />
              )}
            </button>
          )}
          <SpeechToText setPrompt={setPrompt} handlePrompt={handlePrompt} />
        </div>
        {toggle && (
          <div className="mt-3">
            <SummarizationAPI
              content={content}
              setSummary={setSummary}
              setLoading={setLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptAPI;
