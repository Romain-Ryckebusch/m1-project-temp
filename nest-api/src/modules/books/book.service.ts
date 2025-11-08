import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BookEntity } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly repo: Repository<BookEntity>,
  ) {}

  async create(dto: CreateBookDto): Promise<BookEntity> {
    const book = this.repo.create(dto);
    return this.repo.save(book);
  }

  async findAll(opts?: { page?: number; limit?: number; search?: string }): Promise<Paginated<BookEntity>> {
    const page = Math.max(1, Number(opts?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(opts?.limit ?? 20)));
    const search = (opts?.search ?? '').trim();

    const where = search ? { title: Like(`%${search}%`) } : {};

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { title: 'ASC', id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, meta: { total, page, limit } };
    // Note: buyers count will be provided by the sales domain later.
  }

  async findOne(id: number): Promise<BookEntity> {
    const book = await this.repo.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async update(id: number, dto: UpdateBookDto): Promise<BookEntity> {
    const existing = await this.findOne(id);
    const merged = this.repo.merge(existing, dto);
    return this.repo.save(merged);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException(`Book ${id} not found`);
  }
}
