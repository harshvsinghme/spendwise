import redis from "../infra/redis/redis.js";

export async function storeRefreshToken(userId: string, token: string) {
  await redis.set(`refresh:${token}`, userId, "EX", 60 * 60 * 24 * 30);
}

export async function verifyRefreshToken(token: string) {
  return redis.get(`refresh:${token}`);
}
