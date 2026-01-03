// Voice API abstraction layer for easy iteration and switching between providers

export interface VoiceConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
}

export interface TTSConfig {
  voice?: string;
  rate: number;
  pitch: number;
  volume: number;
}

export interface IVoiceRecognitionService {
  startListening(onResult: (transcript: string) => void, onError?: (error: string) => void): void;
  stopListening(): void;
  isSupported(): boolean;
  isListening(): boolean;
}

export interface ITextToSpeechService {
  speak(text: string, onEnd?: () => void): void;
  stop(): void;
  isSupported(): boolean;
  isSpeaking(): boolean;
}

// Web Speech API Implementation
export class WebSpeechRecognition implements IVoiceRecognitionService {
  private recognition: any = null;
  private listening: boolean = false;

  constructor(config: VoiceConfig = {
    language: 'en-US',
    continuous: false,
    interimResults: true
  }) {
    if (this.isSupported()) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = config.language;
      this.recognition.continuous = config.continuous;
      this.recognition.interimResults = config.interimResults;
    }
  }

  isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  isListening(): boolean {
    return this.listening;
  }

  startListening(onResult: (transcript: string) => void, onError?: (error: string) => void): void {
    if (!this.isSupported()) {
      onError?.('Speech recognition is not supported in this browser');
      return;
    }

    this.listening = true;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      if (event.results[event.results.length - 1].isFinal) {
        onResult(transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.listening = false;
      onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.listening = false;
    };

    try {
      this.recognition.start();
    } catch (error) {
      this.listening = false;
      onError?.('Failed to start speech recognition');
    }
  }

  stopListening(): void {
    if (this.recognition && this.listening) {
      this.recognition.stop();
      this.listening = false;
    }
  }
}

// Web Speech Synthesis Implementation
export class WebSpeechSynthesis implements ITextToSpeechService {
  private synthesis: SpeechSynthesis;
  private config: TTSConfig;
  private speaking: boolean = false;

  constructor(config: TTSConfig = {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  }) {
    this.synthesis = window.speechSynthesis;
    this.config = config;
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  isSpeaking(): boolean {
    return this.speaking || this.synthesis.speaking;
  }

  speak(text: string, onEnd?: () => void): void {
    if (!this.isSupported()) {
      console.error('Text-to-speech is not supported in this browser');
      onEnd?.();
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.config.rate;
    utterance.pitch = this.config.pitch;
    utterance.volume = this.config.volume;

    // Set voice if specified
    if (this.config.voice) {
      const voices = this.synthesis.getVoices();
      const selectedVoice = voices.find(v => v.name === this.config.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => {
      this.speaking = true;
    };

    utterance.onend = () => {
      this.speaking = false;
      onEnd?.();
    };

    utterance.onerror = () => {
      this.speaking = false;
      onEnd?.();
    };

    this.synthesis.speak(utterance);
  }

  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
      this.speaking = false;
    }
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }
}

// Factory for creating voice services - makes it easy to swap implementations
export class VoiceServiceFactory {
  static createRecognitionService(type: 'webspeech' = 'webspeech', config?: VoiceConfig): IVoiceRecognitionService {
    // Currently only WebSpeech, but you can add more implementations here
    // e.g., case 'azure': return new AzureSpeechRecognition(config);
    switch (type) {
      case 'webspeech':
      default:
        return new WebSpeechRecognition(config);
    }
  }

  static createTTSService(type: 'webspeech' = 'webspeech', config?: TTSConfig): ITextToSpeechService {
    // Currently only WebSpeech, but you can add more implementations here
    // e.g., case 'azure': return new AzureTTS(config);
    switch (type) {
      case 'webspeech':
      default:
        return new WebSpeechSynthesis(config);
    }
  }
}
