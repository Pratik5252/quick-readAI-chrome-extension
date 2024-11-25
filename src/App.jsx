/*global chrome*/
import { useState } from "react";
import PromptAPI from "./components/PromptAPI";
import SpeechToText from "./components/SpeechToText";
import { Button, Container, Typography, ButtonGroup, Box } from "@mui/material";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RotateRightOutlinedIcon from "@mui/icons-material/RotateRightOutlined";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue
      dark: "#1A1A1D",
      light: "#ECDFCC",
    },
    secondary: {
      main: "#d32f2f", // Red
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
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
    let [tab] = await chrome.tabs.query({ active: true });
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
          const bodyText = results[0]?.result; // Get the result from the executed script
          setExtractedData(bodyText);
        }
      }
    );
  };
  console.log(extractedData);

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
    <ThemeProvider theme={theme}>
      <Container
        sx={{ bgcolor: "primary.dark", color: "primary.light", py: 2, m: 0 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px dashed grey",
            borderRadius: "5px",
            p: 2,
          }}
        >
          <Typography variant="h6">Page Controls</Typography>
          <ButtonGroup
            orientation="vertical"
            aria-label="Vertical button group"
            variant="text"
          >
            <Button
              onClick={handleClick}
              startIcon={<RotateRightOutlinedIcon />}
            >
              Extract Page Content
            </Button>
            <Button
              startIcon={<ArrowDropDownOutlinedIcon />}
              onClick={scrollDown}
            >
              Scroll Down
            </Button>
          </ButtonGroup>

          {extractedData && (
            <div>
              <h2>Extracted Data:</h2>
              <pre>{JSON.stringify(extractedData, null, 2)}</pre>
            </div>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px dashed grey",
            borderRadius: "5px",
            my: 2,
            p: 2,
          }}
        >
          {/* <SpeechToText /> */}
          <Typography variant="h6">Prompt AI</Typography>
          <PromptAPI content={extractedData} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
