export enum AppMode {
  LYRICS = 'LYRICS',
  ART = 'ART',
  CHAT = 'CHAT'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface LyricsConfig {
  topic: string;
  genre: string;
  mood: string;
  structure: string;
}
