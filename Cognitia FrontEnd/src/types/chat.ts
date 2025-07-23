export interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  hasDebate?: boolean;
  debateGenerated?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface ApiResponse {
  response: string;
}

export interface ApiRequest {
  question: string;
}

export interface PrepareRequest {
  topic: string;
}