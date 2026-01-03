// Cartesia TTS Service for high-quality voice generation

export interface CartesiaConfig {
  apiKey: string;
  voiceId?: string;
  modelId?: string;
  language?: string;
  speed?: number;
  emotion?: string;
}

export class CartesiaTTSService {
  private apiKey: string;
  private voiceId: string;
  private modelId: string;
  private language: string;
  // @ts-ignore - Configurable properties for future use
  private speed: number;
  // @ts-ignore - Configurable properties for future use
  private emotion: string;
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private speaking: boolean = false;

  constructor(config: CartesiaConfig) {
    this.apiKey = config.apiKey;
    this.voiceId = config.voiceId || 'a0e99841-438c-4a64-b679-ae501e7d6091'; // Default Cartesia voice
    this.modelId = config.modelId || 'sonic-3'; // Use sonic-3 instead of sonic-3-turbo
    this.language = config.language || 'en';
    this.speed = config.speed || 1.0;
    this.emotion = config.emotion || 'enthusiastic'; // Energetic sales person!
  }

  isSupported(): boolean {
    return typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined';
  }

  isSpeaking(): boolean {
    return this.speaking;
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  async speak(text: string, onEnd?: () => void): Promise<void> {
    if (!this.isSupported()) {
      console.error('Web Audio API is not supported');
      onEnd?.();
      return;
    }

    // Stop any ongoing speech
    this.stop();

    try {
      this.speaking = true;

      // Call Cartesia API
      const response = await fetch('https://api.cartesia.ai/tts/bytes', {
        method: 'POST',
        headers: {
          'Cartesia-Version': '2025-04-16',
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model_id: this.modelId,
          transcript: text,
          voice: {
            mode: 'id',
            id: this.voiceId
          },
          language: this.language,
          output_format: {
            container: 'wav',
            encoding: 'pcm_s16le',
            sample_rate: 44100
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Cartesia API error: ${response.status} ${response.statusText}`);
      }

      // Get audio data
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode and play audio
      const audioContext = this.getAudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      this.currentSource = source;

      source.onended = () => {
        this.speaking = false;
        this.currentSource = null;
        onEnd?.();
      };

      source.start(0);
      console.log('✅ Cartesia TTS: Playing audio');

    } catch (error) {
      console.error('Error generating Cartesia speech:', error);
      this.speaking = false;
      onEnd?.();
    }
  }

  stop(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (e) {
        // Ignore errors when stopping
      }
      this.currentSource = null;
    }
    this.speaking = false;
  }

  // Update voice settings
  setVoice(voiceId: string): void {
    this.voiceId = voiceId;
  }

  setEmotion(emotion: string): void {
    this.emotion = emotion;
  }

  setSpeed(speed: number): void {
    this.speed = Math.max(0.6, Math.min(1.5, speed)); // Clamp between 0.6 and 1.5
  }

  setLanguage(language: string): void {
    this.language = language;
  }
}

// Available Cartesia voices (popular ones)
export const CARTESIA_VOICES = {
  // Male voices
  'Confident Speaker': 'a0e99841-438c-4a64-b679-ae501e7d6091',
  'Friendly Guy': '2ee87190-8f84-4925-97da-e52547f9462c',
  'British Narrator': '79a125e8-cd45-4c13-8a67-188112f4dd22',
  
  // Female voices
  'Helpful Woman': '694f9389-aac1-45b6-b726-9d9369183238',
  'Professional Lady': 'bf991597-6c13-47e4-8411-91ec2de5c466',
  'Warm Voice': 'f9836c6e-a0bd-460e-9d3c-f7299fa60f94',
  
  // Energetic voices (good for sales)
  'Enthusiastic': 'a0e99841-438c-4a64-b679-ae501e7d6091',
  'Upbeat': '2ee87190-8f84-4925-97da-e52547f9462c'
};

// Supported emotions for Sonic-3
export const CARTESIA_EMOTIONS = [
  'neutral',
  'enthusiastic',  // Great for sales!
  'excited',
  'happy',
  'confident',
  'calm',
  'content',
  'curious',
  'friendly'
] as const;
