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
  const silenceTimeout = useRef(null); // Ref to manage the silence timer

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

  const stopListeningWithSilenceDetection = async () => {
    SpeechRecognition.stopListening();
    if (transcript.trim()) {
      setPrompt(transcript);
      await handlePrompt(); // Automatically execute the prompt
    }
    clearTimeout(silenceTimeout.current); // Clear the silence timer
  };

  const toggleRecording = async () => {
    if (!microphoneAccess) {
      console.error("Microphone access not granted.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      clearTimeout(silenceTimeout.current);
      if (transcript.trim()) {
        setPrompt(transcript);
        await handlePrompt(); // Submit if user manually stops
      }
    } else {
      resetTranscript(); // Clear previous transcript
      setPrompt("");
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });

      // Initialize silence detection timeout
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
