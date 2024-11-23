import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const useSpeechToText = ({ setPrompt, handlePrompt }) => {
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

  const toggleRecording = async () => {
    if (!microphoneAccess) {
      console.error("Microphone access not granted.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      await setPrompt(transcript);
      handlePrompt();
    } else {
      resetTranscript(); // Clear transcript on start
      setPrompt("");
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
  };

  return {
    transcript,
    listening,
    microphoneAccess,
    toggleRecording,
  };
};

export default useSpeechToText;
