// An "interface" defines the shape of an object — like a contract.
// Anything typed as Task must have exactly these fields.
export interface Task {
  id: string;
  type: 'picking' | 'packing' | 'shipping';
  robotId: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

// DTO = Data Transfer Object
// This is what the frontend sends when creating a task.
// No id, status, or createdAt yet — those get assigned by the backend.
export interface CreateTaskDto {
  type: 'picking' | 'packing' | 'shipping';
  robotId: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
}