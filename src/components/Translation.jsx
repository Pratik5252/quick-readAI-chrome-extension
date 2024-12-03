import React, { useState } from "react";

export default function Translation() {
  const [language, setLanguage] = useState("en");
  const ollamaApiUrl = "http://localhost:11434/api/generate";

  //--- NANO AI 
  const fetchTranslation = async (text, targetLanguage) => {
    try {
      const response = await fetch(ollamaApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${apiKey}`, 
        },
        body: JSON.stringify({
          model: "qwen2.5-coder:0.5b", 
          prompt: `Translate this text to ${targetLanguage}: "${text}"`,
          max_tokens: 100, 
        }),
      });

      const data = await response.json();
      return data.text || text; // Adjust this based on Qwen's response structure
    } catch (error) {
      console.error("Error fetching translation:", error);
      return text; // Return original text if there's an error
    }
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    translatePage(selectedLanguage); 
  };

  const translatePage = async (selectedLanguage) => {
    const elements = document.querySelectorAll("p, h1, h2, span, button"); 
    for (const element of elements) {
      const originalText = element.textContent;
      console.log(`Original Text: ${originalText}`);
      const translatedText = await fetchTranslation(originalText, selectedLanguage);
      element.textContent = translatedText; 
    }
  };

  const translate = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: translatePage, 
        args: [language], 
      }
    );
  };

  return (
    <div>
      <button className="p-3 bg-rose-400" onClick={() => translate()}>
        Translate
      </button>
      <br />
      <div>
        <label htmlFor="language">Select Language:</label>
        <select id="language" value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
    </div>
  );
}
