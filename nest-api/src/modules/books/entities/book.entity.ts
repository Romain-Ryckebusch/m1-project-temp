import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type BookId = number;

@Entity({ name: 'books' })
export class BookEntity {
  @PrimaryGeneratedColumn()
  id!: BookId;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // image URL required by the brief
  @Column({ type: 'varchar', length: 1024, nullable: true })
  pictureUrl?: string;

  // simple FK column for now; can be replaced with a relation later
  @Column({ type: 'integer', nullable: true })
  authorId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
