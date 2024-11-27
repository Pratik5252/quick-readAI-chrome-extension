import { useState } from "react";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import { summarize } from "../services/summarise-api";

const SummarizationAPI = ({ content, setSummary, setLoading }) => {
  const handleSummarize = async () => {
    setLoading(true);
    try {
      await summarize(content, (chunk) => {
        setSummary(chunk.chunk);
        console.log("Summarized Content:", chunk);
      });
    } catch (error) {
      console.error("Error during summarization:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="bg-secondary-bg hover:bg-secondary-bg/90 border border-br py-[2px] px-2 rounded-sm">
        <button
          onClick={handleSummarize}
          className="flex justify-center items-center gap-1"
        >
          <p className="text-primary text-sm">Summarize</p>
          <TextSnippetOutlinedIcon
            fontSize="small"
            className="text-primary"
          />{" "}
        </button>
      </div>
    </div>
  );
};

export default SummarizationAPI;
