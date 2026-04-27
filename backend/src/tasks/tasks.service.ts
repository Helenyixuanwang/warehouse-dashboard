import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto, Task } from './task.interface';

@Injectable()
export class TasksService {
  // In-memory store — acts as our "database" for now
  private tasks: Task[] = [];

  constructor(
    // @InjectQueue tells NestJS to inject the BullMQ queue named 'tasks'
    @InjectQueue('tasks') private taskQueue: Queue,
  ) {}

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const task: Task = {
      id: uuidv4(),
      ...dto,          // copies type, robotId, location, priority from dto
      status: 'queued',
      createdAt: new Date(),
    };

    this.tasks.push(task);

    // Add job to the queue — like Celery's .delay()
    await this.taskQueue.add('process-task', task, {
      // Lower number = higher priority in BullMQ
      priority: dto.priority === 'high' ? 1 : dto.priority === 'medium' ? 2 : 3,
    });

    return task;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  updateTaskStatus(id: string, status: Task['status']): Task | null {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
    }
    return task ?? null;
  }
}