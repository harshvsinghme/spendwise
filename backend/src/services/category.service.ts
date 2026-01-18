import type { Redis } from "ioredis";
import type { DB } from "../infra/db/db.js";
import type CategoryRepository from "../repositories/category.repository.js";

export default class CategoryService {
  constructor(
    private readonly catRepo: CategoryRepository,
    private readonly db: DB,
    private readonly redis: Redis
  ) {}

  async create(userId: number, data: { name: string; icon: string }) {
    await this.db.withUser(userId, (client) =>
      this.catRepo.create(client, {
        name: data.name,
        icon: data.icon,
      })
    );

    const cached = await this.redis.get(`categories:${userId}`);
    if (cached) {
      this.redis.del(`categories:${userId}`);
    }
  }

  async get(userId: number, filters: object) {
    const cached = await this.redis.get(`categories:${userId}`);
    if (cached) {
      return { categories: JSON.parse(cached) };
    }
    const categories = await this.db.withUser(userId, (client) =>
      this.catRepo.get(client, filters)
    );

    this.redis.set(`categories:${userId}`, JSON.stringify(categories), "EX", 60);
    return { categories };
  }
}
