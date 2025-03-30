
export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export interface ChatOption {
  id: string;
  label: string;
  value: string;
}
