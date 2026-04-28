import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { TaskEntity } from './tasks/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // PostgreSQL connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER ?? 'warehouse',
      password: process.env.DB_PASSWORD ?? 'warehouse123',
      database: process.env.DB_NAME ?? 'warehouse_db',
      entities: [TaskEntity],
      synchronize: true,  // auto-creates tables in development — never use in production
    }),

    BullModule.forRoot({
  connection: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
    password: process.env.REDIS_PASSWORD,
  },
}),

    TasksModule,
  ],
})
export class AppModule {}