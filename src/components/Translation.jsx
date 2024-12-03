/*global chrome*/
import { useState } from "react";

export default function Translation() {
  const [language, setLanguage] = useState({
    sourceLanguage: "en",
    targetLanguage: "es",
  });

  //--- NANO AI
  const fetchTranslation = async (text) => {
    try {
      const canTranslate = await self.translation.canTranslate(language);
      console.log(canTranslate);
      let translator;

      if (canTranslate !== "no") {
        if (canTranslate === "readily") {
          translator = await self.translation.createTranslator(language);
        } else {
          translator = await self.translation.createTranslator(language);
          translator.addEventListener("downloadprogress", (e) => {
            console.log("Download progress:", e.loaded, "/", e.total);
          });
          await translator.ready;
        }

        const translationResult = await translator.translate(text);
        return translationResult || text;
      } else {
        console.error(
          "Translation not available for the selected language pair."
        );
        return text;
      }
    } catch (error) {
      console.error("Error fetching translation:", error);
      return text;
    }
  };

  const handleLanguageChange = (event) => {
    const { id, value } = event.target;
    setLanguage((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const translatePage = async () => {
    const elements = document.querySelectorAll("p, h1, h2, span, button");
    for (const element of elements) {
      const originalText = element.textContent;
      console.log(`Original Text: ${originalText}`);
      const translatedText = await fetchTranslation(originalText);
      element.textContent = translatedText;
    }
  };

  const translate = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: translatePage,
      args: [],
    });
  };

  return (
    <div>
      <button className="p-3 bg-rose-400" onClick={translate}>
        Translate
      </button>
      <br />
      <div>
        <label htmlFor="sourceLanguage">Select Source Language:</label>
        <select
          id="sourceLanguage"
          value={language.sourceLanguage}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
        <br />
        <label htmlFor="targetLanguage">Select Target Language:</label>
        <select
          id="targetLanguage"
          value={language.targetLanguage}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
    </div>
  );
}
