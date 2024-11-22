(() => {

    console.log("Accessing DOM...");
    const bodyContent = document.body.innerHTML; // Gets the entire body content
    console.log("Body Content:", bodyContent);
    
    document.body.style.backgroundColor = "lightblue"; // Change background color
    
    const domContent = document.documentElement.outerHTML; // Full DOM
    
    // Send DOM content to the background script
    chrome.runtime.sendMessage({ type: "DOM_CONTENT", content: domContent }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
      } else {
        console.log("Response from background script:", response);
      }
    });

    function extractContent() {
        const content = {
          text: document.body.innerText, // Extracts plain text from the page
          html: document.documentElement.innerHTML, // Extracts raw HTML
          links: Array.from(document.querySelectorAll('a')).map(a => a.href), // Extracts all links
          images: Array.from(document.querySelectorAll('img')).map(img => img.src), // Extracts all image URLs
        };
        console.log('--------+--------++---------')
        console.log("Content: "+content) 
        // Return extracted data
        return content;
      }
      
      // Listen for a message from the background or popup to trigger data extraction
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'extractContent') {
          const extractedData = extractContent();
          sendResponse(extractedData);
        }
      });
      
    
  })
  
  