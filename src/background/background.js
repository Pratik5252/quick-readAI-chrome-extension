/*global chrome*/

import { initDefaults } from "../services/prompt-api";

chrome.runtime.onInstalled.addListener(() => {
  initDefaults();
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
