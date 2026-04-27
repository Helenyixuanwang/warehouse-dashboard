import axios from 'axios';
import type { Task } from '../store/atoms';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
});

export interface CreateTaskPayload {
  type: 'picking' | 'packing' | 'shipping';
  robotId: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
}

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await api.post<Task>('/tasks', payload);
  return response.data;
};