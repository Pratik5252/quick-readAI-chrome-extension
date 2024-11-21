import PromptAPI from "./components/PromptAPI";
import SpeechToText from "./components/SpeechToText";

function App() {
  return (
    <>
      <div>
        <h2>Speech to Text</h2>
        <SpeechToText />
        <PromptAPI />
        <hr />
      </div>
    </>
  );
}

export default App;
