
export const PRIORITY = {
  HIGH: '1',
  MEDIUM: '2',
  LOW: '3',
} as const;

export type Priority = typeof PRIORITY[keyof typeof PRIORITY];


export interface Task {
  id: string;
  title: string;
  priority: Priority;
  time?: string;
  category: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface User {
  name: string;
  email: string;
  plan: string;
  avatar: string;
}
