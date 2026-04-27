import { atom } from 'jotai';

// TypeScript concept: we define the Task type here on the frontend too
// It mirrors the interface in our backend
export interface Task {
  id: string;
  type: 'picking' | 'packing' | 'shipping';
  robotId: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: string; // string on frontend (JSON dates come as strings)
}

// atom() creates a piece of global state
// The type is inferred automatically: atom<Task[]>
export const tasksAtom = atom<Task[]>([]);

// Tracks whether we are currently loading tasks from the backend
export const loadingAtom = atom<boolean>(false);