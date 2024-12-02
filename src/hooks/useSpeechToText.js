import { useState, useEffect, useRef } from "react";
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
  const silenceTimeout = useRef(null); // Ref for managing timeout

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

  const stopListeningWithSilenceDetection = () => {
    SpeechRecognition.stopListening();
    if (transcript.trim()) {
      handlePrompt(); // Submit the transcript if it's not empty
    }
    setPrompt(transcript);
    clearTimeout(silenceTimeout.current);
  };

  const toggleRecording = async () => {
    if (!microphoneAccess) {
      console.error("Microphone access not granted.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      clearTimeout(silenceTimeout.current);
      await setPrompt(transcript);
    } else {
      resetTranscript(); // Clear transcript on start
      setPrompt("");
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });

      // Silence detection logic
      silenceTimeout.current = setTimeout(() => {
        stopListeningWithSilenceDetection();
      }, 2000);
    }
  };

  useEffect(() => {
    if (listening && transcript) {
      // Reset silence timer on new input
      clearTimeout(silenceTimeout.current);
      silenceTimeout.current = setTimeout(() => {
        stopListeningWithSilenceDetection();
      }, 2000);
    }
  }, [transcript, listening]);

  return {
    transcript,
    listening,
    microphoneAccess,
    toggleRecording,
  };
};

export default useSpeechToText;
