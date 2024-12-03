/*global chrome*/
import { useEffect, useState } from "react";
import PromptAPI from "./components/PromptAPI";
import { createTheme } from "@mui/material/styles";
import Header from "./components/Header";
import Translation from "./components/Translation";

function App() {
  const [extractedData, setExtractedData] = useState(null);
  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => document.body.innerText,
      },
      (results) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError);
        } else {
          // Set the extracted text in the state
          const bodyText = results[0]?.result;
          setExtractedData(bodyText);
        }
      }
    );
  };
  console.log(extractedData);

  // Automatically extract data from current page
  useEffect(() => {
    handleClick();
    const handleTabUpdate = (tabId, changeInfo) => {
      if (changeInfo.status == "complete") {
        handleClick();
      }
    };
    chrome.tabs.onUpdated.addListener(handleTabUpdate);

    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate);
    };
  }, []);

  let scrollDown = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        window.scrollBy(0, 100);
      },
    });
  };

  return (
    <div className="">
      <div className="flex flex-col h-screen bg-primary-bg">
        <Header />
        <div className="flex-1 overflow-hidden">
          <PromptAPI content={extractedData} />
        </div>
        {/* <Translation/> */}
      </div>
    </div>
  );
}

export default App;
