import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const SpeechToText = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [microphoneAccess, setMicrophoneAccess] = useState(false);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser does not support speech recognition.");
      return;
    }
    // Request microphone access
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => setMicrophoneAccess(true))
      .catch((err) => console.error("Microphone access denied.", err));
  }, [browserSupportsSpeechRecognition]);

  const toggleRecording = () => {
    if (!microphoneAccess) {
      console.error("Microphone access not granted.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript(); // Clear transcript on start
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
  };

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
