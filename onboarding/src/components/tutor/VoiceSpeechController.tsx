'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface VoiceSpeechControllerProps {
  onSpeechResult: (text: string) => void;
  lastAiResponseText?: string;
}

export default function VoiceSpeechController({
  onSpeechResult,
  lastAiResponseText,
}: VoiceSpeechControllerProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleToggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSpeechResult(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!lastAiResponseText) return;

    // Clean markdown text for speech synthesis
    const cleanText = lastAiResponseText.replace(/[*#$`\\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Voice Mic Button */}
      <button
        type="button"
        onClick={handleToggleListening}
        className={`p-2.5 rounded-full transition-all border ${
          isListening
            ? 'bg-red-500 text-white animate-pulse border-red-600 shadow-md'
            : 'bg-white text-[#3D6B5E] border-[#1C2B27]/15 hover:bg-[#FAF7F2]'
        }`}
        title={isListening ? 'Listening... Speak now' : 'Voice Query Input (Mic)'}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      {/* Audio Playback Read-Aloud Button */}
      {lastAiResponseText && (
        <button
          type="button"
          onClick={handleToggleSpeak}
          className={`p-2.5 rounded-full transition-all border ${
            isSpeaking
              ? 'bg-[#3D6B5E] text-white border-[#3D6B5E] shadow-md animate-bounce'
              : 'bg-white text-[#D48A55] border-[#1C2B27]/15 hover:bg-[#FAF7F2]'
          }`}
          title={isSpeaking ? 'Mute Audio Read-Aloud' : 'Listen to Tutor Explanation (Audio)'}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
