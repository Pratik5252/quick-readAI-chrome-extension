/*global chrome*/
import { useState } from "react";
import PromptAPI from "./components/PromptAPI";
import SpeechToText from "./components/SpeechToText";

function App() {
  const [extractedData, setExtractedData] = useState(null);

  const handleClick = async () => {
    // Send message to content script to extract content
    // chrome.runtime.sendMessage(
    //   { action: 'extractContent' },
    //   (response) => {
    //     // Set the extracted data in the state
    //     setExtractedData(response);
    //   }
    // );
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // alert('Hello from my extension!');
        console.log("--DOC");
        console.log(document.body.innerText);
      },
    });
  };

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
    <>
      <div>
        <h2>Speech to Text</h2>

        <button onClick={handleClick}>Extract Page Content</button>

        <button onClick={scrollDown}>Scroll down</button>

        {extractedData && (
          <div>
            <h2>Extracted Data:</h2>
            <pre>{JSON.stringify(extractedData, null, 2)}</pre>
          </div>
        )}

        <SpeechToText />
        <PromptAPI />

        <hr />
      </div>
    </>
  );
}
export default App;