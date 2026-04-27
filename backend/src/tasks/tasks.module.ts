import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksProcessor } from './tasks.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'tasks',
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
      },
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksProcessor],
})
export class TasksModule {}