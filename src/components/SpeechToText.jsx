import useSpeechToText from "../hooks/useSpeechToText";

const SpeechToText = ({ setPrompt, handlePrompt }) => {
  const { transcript, listening, microphoneAccess, toggleRecording } =
    useSpeechToText({ setPrompt, handlePrompt });

  return (
    <div
      style={{
        padding: "1rem",
        fontFamily: "Arial",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h1>Speech to Text</h1>
      {!microphoneAccess && (
        <p style={{ color: "red" }}>Please allow microphone access.</p>
      )}
      <button
        onClick={toggleRecording}
        disabled={!microphoneAccess}
        style={{ margin: "10px 0" }}
      >
        {listening ? "Stop Listening" : "Start Listening"}
      </button>
      <p>{listening ? "Listening..." : "Click to start listening."}</p>
      <div style={{ marginTop: "20px" }}>
        <h2>Transcript:</h2>
        <p>{transcript || "Your transcript will appear here."}</p>
      </div>
    </div>
  );
};

export default SpeechToText;
