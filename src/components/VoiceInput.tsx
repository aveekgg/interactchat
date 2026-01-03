import React, { useState, useEffect, useRef } from 'react';
import { VoiceServiceFactory } from '../services/voiceService';
import { CartesiaTTSService } from '../services/cartesiaService';
import './VoiceInput.css';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  ttsService?: CartesiaTTSService | null;
  continuous?: boolean; // Enable continuous listening mode
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript, 
  disabled, 
  ttsService,
  continuous = false 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const voiceServiceRef = useRef<any>(null);
  const restartTimeoutRef = useRef<number | null>(null);

  // Initialize voice service with continuous mode if enabled
  useEffect(() => {
    voiceServiceRef.current = VoiceServiceFactory.createRecognitionService('webspeech', {
      language: 'en-US',
      continuous: continuous,
      interimResults: true
    });

    return () => {
      // Cleanup on unmount
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stopListening();
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [continuous]);

  const startListening = () => {
    const voiceService = voiceServiceRef.current;
    
    if (!voiceService || !voiceService.isSupported()) {
      setError('Voice input is not supported in this browser');
      return;
    }

    // Stop any ongoing speech before starting to listen
    if (ttsService?.isSpeaking()) {
      ttsService.stop();
    }

    setIsListening(true);
    setError(null);

    voiceService.startListening(
      (transcript: string) => {
        if (transcript.trim()) {
          // Stop speech if user speaks during AI response
          if (ttsService?.isSpeaking()) {
            ttsService.stop();
          }
          
          onTranscript(transcript);
          
          // In continuous mode, keep listening after processing
          if (!continuous) {
            setIsListening(false);
          }
        }
      },
      (error: string) => {
        console.error('Voice recognition error:', error);
        
        // Handle "no-speech" error gracefully in continuous mode
        if (continuous && error === 'no-speech') {
          // Restart listening after a brief pause
          restartTimeoutRef.current = setTimeout(() => {
            if (isListening) {
              startListening();
            }
          }, 1000);
        } else {
          setIsListening(false);
          setError(error);
          setTimeout(() => setError(null), 3000);
        }
      }
    );
  };

  const stopListening = () => {
    const voiceService = voiceServiceRef.current;
    
    if (voiceService) {
      voiceService.stopListening();
    }
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    setIsListening(false);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="voice-input-wrapper">
      <button
        onClick={handleVoiceInput}
        disabled={disabled}
        className={`voice-button ${isListening ? 'listening' : ''}`}
        title={isListening ? 'Listening... Click to stop' : 'Click to speak'}
      >
        {isListening ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2">
              <animate attributeName="r" from="8" to="12" dur="1s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite"/>
            </circle>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        )}
      </button>
      {error && <div className="voice-error">{error}</div>}
    </div>
  );
};

export default VoiceInput;
