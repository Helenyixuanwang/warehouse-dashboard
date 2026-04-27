import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { CreateTaskDto, Task } from './task.interface';  // add "type" here

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.tasksService.updateTaskStatus(id, status as Task['status']);
  }
}