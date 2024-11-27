import useSpeechToText from "../hooks/useSpeechToText";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

const SpeechToText = ({ setPrompt, handlePrompt }) => {
  const { transcript, listening, microphoneAccess, toggleRecording } =
    useSpeechToText({ setPrompt, handlePrompt });

  return (
    <div
      style={{
        // padding: "1rem",
        fontFamily: "Inter",
        maxWidth: "600px",
        // margin: "auto",
      }}
    >
      {/* <h1>Speech to Text</h1> */}
      {!microphoneAccess && (
        <p style={{ color: "red" }}>Please allow microphone access.</p>
      )}
      <button
        onClick={toggleRecording}
        disabled={!microphoneAccess}
        style={{ margin: "10px 0" }}
      >
        {listening ? (
          <MicOffIcon className="text-primary" />
        ) : (
          <MicIcon className="text-primary" />
        )}
      </button>
      {/* <p>{listening ? "Listening..." : "Click to start listening."}</p>
      <div style={{ marginTop: "20px" }}>
        <h2>Transcript:</h2>
        <p>{transcript || "Your transcript will appear here."}</p>
      </div> */}
    </div>
  );
};

export default SpeechToText;
