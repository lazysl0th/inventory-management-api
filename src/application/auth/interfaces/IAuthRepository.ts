import type User from "#/domain/entities/User.js";
import type { TSocialProvider } from "../dtos/AuthDto.js";

export interface IAuthRepository {
  saveUser(user: User): Promise<void>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserBySocialId(
    provider: TSocialProvider,
    providerId: string,
  ): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
}
