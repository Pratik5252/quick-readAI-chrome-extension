/*global chrome*/
import { useEffect, useState } from "react";
import PromptAPI from "./components/PromptAPI";
// import SpeechToText from "./components/SpeechToText";
import { Button, Container, Typography, ButtonGroup, Box } from "@mui/material";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RotateRightOutlinedIcon from "@mui/icons-material/RotateRightOutlined";
import ThemeToggle from "./ui/ThemeToggle";
import Header from "./components/Header";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue
      dark: "#1A1A10",
      light: "#F8F8F8", //white
    },
    secondary: {
      main: "#d32f2f", // Red
    },
  },
  typography: {
    fontFamily: "Inter, serif",
    h4: {
      fontWeight: 600,
    },
  },
});

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
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => document.body.innerText,
        // alert('Hello from my extension!');

        // console.log("--DOC");
        // console.log(document.body.innerText);
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
      <div className="bg-primary-bg flex flex-col h-[100vh]">
        {/* <Button onClick={handleClick} startIcon={<RotateRightOutlinedIcon />}>
          Extract Page Content
        </Button>
        <Button startIcon={<ArrowDropDownOutlinedIcon />} onClick={scrollDown}>
          Scroll Down
        </Button> */}

        {/* {extractedData && (
          <div>
            <h2>Extracted Data:</h2>
            <pre>{JSON.stringify(extractedData, null, 2)}</pre>
          </div>
        )} */}

        <Header />
        <PromptAPI content={extractedData} />
      </div>
    </div>
  );
}

export default App;
