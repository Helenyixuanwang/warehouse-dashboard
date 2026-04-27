import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TasksService } from './tasks.service';

@Processor('tasks')  // listens to the 'tasks' queue
export class TasksProcessor extends WorkerHost {
  constructor(private readonly tasksService: TasksService) {
  super();
}

  // This method runs automatically every time a job is pulled from the queue
  async process(job: Job): Promise<void> {
    const task = job.data;
    console.log(`🤖 Robot picking up task ${task.id} — type: ${task.type}`);

    // Mark as processing
    this.tasksService.updateTaskStatus(task.id, 'processing');

    // Simulate the robot doing physical work (2–4 seconds)
    const delay = 2000 + Math.random() * 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Mark as completed
    this.tasksService.updateTaskStatus(task.id, 'completed');
    console.log(`✅ Task ${task.id} completed!`);
  }
}