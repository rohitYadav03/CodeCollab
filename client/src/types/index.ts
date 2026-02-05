export type User = {
  id: number;
  name: string;
  color: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  username: string;
  color: string;
};

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';