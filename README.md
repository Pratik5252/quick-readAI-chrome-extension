# 🌐 **Quick Read AI** 🚀

A Chrome Extension powered by **Nano AI** to enhance your browsing experience. This project was developed as part of the **Google Chrome Built-in AI Challenge** to demonstrate how to use **Chrome's built-in AI APIs**, such as **Gemini Nano**, to interact with integrated models and perform tasks like text summarization, webpage translation, and more.

## 📝 **Features**

- **Text Summarization**  
  Highlight text on any webpage and get a concise summary.

- **Web Page Translation**  
  Translate entire web pages into multiple languages instantly.

- **Basic AI Tasks**  
  Additional AI-powered utilities to improve productivity.

## ⚙️ **Technologies Used**

- **Nano AI** – AI-powered features provided by the **Gemini Nano** model.
- **React.js** – User interface built with React's component-based structure.
- **Vite** – Fast build tool for an efficient development experience.
- **Tailwind CSS** – Utility-first CSS framework for styling.
- **HTML, CSS, JavaScript** – Core technologies for building the Chrome extension functionality.


## 🚀 **Installation & Setup**

1. **Clone** the repository or download the ZIP file.
   - To clone, run:
     ```bash
     git clone https://github.com/your-username/nano-ai-chrome-extension.git
     ```

2. **Navigate** to the project directory:
   ```bash
   cd nano-ai-chrome-extension
   ```

3. **Install Dependencies**:
   Run the following command to install the required npm packages:
   ```bash
   npm install
   ```

4. **Build the Extension**:
   To build the project and prepare it for use, run:
   ```bash
   npm run build
   ```

5. **Load the Extension**:
   - Open **Chrome** and go to `chrome://extensions/`.
   - Enable **Developer Mode** at the top-right corner.
   - Click on **"Load unpacked"** and select the `dist` folder inside the project directory.


## 🖥️ **Enable Nano AI in Chrome**

Before you can use the **Nano AI** functionality in your extension, you need to enable **Gemini Nano** and the **Prompt API** in Chrome. Follow the steps below:

### **Prerequisites**

1. **Acknowledge Google’s Generative AI Prohibited Uses Policy.**
2. Download **Chrome Dev channel** (or **Canary channel**) and confirm your version is **128.0.6545.0** or newer.
3. Make sure your device meets the system requirements.
   - Ensure **at least 22 GB of free storage** space.
   - If after downloading, the available storage space falls below 10 GB, the model will be deleted.
   - On macOS, use **Disk Utility** to check free disk space.
4. After ensuring your storage, **don’t skip** this step, as some OS may show different available disk space.

### **Enable Gemini Nano and the Prompt API**

1. **Open Chrome**, and in a new tab, go to `chrome://flags/#optimization-guide-on-device-model`.
2. Select **Enabled** for **BypassPerfRequirement**. This bypasses performance checks, which might interfere with downloading Gemini Nano.
3. Go to `chrome://flags/#prompt-api-for-gemini-nano` and select **Enabled**.
4. **Relaunch Chrome**.

### **Confirm Availability of Gemini Nano**

1. Open **DevTools** and send the following in the console:
   ```javascript
   await ai.languageModel.capabilities().available;
   ```
   If it returns **“readily”**, you're all set!

2. If it fails, follow these steps:
   - Open **DevTools** and run:
     ```javascript
     await ai.languageModel.create();
     ```
     This will likely fail, but it’s expected. 

3. **Relaunch Chrome**.

4. Open a new tab and go to `chrome://components`.

5. Check if **Gemini Nano** is listed under **Optimization Guide On Device Model**, with a version **≥ 2024.5.21.1031**.
   - If no version is listed, click **Check for update** to force the download.

6. After the model has downloaded and updated:
   - Open **DevTools** and run:
     ```javascript
     await ai.languageModel.capabilities().available;
     ```
     If it returns **“readily”**, you are ready to use Gemini Nano.

If this still doesn’t work, refer to the troubleshooting section below.


## 💡 **Demo**

With the **Prompt API** enabled, you can head over to the Chrome Dev Playground to try out Gemini Nano:
[Chrome Dev Playground - Prompt API](https://chrome.dev/web-ai-demos/prompt-api-playground/)


## 🖥️ **Usage**

- Click the extension icon in the Chrome toolbar.
- Choose a task (Summarize text, Translate webpage, etc.).
- Wait a moment for **Nano AI** to process the task and provide results.


## 🤝 **Contributing**

Want to improve the extension? Here’s how:

1. **Fork** the repository.
2. **Clone** it to your local machine.
3. Make changes or fix bugs.
4. **Submit** a pull request with your improvements.

All contributions are welcome!


## 📄 **License**

This project is licensed under the [MIT License](LICENSE).
