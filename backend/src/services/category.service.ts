import type { Redis } from "ioredis";
import type { DB } from "../infra/db/db.js";
import type CategoryRepository from "../repositories/category.repository.js";

export default class CategoryService {
  constructor(
    private readonly catRepo: CategoryRepository,
    private readonly db: DB,
    private readonly redis: Redis
  ) {
    // TODO: let's use redis at required place and remove from here
    this.redis.ping();
  }

  async create(userId: number, data: { name: string; icon: string }) {
    await this.db.withUser(userId, (client) =>
      this.catRepo.create(client, {
        name: data.name,
        icon: data.icon,
      })
    );
  }
}
