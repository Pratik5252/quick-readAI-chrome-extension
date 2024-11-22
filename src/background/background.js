/*global chrome*/

import { initDefaults } from "../services/prompt-api";


chrome.runtime.onInstalled.addListener(() => {
  initDefaults();
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// Checking if service worker active
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create("keepAlive", { periodInMinutes: 1 });
});
chrome.runtime.onInstalled.addListener(() => {
  console.log("Service worker installed.");
});
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("Tab activated:", activeInfo);
});



// Content
// background.js

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Listen for messages from popup or background

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'extractContent') {
    // Query the active tab to send a message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTabId = tabs[0].id;

      // Send a message to the content script in the active tab
      chrome.tabs.sendMessage(activeTabId, { action: 'extractContent' }, (response) => {
        // Send the response back to the popup (React)
        sendResponse(response);
      });
    });
    return true;  // Keep the message channel open for asynchronous response
  }
});

// chrome.action.onClicked.addListener(tab => {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: () => {
//       alert('Hello from my extension!');
//     }
//   })
// })

