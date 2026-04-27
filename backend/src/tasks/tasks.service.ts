import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import type { CreateTaskDto, Task } from './task.interface';
import { TaskEntity } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectQueue('tasks') private taskQueue: Queue,

    // @InjectRepository gives us a TypeORM repository for TaskEntity
    // A repository is like a helper object with methods:
    // .save(), .find(), .findOne(), .update(), .delete()
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async createTask(dto: CreateTaskDto): Promise<TaskEntity> {
    // Create a new entity instance
    const task = this.taskRepository.create({
      ...dto,
      status: 'queued',
    });

    // Save to PostgreSQL
    const saved = await this.taskRepository.save(task);

    // Add to BullMQ queue
    await this.taskQueue.add('process-task', saved, {
      priority: dto.priority === 'high' ? 1 : dto.priority === 'medium' ? 2 : 3,
    });

    return saved;
  }

  async getAllTasks(): Promise<TaskEntity[]> {
    // Find all tasks, newest first
    return this.taskRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async updateTaskStatus(id: string, status: Task['status']): Promise<TaskEntity | null> {
    // Update the status column for this id
    await this.taskRepository.update(id, { status });

    // Return the updated entity
    return this.taskRepository.findOne({ where: { id } });
  }
}