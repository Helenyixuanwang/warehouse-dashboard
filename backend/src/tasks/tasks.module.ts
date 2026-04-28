import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksProcessor } from './tasks.processor';
import { TaskEntity } from './task.entity';

@Module({
  imports: [
    // Register TaskEntity so this module can use the repository
    TypeOrmModule.forFeature([TaskEntity]),

    BullModule.registerQueue({
  name: 'tasks',
  connection: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
    password: process.env.REDIS_PASSWORD,
  },
}),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksProcessor],
})
export class TasksModule {}