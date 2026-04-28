import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TasksService } from './tasks.service';

@Processor('tasks')
export class TasksProcessor extends WorkerHost {
  constructor(private readonly tasksService: TasksService) {
    super();
  }

  async process(job: Job): Promise<void> {
    const task = job.data;
    console.log(`🤖 Robot picking up task ${task.id} — type: ${task.type} (attempt ${job.attemptsMade + 1})`);

    await this.tasksService.updateTaskStatus(task.id, 'processing');

    const delay = 2000 + Math.random() * 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // 30% chance of failure
    const failed = Math.random() < 0.3;
    if (failed) {
      console.log(`💥 Task ${task.id} failed on attempt ${job.attemptsMade + 1}!`);
      throw new Error(`Robot malfunction on task ${task.id}`);
    }

    await this.tasksService.updateTaskStatus(task.id, 'completed');
    console.log(`✅ Task ${task.id} completed on attempt ${job.attemptsMade + 1}!`);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job, error: Error): Promise<void> {
    const task = job.data;

    const isLastAttempt = job.attemptsMade === job.opts.attempts;

    if (isLastAttempt) {
      console.log(`❌ Task ${task.id} permanently failed after all retries.`);
      await this.tasksService.markTaskFailed(task.id);
    } else {
      console.log(`⚠️ Task ${task.id} failed attempt ${job.attemptsMade} — retrying...`);
    }
  }
}