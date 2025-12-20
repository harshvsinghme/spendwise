import type { Redis } from "ioredis";
import type { UserRepository } from "../repositories/user.repository.js";

export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly redis: Redis
  ) {}

  async listUsers() {
    const cached = await this.redis.get("users:all");
    if (cached) return JSON.parse(cached);

    const users = await this.userRepo.findAll();
    await this.redis.set("users:all", JSON.stringify(users), "EX", 60);

    return users;
  }

  async createUser(id: number, name: string) {
    if (!name || name.length < 2) {
      throw new Error("Invalid user name");
    }

    return this.userRepo.create(id, name);
  }
}
