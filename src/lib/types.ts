export type Message = {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export type Session = {
  id: string;
  createdAt: string;
  isComplete: boolean;
  messages: Message[];
};

export type SaveStatus = 'idle' | 'saving' | 'success' | 'error';
export type ChecklistStatus = 'todo' | 'active' | 'done';

export interface ChecklistItem {
  id: number;
  label: string;
  status: ChecklistStatus;
}
