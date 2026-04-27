import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('tasks')  // maps this class to a table called 'tasks' in PostgreSQL
export class TaskEntity {

  @PrimaryGeneratedColumn('uuid')  // auto-generates a UUID for each row
  id: string;

  @Column()
  type: string;

  @Column()
  robotId: string;

  @Column()
  location: string;

  @Column()
  priority: string;

  @Column({ default: 'queued' })
  status: string;

  @CreateDateColumn()  // automatically sets to current timestamp on insert
  createdAt: Date;
}