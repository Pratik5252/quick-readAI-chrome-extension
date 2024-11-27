import { useState } from "react";
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
  const [prompt, setPrompt] = useState("");
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

  return (
    <div className="flex flex-col h-full p-2 my-2 mx-3 px-1 ">
      <div className="h-full flex flex-col py-2">
        <div className="flex flex-col justify-start items-center my-2 flex-1">
          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
          <p className="text-primary text-right">{prompt}</p>
          {/* Prompt Response */}
          {isLoading ? (
            <div className="w-full flex flex-col bg-secondary-bg px-2 py-3 border border-br rounded">
              <SkeletonLoader width="40%" height={24} />
              <SkeletonLoader count={2} width="95%" height={16} />
              <SkeletonLoader width="70%" height={16} />
            </div>
          ) : responseText ? (
            <div className="w-full max-h-[60vh] flex flex-col bg-secondary-bg px-2 py-3 border border-br rounded">
              <p className="text-primary text-sm text-left text-wrap overflow-x-hidden">
                <ReactMarkdown className="prose">{responseText}</ReactMarkdown>
              </p>
            </div>
          ) : null}
        </div>

        {/* Summary Response */}
        {loading ? (
          <div className=" flex flex-col bg-secondary-bg px-2 py-3 border border-br rounded">
            <SkeletonLoader width="40%" height={24} />
            <SkeletonLoader count={2} width="95%" height={16} />
            <SkeletonLoader width="70%" height={16} />
          </div>
        ) : summary ? (
          <div className="max-h-[40vh] flex flex-col bg-secondary-bg px-1 py-3 border border-br rounded">
            <h1 className="text-primary text-base font-medium mb-2 px-3">
              <ArticleRoundedIcon /> Page Summary
            </h1>
            <p className="text-secondary text-sm text-left text-wrap px-3 overflow-x-hidden">
              <ReactMarkdown className="prose">{summary}</ReactMarkdown>
            </p>
          </div>
        ) : null}
      </div>

      {/* Prompt Section */}
      <div className="w-full flex justify-center items-center">
        <div className="h-auto bg-secondary-bg flex items-center my-2 py-2 px-2 border border-br drop-shadow-sm rounded-md flex-1 gap-2">
          <div>
            <button
              onClick={handleToggle}
              className={`text-primary transition-transform duration-500 ${
                toggle ? "-rotate-180" : "rotate-0"
              }`}
            >
              <KeyboardArrowDownIcon />
            </button>
          </div>
          <div className="w-full h-auto flex justify-left items-center pl-2">
            <textarea
              name="input"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Here..."
              className="w-full h-auto text-primary text-sm bg-transparent outline-none py-1 placeholder:text-secondary resize-none "
              rows="1" // Initial number of rows
              onInput={(e) => {
                e.target.style.height = "auto"; // Reset the height
                e.target.style.height = `${e.target.scrollHeight}px`; // Set height to match content
              }}
            />
          </div>

          {/* Run Prompt */}
          <div className="flex justify-center items-center gap-2">
            {prompt && (
              <div className="bg-accent hover:bg-accent/90 flex justify-center items-center rounded border border-br">
                <button
                  onClick={handlePrompt}
                  className="flex justify-center items-center text-sm text-primary p-1 transition-none duration-700"
                >
                  {isLoading ? (
                    <StopCircleOutlinedIcon fontSize="small" />
                  ) : (
                    <ArrowUpwardRoundedIcon fontSize="small" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Microphone  */}
        <div className="ml-2">
          <SpeechToText setPrompt={setPrompt} handlePrompt={handlePrompt} />
        </div>
      </div>

      {/* Summarization Tab */}
      {toggle && (
        <div className="flex justify-start gap-2">
          <SummarizationAPI
            content={content}
            setSummary={setSummary}
            setLoading={setLoading}
          />
        </div>
      )}
    </div>
  );
};
export default PromptAPI;
